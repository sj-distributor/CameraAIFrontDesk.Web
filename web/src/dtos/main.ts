export interface IAcceptWarnDataProps {
  telephone: string;
  weCom: string;
  mailbox: string;
}

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
