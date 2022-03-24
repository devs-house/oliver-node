import { prop } from 'ramda';
import { ApiClient } from '../apiClient';
import { Result, success } from '../entities/Result';
import { roomKeyHeader } from '../roomKeyHeader';
import { parseInvitation } from '../typeMaps';
import { AccessLevel, Invitation, InvitationType, KeyPair } from '../types';

export const invitationRepository = (
  apiClient: ApiClient,
  roomKey?: KeyPair,
) => ({
  createInvitation: async (
    type: InvitationType,
    email: string,
    firstName: string,
    lastName: string,
    notes: string,
    roomId: string,
  ): Promise<Result<Invitation>> => {
    const levels: Record<InvitationType, AccessLevel | null> = {
      admin: AccessLevel.admin,
      moderator: AccessLevel.moderator,
      member: null,
    };

    const response = await apiClient.request(
      {
        request: {
          method: 'POST',
          endPoint: '/invitation',
          parameters: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            notes: notes,
            room_id: roomId,
            collaborator_access_level: levels[type],
          },
        },
      },
      roomKeyHeader(roomKey),
    );

    switch (response.type) {
      case 'success':
        const json = response.value;
        const invitation = parseInvitation(prop('invitation', json));
        return success(invitation);

      case 'error':
        return response;
    }
  },

  updateInvitation: async (
    invitationId: string,
    firstName: string,
    lastName: string,
    notes: string,
  ): Promise<Result<Invitation>> => {
    const response = await apiClient.request(
      {
        request: {
          method: 'PUT',
          endPoint: '/invitation',
          parameters: {
            invitation_id: invitationId,
            first_name: firstName,
            last_name: lastName,
            notes: notes,
          },
        },
      },
      roomKeyHeader(roomKey),
    );

    switch (response.type) {
      case 'success':
        const json = response.value;
        const invitation = parseInvitation(prop('invitation', json));
        return success(invitation);

      case 'error':
        return response;
    }
  },

  deleteInvitation: async (
    invitationId: string,
  ): Promise<Result<Invitation>> => {
    const response = await apiClient.request(
      {
        request: {
          method: 'DELETE',
          endPoint: '/invitation',
          parameters: {
            invitation_id: invitationId,
          },
        },
      },
      roomKeyHeader(roomKey),
    );

    switch (response.type) {
      case 'success':
        const json = response.value;
        const invitation = parseInvitation(prop('invitation', json));
        return success(invitation);

      case 'error':
        return response;
    }
  },
});
