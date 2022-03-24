export interface OLErrorProtocol extends Error {
  name: string;
  message: string;
  type: ErrorType;
}

enum ErrorType {
  soft = 0,
  hard = 1,
}

export const OLError = {
  someThingWentWrong: (): OLErrorProtocol => ({
    name: 'Oopps!',
    message: 'Something went wrong',
    type: ErrorType.hard,
  }),
  apiDisplayable: (apiError: {
    name: string;
    message: string;
    type: ErrorType;
  }): OLErrorProtocol => ({
    name: apiError.name,
    message: apiError.message,
    type: apiError.type,
  }),
  accessDenied: (): OLErrorProtocol => ({
    name: 'Access Denied',
    message: 'Your authorization expired, please try again',
    type: ErrorType.hard,
  }),
};
