import { prop } from 'ramda';
import { log } from './logger';
import { OLError } from './entities/Error';
import { failure, Result, success } from './entities/Result';
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

export class ApiClient {
  // MARK: - Properties

  readonly baseUrl: string;
  readonly userKey: KeyPair;

  // MARK: - Life Cycle

  constructor(baseUrl: string, userKey: KeyPair) {
    this.baseUrl = baseUrl;
    this.userKey = userKey;
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
      const result = await (encoding === ParameterEncoding.query
        ? fetch(url + '?' + new URLSearchParams(req.parameters), {
            method: req.method,
            headers: headers,
          })
        : fetch(url, {
            method: req.method,
            headers: headers,
            body: JSON.stringify(req.parameters),
          }));

      const statusCode = result.status;

      const data = await result.json();
      this.logResponse(this.baseUrl, target, data, { statusCode });
      return this.parse(data);
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
    data?: Record<string, any>,
    response?: { statusCode: number },
  ) => {
    log('Api Response', [
      `URL: ${baseUrl + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Status: ${response?.statusCode ?? 0}`,
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
