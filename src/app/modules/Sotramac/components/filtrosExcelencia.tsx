import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import { DetalleListas, Listas } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";

import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";
import { jsx } from "@emotion/react";
import { getDetalleListas } from "../data/dataSotramac";
import { AxiosResponse } from "axios";
type Props = {

}

export const ReporteExcelencia: React.FC<Props> = () => {

    //Data desde el provider
    const { listas } = useDataSotramac();

    //Carga Inicial
    const [lstCategorias, setlstCategorias] = useState<Listas[]>([]);
    const [lstReportes, setlstReportes] = useState<DetalleListas[]>([])

    //Seteo filtros
    const [FechaInicial, setFechaInicial] = useState("");
    const [FechaFinal, setFechaFinal] = useState("");

    const [categoria, setcategoria] = useState(0);
    const [reporte, setreporte] = useState("");


    useEffect(() => {
        setlstCategorias(listas);
    }, [listas])

    useEffect(() => {
        if (categoria !== 0)
        getDetalleListas(categoria).then((respuesta: AxiosResponse<DetalleListas[]>) => {
            setlstReportes(respuesta.data);
            setreporte("");
        }) 
        else{
            setlstReportes([]);
            setreporte("");
        } 
    }, [categoria])

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

    function SelectCategoria() {
        return (
            <Form.Select className=" mb-3 " name="categoria" value={categoria} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setcategoria(e.currentTarget.value as any);
            }}>
                <option value={0}>Seleccione una categoría</option>
                {lstCategorias.map((cat) => {
                    return (
                        <option key={cat.ListaId} value={cat.ListaId}>
                            {cat.Nombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    function SelectReporte() {
        return (
            <Form.Select className=" mb-3 " name="reporte" value={reporte} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setreporte(e.currentTarget.value as any);
            }}>
                <option value="">Seleccione un reporte:</option>
                {
                    lstReportes.map((rep) => {
                        return (
                            <option key={rep.DetalleListaId} value={rep.Sigla}>
                                {rep.Nombre}
                            </option>
                        );
                    })
                }
            </Form.Select>
        );
    }

    //Retornamos los controles de filtro
    return (

        <div className="row" style={{ padding: '20px' }}>
            <div className="col-sm-6 col-md-6 col-xs-6">
                <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Categoría:</label>
                <SelectCategoria />
            </div>
            <div className="col-sm-6 col-md-6 col-xs-6">
                <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Reporte:</label>
                <SelectReporte />
            </div>
        </div>
    )
} 