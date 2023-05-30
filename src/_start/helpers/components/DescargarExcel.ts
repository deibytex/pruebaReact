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
                if (columna.columns !== undefined) {
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
                    Objeto[columna.header] = (nombreCampo === "Placa" || nombreCampo === "registrationNumber" ? valuen : columna.header.includes('%') ? locateFormatPercentNDijitos(valuen, 2) :
                    (nombreCampo === "Score" || nombreCampo === "scoreVel50" || nombreCampo === "scoreVel30" || nombreCampo === "scoreFB" 
                        || nombreCampo === "scoreAB" || nombreCampo === "scoreGB" ) ?  locateFormatNumberNDijitos(valuen ?? 0, 2) : (!isNaN(valuen)) ? valuen : ((moment(valuen).isValid()) ? moment(valuen).format(FormatoColombiaDDMMYYYHHmmss) : valuen));
                }
            
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

// permite exportar un excel con funciones especificas en las columnas
export function DescargarExcelPersonalizado(datos: any[], columnas: MRT_ColumnDef<any>[], NombreArchivo: string, lstFunciones: any[]) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.xlsx';

    if (datos !== undefined && datos.length > 0) {

        let finaldata = datos.map((item: any) => {



            let Objeto = {};
            // iteramos las columnas que debemos usar
            columnas.forEach((columna) => {
                // verificamos que exista una funcion para cada columna
                const fncColumna = lstFunciones.filter((fnc) => fnc.name === columna.accessorKey );
                
                // verifica si la columna tiene subcolumnas para pintar
                if (columna.columns !== undefined) {
                    columna.columns.forEach((columna2) => {
                        let nombreCampo: string = columna2.accessorKey as string;
                        let value = item[nombreCampo];
                        Objeto[nombreCampo] =
                            (columna2.header.includes('%') ? locateFormatPercentNDijitos(value, 2) :
                                (!isNaN(value)) ? value : ((moment(value).isValid()) ? moment(value).format(FormatoColombiaDDMMYYYHHmmss) : value));
                    });
                }
                else {
                    let nombreCampo: string = columna.accessorKey as string;
                    let value = item[nombreCampo];
                
                    Objeto[columna.header] = 
                        (fncColumna.length > 0 ? fncColumna[0].getData(value) : columna.header.includes('%') ? locateFormatPercentNDijitos(value ?? 0, 2) :
                        (!isNaN(value)) ? value : ((moment(value).isValid()) ? moment(value).format(FormatoColombiaDDMMYYYHHmmss) : value));
                }
              
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