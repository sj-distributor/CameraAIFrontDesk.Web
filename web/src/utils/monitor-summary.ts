import { ICameraAiMonitorType, IRecordItem } from "@/dtos/default";

export const renderAlertText = (record: IRecordItem): string => {
  switch (record.monitorType) {
    case ICameraAiMonitorType.TouchGoods:
      return "識別人員出現違規觸摸二層貨物";

    case ICameraAiMonitorType.Forklift:
      return "識別叉車熒光帶不匹配，違規駕駛";

    case ICameraAiMonitorType.FloorWater:
      return "識別地面有水跡現象";

    case ICameraAiMonitorType.FloorIce:
      return "識別地面有結冰現象";

    case ICameraAiMonitorType.DoorSafety:
    case ICameraAiMonitorType.DoorRolling:
      return `識別${record.name}打開超過${record.settingDuration}秒`;

    case ICameraAiMonitorType.Move:
      return `識別員工違規搬貨超過${record.settingDuration}次`;

    case ICameraAiMonitorType.FallDown:
      return "識別有人員跌倒的情況";

    case ICameraAiMonitorType.Antiskid:
      return `識別未使用防滑膠墊超過${record.settingDuration}秒`;

    case ICameraAiMonitorType.ForkliftFork:
      return "識別有叉車升降移動的違規情況";

    case ICameraAiMonitorType.Tidy:
      return `識別場地環境衛生出現違規情況超過${record.settingDuration}秒`;

    case ICameraAiMonitorType.TrashCanLid:
      return `識別垃圾桶打開超過${record.settingDuration}秒`;

    case ICameraAiMonitorType.Costume:
      return `${record.name}未配戴${record.costumesDetected}出現超過${record.settingDuration}秒`;

    default:
      return `${record.monitorTypeName}(${record.name})出現超過${record.settingDuration}秒`;
  }
};
