import FileSaver from "file-saver";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataPreoperacional } from "../core/provider";
import React, { useState } from "react";
import { Preoperacional, Respuestas, sinPreoperacional } from "../models/respuestas";
import { Button, Form } from "react-bootstrap-v5";
import moment from "moment";
import { getConsolidadoReportesPorTipo, getInformeViajesVsPreoperacional, getRespuestas } from "../data/dataPreoperacional";
import { AxiosResponse } from "axios";
import { forEachChild } from "typescript";
import { object } from "yup";
import { Console } from "console";
type Props = {

}

export const ExportarReportes: React.FC<Props> = () => {

    const { vehiculosSinPreoperacional } = useDataPreoperacional();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    let listadoObjeto: any = [];
    const [FechaInicial, setFechaInicial] = useState("");
    const [FechaFinal, setFechaFinal] = useState("");
    const [TipoReporte, setTipoReporte] = useState(0);

    function FechaInicialControl() {
        return (
            <Form.Control className=" mb-3 " value={FechaInicial} type="date" name="fechaini" placeholder="Seleccione una fecha inicial" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFechaInicial(e.currentTarget.value);
            }} />
        )
    }

    function FechaFinalControl() {
        return (
            <Form.Control className=" mb-3 " value={FechaFinal} type="date" name="fechaifin" placeholder="Seleccione una fecha final" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFechaFinal(e.currentTarget.value);
            }} />
        )
    }

    function ReporteControl() {
        return (
            <Form.Select className=" mb-3 " name="TipoReporte" value={TipoReporte} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setTipoReporte(e.currentTarget.value as any);
            }}>
                <option value="0">Seleccione un reporte</option>
                <option value="2">Consolidado por mes</option>
                <option value="3">Consolidado por conductor</option>
            </Form.Select>
            
          )
    }

    const exportarExcel = async () => {

        getInformeViajesVsPreoperacional(FechaInicial, FechaFinal, TipoReporte).then((respuesta: AxiosResponse<Respuestas[]>) => {

            console.log('viajesvspreop',respuesta.data);

        })

        getConsolidadoReportesPorTipo(FechaInicial, FechaFinal, TipoReporte).then((respuesta: AxiosResponse<Respuestas[]>) => {

            console.log('consoliidadoreportes',respuesta.data);

        })
        if (TipoReporte === 2) {
            // if ((lstPreoperacional).length > 0) {

            


            //     const crearExcel = (respuestas: Respuestas[]) => {
            //         listadoObjeto = [];
            //         lstPreoperacional.map((item) => {

            //             let filter = respuestas.filter(function (arr) {
            //                 return (arr.EncabezadoId == item.EncabezadoId)
            //             })

            //             let Objeto = {};
            //             Objeto["Conductor"] = item.Conductor;
            //             Objeto["Fecha y Hora"] = item.FechaHoraString;
            //             Objeto["Cliente"] = item.clienteNombre;
            //             Objeto["Vehículo"] = item.Description;
            //             Objeto["Gestor"] = item.GetorNombre;
            //             Objeto["Estado Gestión"] = item.Estado == 1 ? item.EsGestionado != null ?
            //                 item.EsGestionado ? "En Gestion" : "Gestionado" : "No Gestionado" : "";

            //             filter.map((arr) => {

            //                 let valor = arr.Pregunta;
            //                 let Respuesta = arr.Respuesta;

            //                 Objeto[valor] = Respuesta;
            //             })

            //             Objeto["Estado"] = item.Estado == 0 ? "Aprobado" : "No Aprobado";

            //             listadoObjeto.push(Objeto);
            //         })
            //         const ws = XLSX.utils.json_to_sheet(listadoObjeto);
            //         const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            //         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            //         const data = new Blob([excelBuffer], { type: fileType });
            //         FileSaver(data, `${NombreArchivo}${fileExtension}`);

            //     }
            // } else {
            //     errorDialog("No hay datos que exportar", "");
            // }
        }
        else if (TipoReporte === 3){
            if ((vehiculosSinPreoperacional as sinPreoperacional[]).length > 0) {
            //     let finaldata = (vehiculosSinPreoperacional as sinPreoperacional[]).map((item) => {
            //         let Objeto = {};
            //         Objeto["Conductor"] = item.Conductor;
            //         Objeto["Vehículo"] = item.Vehiculo;
            //         Objeto["Descripción"] = item.RegistrationNumber;
            //         Objeto["Fecha Primer Viaje"] = moment(item.FechaViaje).format("DD-MM-YYYY HH:mm");
            //         Objeto["Kms Recorrido"] = item.DistanciaRecorrida;
            //         Objeto["Nro Viajes"] = item.CantViajes;
            //         return Objeto;
            //     })
            //     const ws = XLSX.utils.json_to_sheet(finaldata);
            //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            //     const data = new Blob([excelBuffer], { type: fileType });
            //     FileSaver(data, `${"NombreArchivo"}${fileExtension}`);
            // } else {
            //     errorDialog("No hay datos que exportar", "");
            }
        }

    }


    return (
        <div className="row" style={{ padding: '20px' }}>
            <div className="col-sm-4 col-md-3 col-xs-4">
                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Tipo Reporte</label>
                <ReporteControl />
            </div>
            <div className="col-sm-3 col-md-3 col-xs-3">
                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Fecha inicial</label>
                <FechaInicialControl />
            </div>
            <div className="col-sm-3 col-md-3 col-xs-3">
                <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Fecha final</label>
                <FechaFinalControl />
            </div>
            <div className="col-sm-3 col-md-3 col-xs-3">
                <label className="control-label label label-sm"></label>
                <div className=" ">
                    <button className="btn btn-sm btn-success" title="Consultar" type="button"  style={{ fontSize: 16 }} 
                    onClick={exportarExcel}>
                        <i className="bi-search"></i>Consultar</button>
                </div>
            </div>
        </div>
    )
} 