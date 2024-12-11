export interface IAddTeamDataProps {
  logoUrl?: string;
  teamName: string;
}

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
