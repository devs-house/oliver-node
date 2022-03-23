export interface OLErrorProtocol extends Error {
  title: string;
  message: string;
  type: ErrorType;
  displayable: boolean;
  completion: (success: boolean) => void;
  actionTitle: string | undefined;
}

enum ErrorType {
  soft = 0,
  hard = 1,
}

export const OLError = {
  someThingWentWrong: (completion?: (success: boolean) => void, actionTitle?: string): OLErrorProtocol => ({
    name: 'Something went wrong',
    title: 'Oopps!',
    message: 'Something went wrong',
    type: ErrorType.hard,
    displayable: true,
    completion: completion ?? ((_) => {}),
    actionTitle: actionTitle,
  }),
  apiDisplayable: (
    apiError: {
      title: string;
      message: string;
      type: ErrorType;
    },
    completion?: (success: boolean) => void,
    actionTitle?: string,
  ): OLErrorProtocol => ({
    name: 'Api Displayable',
    title: apiError.title,
    message: apiError.message,
    type: apiError.type,
    displayable: true,
    completion: completion ?? ((_) => {}),
    actionTitle: actionTitle,
  }),
  accessDenied: (completion?: (success: boolean) => void, actionTitle?: string): OLErrorProtocol => ({
    name: 'Access Denied',
    title: 'Access Denied',
    message: 'Your authorization expired, please try again',
    type: ErrorType.hard,
    displayable: true,
    completion: completion ?? ((_) => {}),
    actionTitle: actionTitle,
  }),
};
