export interface INewTeamDtoProps {
  openNewTeam: boolean;
  isUploading: boolean;
  addTeamLoading: boolean;
}

export interface IAcceptWarnDtoProps {
  openAcceptWran: boolean;
  acceptWarnLoading: boolean;
}

export interface IGetAttachUrlProps {
  fileUrl: string;
  fileName: string;
  id?: number;
  uuid?: string;
  createDate?: string;
  fileSize?: number;
  filePath?: string;
  title?: string;
}

export interface ICreateTeamProps {
  team: IAddTeamDataProps;
}

export interface IAddTeamDataProps {
  avatarUrl: string;
  name: string;
}

export interface ITeamListProps {
  id: string;
  name: string;
  leaderId: string;
  tenantId: string;
  avatarUrl: string;
}

export enum UserStatus {
  Disable,
  Enable,
}

export enum UserProfileOriginType {
  Off,
  On,
}

export interface IUserDataItem {
  id: number;
  staffId: string;
  name: string;
  department: string;
  group: string;
  position: string;
  positionStatus: string;
  phone: string;
  email: string;
  wechatName: string;
  isQualified: boolean;
  status: UserStatus;
  from: UserProfileOriginType;
  isDeleted: boolean;
  createdTime: string;
}

export interface IGetUserNotificationRequest {
  UserProfileId?: string;
  TeamId: string;
}

export interface IGetUserNotificationResponse {
  userProfileNotificationDto: IUserProfileNotificationDto;
}

export interface IUserProfileNotificationDto {
  id: string;
  email: string;
  phone: string;
  workWechat: string;
}
