import { ApiClient } from '../apiClient';
import { Result, success } from '../entities/Result';
import { parseRoomLink } from '../typeMaps';
import { RoomLink as Link, RoomLink } from '../types';

export const linkRepository = (apiClient: ApiClient) => ({
  createLink: async (
    name: string,
    url: string,
    type: number,
  ): Promise<Result<Link>> => {
    const response = await apiClient.request({
      request: {
        method: 'POST',
        endPoint: '/link',
        parameters: { name: name, type: type, url: url },
      },
    });

    switch (response.type) {
      case 'success':
        const link = parseRoomLink(response.value as Link);
        return success(link);

      case 'error':
        return response;
    }
  },

  updateLink: async (
    linkId: string,
    name: string,
    url: string,
  ): Promise<Result<Link>> => {
    const response = await apiClient.request({
      request: {
        method: 'PUT',
        endPoint: '/link',
        parameters: { link_id: linkId, name: name, url: url },
      },
    });

    switch (response.type) {
      case 'success':
        const link = parseRoomLink(response.value as Link);
        return success(link);

      case 'error':
        return response;
    }
  },

  deleteLink: async (linkId: string): Promise<Result<Link>> => {
    const response = await apiClient.request({
      request: {
        method: 'DELETE',
        endPoint: '/link',
        parameters: { link_id: linkId },
      },
    });

    switch (response.type) {
      case 'success':
        const link = parseRoomLink(response.value as Link);
        return success(link);

      case 'error':
        return response;
    }
  },
});
