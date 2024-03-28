export interface IMineRoleResponse {
  count: 0;
  rolePermissionData: IRolePermissionItem[];
}

export interface IRolePermissionItem {
  role: IRole;
  permissions: IPermission[];
}

export interface IRole {
  id: number;
  createdDate: string;
  modifiedDate: string;
  name: string;
  displayName: string;
  systemSource: number;
  description: string;
}

export interface IPermission {
  id: number;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  displayName: string;
  description: string;
  isSystem: boolean;
}

export enum FrontRolePermissionEnum {
  CanViewCameraAiHomePage = "CanViewCameraAiHomePage",
  CanSwitchCameraAiBackEnd = "CanSwitchCameraAiBackEnd",
  CanViewCameraAiLiveMonitorPage = "CanViewCameraAiLiveMonitorPage",
  CanExportExcelCameraAiLiveMonitor = "CanExportExcelCameraAiLiveMonitor", // mock字段未出
  CanViewCameraAiVideoPlaybackPage = "CanViewCameraAiVideoPlaybackPage",
  CanExportVideoCameraAi = "CanExportVideoCameraAi",
  CanViewCameraAiWarningListPage = "CanViewCameraAiWarningListPage",
  CanExportExcelCameraAiWarning = "CanExportExcelCameraAiWarning",
  CanViewDetailCameraAiWarning = "CanViewDetailCameraAiWarning",
  CanMarkCameraAiWarning = "CanMarkCameraAiWarning",
  CanViewCameraAiFeedbackListPage = "CanViewCameraAiFeedbackListPage",
  CanExportExcelCameraAiFeedback = "CanExportExcelCameraAiFeedback",
  CanViewDetailCameraAiFeedback = "CanViewDetailCameraAiFeedback",
}
