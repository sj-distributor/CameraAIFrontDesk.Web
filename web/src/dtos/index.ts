export interface IUserInfo {
  userName: string;
  password: string;
  loginType: LoginTypeEnum;
}

export enum LoginTypeEnum {
  Self,
  OA,
  OME,
}
