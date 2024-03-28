import { IStatusType } from "./default";

export interface IRegisterRecordRequest {
  recordId: number;
  exceptionReason?: string;
  recordStatus: IStatusType;
}
