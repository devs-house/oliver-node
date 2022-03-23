import { prop } from 'ramda';
import { log } from './logger';
import { OLError } from './entities/Error';
import { failure, Result, success } from './entities/Result';

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

export type ApiClient = {
  request: (target: ApiTarget) => Promise<Result<Record<string, any>>>;
};

export const apiClient = (
  baseUrl: string,
  customHeaders: Record<string, string>,
  accessToken: string,
  tokenUpdateHandler: (target: ApiTarget) => Promise<string>,
  invalidAuthenticationHandler: (target: ApiTarget) => Promise<void>,
): ApiClient => {
  const request = async (target: ApiTarget) => {
    return sendRequest(target, target.retryCount ?? 2);
  };

  const sendRequest = async (
    target: ApiTarget,
    retryCount: number,
  ): Promise<Result<Record<string, any>>> => {
    logRequest(target);

    const req = target.request;
    const url = baseUrl + req.endPoint;

    let headers: Record<string, string> = customHeaders;
    headers['content-type'] = 'application/json';
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

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

      if (statusCode === 403) {
        if (retryCount < 1) {
          invalidAuthenticationHandler(target);
          throw Error('Access Denied');
        } else {
          await tokenUpdateHandler(target);
          return await sendRequest(target, retryCount - 1);
        }
      }

      const data = await result.json();
      logResponse(target, data, { statusCode });
      return parse(data);
    } catch (error) {
      return failure(OLError.someThingWentWrong());
    }
  };

  const logRequest = (target: ApiTarget) => {
    log('Api Request', [
      `URL: ${baseUrl + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Target: ${JSON.stringify(target, null, 2)}`,
      `Parameters: ${JSON.stringify(target.request.parameters, null, 2)}`,
    ]);
  };

  const logResponse = (
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

  const parse = (response?: ApiResponse): Result<Record<string, any>> => {
    if (!response) throw Error('data is empty');

    const data = prop('data', response);
    const error = prop('error', response);
    const isSuccess = prop('success', response);

    if (isSuccess && data) {
      return success(data);
    } else if (!isSuccess && error && error.type === ErrorType.hard) {
      return failure(OLError.apiDisplayable(error));
    } else if (!isSuccess && error && error.type === ErrorType.soft) {
      let updatedData = data ?? {};
      updatedData['error'] = error;
      updatedData['ret_code'] = response.retCode;
      return success(updatedData);
    } else {
      return failure(OLError.someThingWentWrong());
    }
  };

  return { request };
};
