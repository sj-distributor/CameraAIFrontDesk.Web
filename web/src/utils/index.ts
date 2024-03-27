import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import ExcelJS, { Workbook } from "ExcelJS";
import saveAs from "file-saver";

export interface IExcelProps {
  header: string;
  key: string;
  width: number;
}
const DEFAULT_COLUMN_WIDTH = 20;

export const onDownLoadWorkbook = (
  columns: ColumnsType<string[]>,
  rows: any[]
) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Me";
  workbook.lastModifiedBy = "Her";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  const worksheet = workbook.addWorksheet("My Sheet");

  worksheet.columns = generateTableHeaders(columns);
  worksheet.addRows(rows);
  saveWorkbook(
    workbook,
    `${"create at " + dayjs(new Date()).format("MM-DD-YYYY hh-mm")}.xlsx`
  );
};

const saveWorkbook = (workbook: Workbook, fileName: string) => {
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: "" });

    saveAs(blob, fileName);
  });
};

const generateTableHeaders = (columns: ColumnsType<string[]>) => {
  const excel: IExcelProps[] = [];

  columns.map((item) => {
    excel.push({
      header: item?.title?.toString() || "",
      key: item?.key?.toString() || "",
      width: Number(item?.width) / 5 || DEFAULT_COLUMN_WIDTH,
    });
  });

  return excel;
};
