import FileSaver from "file-saver";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataPreoperacional } from "../core/provider";
import React, { useState } from "react";
import { Preoperacional, Respuestas, sinPreoperacional } from "../models/respuestas";
import { Button } from "react-bootstrap-v5";
import moment from "moment";
import { getRespuestas } from "../data/dataPreoperacional";
import { AxiosResponse } from "axios";
import { forEachChild } from "typescript";
import { object } from "yup";
type Props = {
    NombreArchivo: string;
    tipoDescarga: number;
}
export const ExportarExcel: React.FC<Props> = ({ NombreArchivo, tipoDescarga }) => {
    const { Encabezados, vehiculosSinPreoperacional } = useDataPreoperacional();
    const [Respuestas, setRespuestas] = useState<Respuestas[]>([]);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    let listadoObjeto: any = [];

    const exportarExcel = async () => {
        if (tipoDescarga === 0) {
            if ((Encabezados as Preoperacional[]).length > 0) {

                getRespuestas(null).then((respuesta: AxiosResponse<Respuestas[]>) => {


                    getRespuestas(null).then((respuesta: AxiosResponse<Respuestas[]>) => {

                        crearExcel(respuesta.data);

                    })


                })

                const crearExcel = (respuestas: Respuestas[]) => {
                    listadoObjeto = [];
                    (Encabezados as Preoperacional[]).map((item) => {

                        let filter = respuestas.filter(function (arr) {
                            return (arr.EncabezadoId == item.EncabezadoId)
                        })

                        let Objeto = {};
                        Objeto["Conductor"] = item.Conductor;
                        Objeto["Fecha y Hora"] = item.FechaHoraString;
                        Objeto["Cliente"] = item.clienteNombre;
                        Objeto["Vehículo"] = item.Description;
                        Objeto["Gestor"] = item.GetorNombre;
                        Objeto["Estado Gestión"] = item.Estado == 1 ? item.EsGestionado != null ? 
                                                    item.EsGestionado ? "En Gestion" : "Gestionado" : "No Gestionado" : "";                        

                        filter.map((arr) => {

                            let valor = arr.Pregunta;
                            let Respuesta = arr.Respuesta;

                            Objeto[valor] = Respuesta;
                        })

                        Objeto["Estado"] = item.Estado == 0 ? "Aprobado" : "No Aprobado";

                        listadoObjeto.push(Objeto);
                    })
                    const ws = XLSX.utils.json_to_sheet(listadoObjeto);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], { type: fileType });
                    FileSaver(data, `${NombreArchivo}${fileExtension}`);

                }
            } else {
                errorDialog("No hay datos que exportar", "");
            }
        }
        else {
            if ((vehiculosSinPreoperacional as sinPreoperacional[]).length > 0) {
                let finaldata = (vehiculosSinPreoperacional as sinPreoperacional[]).map((item) => {
                    let Objeto = {};
                    Objeto["Conductor"] = item.Conductor;
                    Objeto["Vehículo"] = item.Vehiculo;
                    Objeto["Descripción"] = item.RegistrationNumber;
                    Objeto["Fecha Primer Viaje"] = moment(item.FechaViaje).format("DD-MM-YYYY HH:mm");
                    Objeto["Kms Recorrido"] = item.DistanciaRecorrida;
                    Objeto["Nro Viajes"] = item.CantViajes;
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

    }


    return (
        <div className="mt-5 justify-content-end" style={{ textAlign: 'right' }}>
            <Button type="button" variant="primary" onClick={() => { exportarExcel(); }}>
                Descargar Reportes
            </Button>
        </div>
    )
} 