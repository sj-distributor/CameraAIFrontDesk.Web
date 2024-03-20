export interface IImgProps {
  url: string;
  title: string;
  type: CssType;
  onClickFunction: () => void;
}

export enum CssType {
  Area,
  Equipment,
}
