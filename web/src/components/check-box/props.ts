export interface ICheckBoxComponentProps {
  title: string;
  selectValues: number[];
  monitorSummary?: boolean;
  onClick: (id: number) => void;
}
