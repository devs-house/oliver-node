import { OLErrorProtocol } from './Error';

export type ResultSuccess<T> = { type: 'success'; value: T; success: true };
export type ResultError = {
  type: 'error';
  error: OLErrorProtocol;
  success: false;
};
export type Result<T> = ResultSuccess<T> | ResultError;

export const success = <T>(value: T): ResultSuccess<T> => ({
  type: 'success',
  value: value,
  success: true,
});

export const failure = (error: OLErrorProtocol): ResultError => ({
  type: 'error',
  error: error,
  success: false,
});
