import { ApiClient, ErrorType } from './apiClient';
import { config, Config, Environment } from './config';
import { OLError } from './entities/Error';
import { failure, Result, success } from './entities/Result';
import { invitationRepository } from './repositories/invitationRepository';
import { linkRepository } from './repositories/linkRepository';
import { roomRepository } from './repositories/roomRepository';
import { userRepository } from './repositories/userRepository';
import {
  Invitation,
  InvitationType,
  KeyPair,
  Room,
  RoomBanner,
  RoomLink,
  RoomLinkType,
  RoomPrivacyType,
} from './types';

export class OliverClient {
  // MARK: - Properties

  readonly config: Config;
  readonly userKey: KeyPair;
  readonly apiClient: ApiClient;

  // MARK: - Life Cycle

  constructor(env: Environment, userKey: KeyPair) {
    this.config = config[env];
    this.userKey = userKey;
    this.apiClient = new ApiClient(this.config.apiUrl, userKey);
  }

  // MARK: - Entry Points

  private user = () => userRepository(this.apiClient);
  private link = () => linkRepository(this.apiClient);
  private room = (roomKey?: KeyPair) => roomRepository(this.apiClient, roomKey);
  private invitation = (roomKey?: KeyPair) =>
    invitationRepository(this.apiClient, roomKey);

  // MARK: - Methods

  public createRoom = async (
    title: string,
    description: string,
    media: { square: string; horizontal: string },
    date: { start: number; end?: number },
    links: { type: RoomLinkType; name: string; url: string }[],
    privacyType: RoomPrivacyType,
    configuration: {
      chat_enabled: boolean;
      share_enabled: boolean;
      see_more_enabled: boolean;
      banners: RoomBanner[];
    },
    location: {
      address: string;
      title: string;
      latitude: number;
      longitude: number;
      province: string;
      city: string;
      country: string;
      zip_code: number;
    } | null = null,
    accessCodes: string[] = [],
  ): Promise<Room> => {
    const linkCreatePromises = links
      .filter((link) => !!link.url && !!link.type && !!link.name)
      .map((link) => this.link().createLink(link.name, link.url, link.type));

    const linkCreateResponses = await Promise.all(linkCreatePromises);
    const linkIds: string[] = [];
    for (const linkResponse of linkCreateResponses) {
      if (linkResponse.success) {
        linkIds.push(linkResponse.value.id);
      } else {
        throw OLError.apiDisplayable({
          type: ErrorType.hard,
          title: 'Link Creation',
          message: 'Link creation failed',
        });
      }
    }

    const response = await this.room().createRoom({
      title: title,
      overview: description,
      start_date: date.start,
      end_date: date.end ?? 0,
      media: { url: media.square, web_banner_url: media.horizontal },
      tags: [],
      config: configuration,
      location: location,
      privacy_type: privacyType,
      link_ids: linkIds,
      access_codes: accessCodes,
    });

    if (response.success) return response.value.room;
    else throw response.error;
  };

  public inviteUser = async (
    type: InvitationType,
    roomId: string,
    firstName: string,
    lastName: string,
    email: string,
    notes?: string,
    roomKey?: KeyPair,
  ): Promise<Invitation> => {
    const response = await this.invitation(roomKey).createInvitation(
      type,
      email,
      firstName,
      lastName,
      notes ?? '',
      roomId,
    );

    if (response.success) return response.value;
    else throw response.error;
  };
}
