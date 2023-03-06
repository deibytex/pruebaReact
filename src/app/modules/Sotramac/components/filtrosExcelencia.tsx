import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import { AssetsTypes, DetalleListas, Listas, Sites } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";

import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";
import { jsx } from "@emotion/react";
import { getDetalleListas } from "../data/dataSotramac";
import { AxiosResponse } from "axios";
import { Fechas } from "./filtrosFechas";
type Props = {

}

export const ReporteExcelencia: React.FC<Props> = () => {

    //Data desde el provider
    const { listas, detalleListas, sites, assetTypes } = useDataSotramac();

    //Carga Inicial filtros
    const [lstCategorias, setlstCategorias] = useState<Listas[]>([]);
    const [lstReportes, setlstReportes] = useState<DetalleListas[]>([]);
    const [lstSites, setlstSites] = useState<Sites[]>([]);
    const [lstAssetsTypes, setlstAssetsTypes] = useState<AssetsTypes[]>([]);


    //Seteo valor filtors
    const [categoria, setcategoria] = useState(0);
    const [reporte, setreporte] = useState("");
    const [site, setsite] = useState(0);
    const [assettype, setassettype] = useState(0);

    //seteo hiddens
    const [showSites, setshowSites] = useState(true);
    const [showAssetTypes, setshowAssetTypes] = useState(true);


    useEffect(() => {
        setlstCategorias(listas);
    }, [listas])

    useEffect(() => {
        if (categoria != 0) {
            let filter = (detalleListas as DetalleListas[]).filter(function (arr) {
                return (arr.ListaId == categoria)
            });
            setlstReportes(filter);
            setreporte("");
        }
        else {
            //al ser cero debemos poner todos los filtros por defecto y ocultar los menús
            setlstReportes([]);
            setreporte("");

            setassettype(0);
            setsite(0);

            setshowAssetTypes(true);
            setshowSites(true);
        }
    }, [categoria])

    useEffect(() => {
        if (reporte === "EOAPC") {
            let filter = (sites as Sites[]).filter(function (arr) {
                return (arr.siteid == -6032794350987665724 || arr.siteid == 6835483207492495255)
            });
            setlstSites(filter);
            setshowSites(false);
            setsite(0);

            //Ocultamos Assettypes y le asignamos valor cero
            setshowAssetTypes(true);
            setassettype(0);
        }
        else if (reporte === "EOAPV") {
            setlstAssetsTypes(assetTypes);
            setshowAssetTypes(false);
            setassettype(0);

            //Ocultamos los sitios y le asigamos cero de valor
            setshowSites(true);
            setsite(0);
        }
        else if (reporte === "EOAPCV") {
            setlstAssetsTypes(assetTypes);
            setshowAssetTypes(false);
            setassettype(0);

            //Ocultamos los sitios y le asigamos valor a sitios
            setshowSites(true);
            setsite(0);
        }
        else {
            //al ser no tener reporte debemos poner todos los filtros por defecto y ocultar los menús
            setlstSites([]);
            setsite(0);

            setlstAssetsTypes([]);
            setassettype(0);

            setshowAssetTypes(true);
            setshowSites(true);
        }
    }, [reporte])

    useEffect(() => {
        if (reporte === "EOAPCV") 
                    assettype == 0 ? setsite(0) : assettype == 11 ? setsite(6835483207492495255) : setsite(-6032794350987665724);
    }, [assettype])

    //Funciones de filtro - seteo

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
                <option value="">Seleccione un reporte</option>
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

    function SelectSites() {
        return (
            <Form.Select className=" mb-3 " name="sites" value={site} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setsite(e.currentTarget.value as any);
            }}>
                <option value={0}>Seleccione un Sitio</option>
                {
                    lstSites.map((rep) => {
                        return (
                            <option key={rep.siteid} value={rep.siteid}>
                                {rep.sitename}
                            </option>
                        );
                    })
                }
            </Form.Select>
        );
    }

    console.log('site', site);
    console.log('asset', assettype);

    function SelectAssetTypes() {
        return (
            <Form.Select className=" mb-3 " name="assettypes" value={assettype} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setassettype(e.currentTarget.value as any);                
            }}>
                <option value={0}>Seleccione Tipo</option>
                {
                    lstAssetsTypes.map((rep) => {
                        return (
                            <option key={rep.AssetTypeId} value={rep.AssetTypeId}>
                                {rep.Nombre.indexOf("Articulated") !== -1 ? "Articulados" : "Busetones"}
                            </option>
                        );
                    })
                }
            </Form.Select>
        );
    }

    //Retornamos los controles de filtro
    return (
        <>
            <div className="row">
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Categoría:</label>
                    <SelectCategoria />
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6">
                    <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Reporte:</label>
                    <SelectReporte />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-md-6 col-xs-6" hidden={showSites}>
                    <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Sitio:</label>
                    <SelectSites />
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6" hidden={showAssetTypes}>
                    <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Tipo activo:</label>
                    <SelectAssetTypes />
                </div>
            </div>
            <div className="row">
                <Fechas />
            </div>
        </>
    )
} 