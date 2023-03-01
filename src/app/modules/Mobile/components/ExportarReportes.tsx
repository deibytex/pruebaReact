import FileSaver from "file-saver";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataPreoperacional } from "../core/provider";
import React, { useState } from "react";
import { Respuestas } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";
import moment from "moment";
import { GetReportePorTipo, getRespuestas } from "../data/dataPreoperacional";
import { AxiosResponse } from "axios";
import { forEachChild } from "typescript";
import { object } from "yup";
import { Console } from "console";
import BlockUi from "react-block-ui";
import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";
type Props = {

}

export const ExportarReportes: React.FC<Props> = () => {

    //Data desde el provider

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';

    let listadoObjeto: any = [];
    let datosTemporales = {}
    //Variables de seteo
    const [FechaInicial, setFechaInicial] = useState("");
    const [FechaFinal, setFechaFinal] = useState("");
    const [TipoReporte, setTipoReporte] = useState(0);
    const [Visible, setVisible] = useState<boolean>(false);

    //Funciones de filtro - seteo
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
                <option value={0}>Seleccione un reporte</option>
                <option value={2}>Consolidado por mes</option>
                <option value={3}>Consolidado por conductor</option>
            </Form.Select>

        )
    }

    // Funcion principal para exportar excel
    const exportarExcel = async () => {
        setVisible(true);
        //Funciones de consulta de datos
        GetReportePorTipo(FechaInicial, FechaFinal, TipoReporte).then((respuesta: AxiosResponse<Respuestas[]>) => {

            crearExcel(respuesta.data);

        })

        const crearExcel = (respuestas: any[]) => {
            // Validamos tipo de reporte por filtro 
            if (TipoReporte.toString() === "2") {
                //Se agrupan las plantillas que vienen del servidor
                listadoObjeto = [];
                let KPI = ["# VIAJES", "# PREOPERACIONALES REALIZADOS", "# PREOPERACIONALES NO REALIZADOS"];
                //iteramos la cantidad de registros a tener en el repote
                (KPI).forEach((item, idx) => {
                    datosTemporales = {};

                    datosTemporales['KPI'] = item;

                    respuestas.forEach((r, idxR) => {
                        let porc: any = ((r.totalPreop / r.totalViajes) * 100).toFixed(2);
                        // iteramos el resultado por mes, el nombre del mes es el encabezado del reporte
                        datosTemporales[`${r.mesName}`] = (idx === 0) ? r.totalViajes : (idx === 1) ? r.totalPreop : r.totalViajes - r.totalPreop;
                        datosTemporales[`% - (${r.mes})`] = (idx == 0) ? "100%" : (idx == 1) ? `${porc}%` : `${(100 - porc).toFixed(2)}%`;
                    })

                    listadoObjeto.push(datosTemporales);
                })

                const ws = XLSX.utils.json_to_sheet(listadoObjeto.sort());
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: fileType });
                FileSaver(data, `KPI Preoperacionales ${FechaInicial} al ${FechaFinal}`);
                setVisible(false);

            }
            else if (TipoReporte.toString() === "3") {
                listadoObjeto = [];

                respuestas.map((r) => {
                    datosTemporales = {};
                    // iteramos el resultado por mes, el nombre del mes es el encabezado del reporte
                    datosTemporales["CONDUCTOR"] = r.conductor;
                    datosTemporales["Días de conducción"] = r.totalViajes;
                    datosTemporales["Preoperacionales realizados"] = r.totalPreop;
                    datosTemporales["% Cumplimiento"] = ` ${((r.totalPreop / r.totalViajes) * 100).toFixed(2)}%`;

                    listadoObjeto.push(datosTemporales);
                })

                const ws = XLSX.utils.json_to_sheet(listadoObjeto.sort());
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: fileType });
                FileSaver(data, `KPI Conductor ${FechaInicial} al ${FechaFinal}`);
                setVisible(false);
            }

        }


    }

    //Retornamos los controles de filtro
    return (
        <BlockUi tag="span" className="bg-primary" keepInView blocking={(Visible == undefined ? true : Visible)}>
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
                        <button className="btn btn-sm btn-success" title="Consultar" type="button" style={{ fontSize: 16 }}
                            onClick={exportarExcel}>
                            <i className="bi-search"></i>Consultar</button>
                    </div>
                </div>
            </div>
        </BlockUi>
    )
} 