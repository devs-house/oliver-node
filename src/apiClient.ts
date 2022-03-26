import * as axios from 'axios';
import { prop } from 'ramda';
import { OLError } from './entities/Error';
import { failure, Result, success } from './entities/Result';
import { log } from './logger';
import { KeyPair } from './types';

export type ApiTarget = {
  request: ApiRequest;
  retryCount?: number;
};

export type ApiRequest = {
  method: Method;
  endPoint: string;
  parameters: Record<string, any>;
  encoding?: ParameterEncoding;
};

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';

export enum ParameterEncoding {
  body,
  query,
}

export type ApiResponse = {
  success: boolean;
  retCode: number;
  data?: Record<string, any>;
  error?: ApiError;
};

export interface ApiError extends Error {
  title: string;
  message: string;
  type: ErrorType;
}

export enum ErrorType {
  soft = 0,
  hard = 1,
}

type AxiosConfig = {
  token: string;
  url: string;
  axiosOptions?: axios.AxiosRequestConfig;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  qs?: Record<string, string>;
  serviceName?: string;
};

export type ClientOptions = {
  timeout?: number;
};

export class ApiClient {
  // MARK: - Properties

  readonly options: ClientOptions;
  readonly baseUrl: string;
  readonly userKey: KeyPair;
  readonly instance: axios.AxiosInstance;

  // MARK: - Life Cycle

  constructor(
    baseUrl: string,
    userKey: KeyPair,
    options: ClientOptions = { timeout: 10 * 1000 },
  ) {
    this.options = options;
    this.baseUrl = baseUrl;
    this.userKey = userKey;

    this.instance = axios.default.create({
      timeout: this.options.timeout, // 10 seconds
      withCredentials: false, // making sure cookies are not sent
    });
  }

  // MARK: - Request

  public request = async (
    target: ApiTarget,
    headers: Record<string, string> = {},
  ): Promise<Result<Record<string, any>>> => {
    this.logRequest(this.baseUrl, target);

    const req = target.request;
    const url = this.baseUrl + req.endPoint;

    headers['content-type'] = 'application/json';
    headers['api-key'] = this.userKey.apiKey;
    headers['api-secret'] = this.userKey.apiSecret;

    const queryMethods = ['GET', 'DELETE'];
    const encoding =
      req.encoding ?? queryMethods.includes(req.method)
        ? ParameterEncoding.query
        : ParameterEncoding.body;

    try {
      try {
        const result = await (encoding === ParameterEncoding.query
          ? this.instance({
              url: url,
              method: target.request.method,
              headers: headers,
              data: req.parameters,
            })
          : this.instance({
              url: url,
              method: target.request.method,
              headers: headers,
              data: req.parameters,
            }));

        this.logResponse(this.baseUrl, target, result.data, result.status);
        return this.parse(result.data);
      } catch (error: any) {
        const result = error.response;
        this.logResponse(this.baseUrl, target, result.data, result.status);
        return this.parse(result.data);
      }
    } catch (error) {
      return failure(OLError.someThingWentWrong());
    }
  };

  // MARK: - Helpers

  private logRequest = (baseUrl: string, target: ApiTarget) => {
    log('Api Request', [
      `URL: ${baseUrl + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Target: ${JSON.stringify(target, null, 2)}`,
      `Parameters: ${JSON.stringify(target.request.parameters, null, 2)}`,
    ]);
  };

  private logResponse = (
    baseUrl: string,
    target: ApiTarget,
    data: any,
    status: number,
  ) => {
    log('Api Response', [
      `URL: ${baseUrl + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Status: ${status}`,
      `Target: ${JSON.stringify(target, null, 2)}`,
      `Parameters: ${JSON.stringify(target.request.parameters, null, 2)}`,
      `Data: ${JSON.stringify(data, null, 2)}`,
    ]);
  };

  private parse = (response?: ApiResponse): Result<Record<string, any>> => {
    if (!response) throw Error('data is empty');

    const data = prop('data', response);
    const error = prop('error', response);
    const isSuccess = prop('success', response);

    if (isSuccess && data) {
      return success(data);
    } else if (!isSuccess && error && error.type === ErrorType.hard) {
      return failure(OLError.apiDisplayable(error));
    } else if (!isSuccess && error && error.type === ErrorType.soft) {
      const updatedData = data ?? {};
      updatedData['error'] = error;
      updatedData['ret_code'] = response.retCode;
      return success(updatedData);
    } else {
      return failure(OLError.someThingWentWrong());
    }
  };
}
