import FileSaver from "file-saver";
import { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import XLSX from 'sheetjs-style';
import { FormatoColombiaDDMMYYYHHmmss } from "../Constants";
import { errorDialog } from "./ConfirmDialog";
import { locateFormatNumberNDijitos, locateFormatPercentNDijitos } from "../Helper";
export function DescargarExcel(datos: any[], columnas: MRT_ColumnDef<any>[], NombreArchivo: string) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.xlsx';

    if (datos !== undefined && datos.length > 0) {

        let finaldata = datos.map((item: any) => {

            let Objeto = {};
            // iteramos las columnas que debemos usar
            columnas.forEach((columna) => {
                if (columna.columns != undefined) {
                    columna.columns.forEach((columna2) => {
                        let nombreCampo: string = columna2.accessorKey as string;
                        let valuen = item[nombreCampo];
                        Objeto[nombreCampo] =
                            (columna2.header.includes('%') ? locateFormatPercentNDijitos(valuen, 2) :
                                (!isNaN(valuen)) ? valuen : ((moment(valuen).isValid()) ? moment(valuen).format(FormatoColombiaDDMMYYYHHmmss) : valuen));
                    });
                }
                else {
                    let nombreCampo: string = columna.accessorKey as string;
                    let valuen = item[nombreCampo];
                    Objeto[columna.header] = (nombreCampo == "Placa" || nombreCampo == "registrationNumber" ? valuen : columna.header.includes('%') ? locateFormatPercentNDijitos(valuen, 2) :
                            (!isNaN(valuen)) ? valuen : ((moment(valuen).isValid()) ? moment(valuen).format(FormatoColombiaDDMMYYYHHmmss) : valuen));
                }
                console.log(Objeto[columna.header]);
            });

            return Objeto;

        })
        const ws = XLSX.utils.json_to_sheet(finaldata);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver(data, `${NombreArchivo}${fileExtension}`);
    } else {
        errorDialog("No hay datos que exportar", "");
    }


}
