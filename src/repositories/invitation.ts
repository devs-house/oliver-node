import { prop } from 'ramda';
import { oliver } from '..';
import { Result, success } from '../entities/Result';
import { parseInvitation } from '../typeMaps';
import { AccessLevel, Invitation, InvitationType } from '../types';

export const createInvitation = async (parameters: {
  type: InvitationType;
  room_id: string;
  email: string;
  first_name: string;
  last_name: string;
  notes?: string;
}): Promise<Result<Invitation>> => {
  const levels: Record<InvitationType, AccessLevel | null> = {
    admin: AccessLevel.admin,
    moderator: AccessLevel.moderator,
    member: null,
  };

  const response = await oliver.apiClient.request({
    request: {
      method: 'POST',
      endPoint: '/invitation',
      parameters: {
        ...parameters,
        invitation_type:
          parameters.type === 'member' ? 'subscriber' : 'collaborator',
        notes: parameters.notes ?? '',
        collaborator_access_level: levels[parameters.type],
      },
    },
  });

  switch (response.type) {
    case 'success':
      const json = response.value;
      const invitation = parseInvitation(prop('invitation', json));
      return success(invitation);

    case 'error':
      return response;
  }
};

export const deleteInvitation = async (
  invitationId: string,
): Promise<Result<Invitation>> => {
  const response = await oliver.apiClient.request({
    request: {
      method: 'DELETE',
      endPoint: '/invitation',
      parameters: {
        invitation_id: invitationId,
      },
    },
  });

  switch (response.type) {
    case 'success':
      const json = response.value;
      const invitation = parseInvitation(prop('invitation', json));
      return success(invitation);

    case 'error':
      return response;
  }
};
