import { prop } from 'ramda';
import { ApiClient } from '../apiClient';
import { Result, success } from '../entities/Result';
import { parseUser, parseUserSettings } from '../typeMaps';
import { User, UserSettings } from '../types';

type UserResponse = Result<{
  user: User;
  settings: UserSettings;
}>;

export const userRepository = (apiClient: ApiClient) => ({
  fetchUserByEmail: async (email: string): Promise<UserResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'GET',
        endPoint: '/userByEmail',
        parameters: { email: email },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const user = parseUser(prop('user', json));
        const settings = parseUserSettings(prop('settings', json));
        return success({ user, settings });

      case 'error':
        return response;
    }
  },

  fetchUserById: async (userId: string): Promise<UserResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'GET',
        endPoint: '/user',
        parameters: { id: userId },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const user = parseUser(prop('user', json));
        const settings = parseUserSettings(prop('settings', json));
        return success({ user, settings });

      case 'error':
        return response;
    }
  },
});
