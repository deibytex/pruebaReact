import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import { AssetsTypes, DetalleListas, Listas, Sites } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";
import { Fechas } from "./filtrosFechas";
import { SelectAssetsDrivers } from "./filtrosAssetsDrivers";
import { ModalTablaReporteVH } from "./tablaReporteVH";
import { ModalTablaReporteCO } from "./tablaReporteCO";
import { ModalTablaReporteVHxCO } from "./tablaReporteVHxCO";
import { getReporteExcelSotramac } from "../data/dataSotramac";
import BlockUi from "@availity/block-ui";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
type Props = {

}

export const ReporteExcelencia: React.FC<Props> = () => {

    //Data desde el provider
    const { listas, detalleListas, assetTypes, assetTypeId, fechaInicial, fechaFinal, assetSelected, driverSelected,
             setsiteId, setassetTypeId, loader, setloader } = useDataSotramac();

    //Carga Inicial filtros
    const [lstCategorias, setlstCategorias] = useState<Listas[]>([]);
    const [lstReportes, setlstReportes] = useState<DetalleListas[]>([]);
    const [lstAssetsTypes, setlstAssetsTypes] = useState<AssetsTypes[]>([]);


    //Seteo valor filtors
    const [categoria, setcategoria] = useState(0);
    const [reporte, setreporte] = useState("");

    const [showAssetTypes, setshowAssetTypes] = useState(true);
    const [showAssets, setshowAssets] = useState(true);

    //modal controls
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    //consulta reportes
    const [consultaReportVH, setconsultaReportVH] = useState(false);
    const [consultaReportCO, setconsultaReportCO] = useState(false);
    const [consultaReportVHxCO, setconsultaReportVHxCO] = useState(false);

    const [button, setbutton] = useState(true);

    const handleClose = () => {
        setconsultaReportVH(false);
        setShow(false);
    };
    const showModal = () => {
        setShow(true);
    }

    const handleClose2 = () => {
        setconsultaReportCO(false);
        setShow2(false);
    };

    const showModal2 = () => {
        setShow2(true);
    }

    const handleClose3 = () => {
        setconsultaReportVHxCO(false);
        setShow3(false);
    };

    const showModal3 = () => {
        setShow3(true);
    }


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

            setsiteId(0);

            setshowAssetTypes(true);
        }
    }, [categoria])

    useEffect(() => {
        if (reporte === "EOAPC") {
            setsiteId(-1);
            setlstAssetsTypes(assetTypes);
            setshowAssets(false);
            setshowAssetTypes(false);
        }
        else if (reporte === "EOAPV") {
            setlstAssetsTypes(assetTypes);
            setshowAssetTypes(false);


            //Ocultamos los sitios y le asigamos cero de valor
            setshowAssets(false);
            setsiteId(0);
        }
        else if (reporte === "EOAPCV") {
            setlstAssetsTypes(assetTypes);
            setshowAssetTypes(false);

            setsiteId(-1);

            //Ocultamos los sitios y le asigamos valor a sitios
            setshowAssets(false);
        }
        else {
            //al ser no tener reporte debemos poner todos los filtros por defecto y ocultar los menús
            setsiteId(0);

            setlstAssetsTypes([]);

            setshowAssetTypes(true);
            setshowAssets(true);
        }
    }, [reporte])


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

    function SelectAssetTypes() {
        return (
            <Form.Select className=" mb-3 " name="assettypes" value={assetTypeId} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setassetTypeId(e.currentTarget.value as any);
                setshowAssets(false);
            }}>
                {
                    lstAssetsTypes.map((rep) => {
                        return (
                            <option key={rep.AssetTypeId} value={rep.AssetTypeId}>
                                {(rep.Nombre.indexOf("Articulated") !== -1) ? "Articulados" : "Busetones"}
                            </option>
                        );
                    })
                }
            </Form.Select>
        );
    }
    
    useEffect(() => {
        
        if (reporte === "EOAPC") {
            driverSelected != "" && fechaInicial != "" && fechaFinal != "" ? setbutton(false) : setbutton(true);  
        }
        else if (reporte === "EOAPV") {
            assetSelected != ""  && fechaInicial != "" && fechaFinal != ""  ? setbutton(false) : setbutton(true);      
        }
        else if (reporte === "EOAPCV") {
            assetSelected != "" && driverSelected != ""  && fechaInicial != "" && fechaFinal != ""
             ?  setbutton(false) : setbutton(true);
        }
        else {
           setbutton(true);
        }
    }, [driverSelected, assetSelected, fechaFinal, fechaInicial, reporte])

    const modalReportes = () => {
        if (reporte === "EOAPV") {

            setconsultaReportVH(true);           
            showModal();

            setconsultaReportCO(false);
            setconsultaReportVHxCO(false);
        }
        else if (reporte === "EOAPC") {

            setconsultaReportCO(true);
            showModal2();

            setconsultaReportVH(false);
            setconsultaReportVHxCO(false);
        }
        else {

            setconsultaReportVHxCO(true);
            showModal3();

            setconsultaReportVH(false);
            setconsultaReportCO(false);
        }
    }


    const exportarReporte = () => {
        let NombreReporte : string =(reporte === "EOAPC")? "Informe Conductor" : ((reporte === "EOAPV") ? "Informe Vehiculos" : "Informe Conductor Vehiculos");
        setloader(true);
        getReporteExcelSotramac(
            {
                FechaInicial :fechaInicial,
                FechaFinal :`${fechaFinal} 23:59:59`, 
                DriversIdS:driverSelected,
                assetsIds: assetSelected, 
                assetTypeId: (assetTypeId as string) , 
                SiteId: null
            } ,
            reporte)
        .then((respuesta) => {
            const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        var sampleArr = base64ToArrayBuffer(respuesta?.data);
        const url = window.URL.createObjectURL(new Blob([sampleArr], {type: "application/excel"}));
        a.href = url;
        a.download = `${NombreReporte} ${fechaInicial}.xls`; 
        a.click();
        window.URL.revokeObjectURL(url);

        setloader(false);
        }).catch( () => {
            errorDialog("Descargar Informe", "Error al recibir datos del servidor.")
            setloader(false);
        }


        );
    }
    function base64ToArrayBuffer(base64: string) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
           var ascii = binaryString.charCodeAt(i);
           bytes[i] = ascii;
        }
        return bytes;
     }
    //Retornamos los controles de filtro
    return (
        <>
          <BlockUi tag="div"  keepInView blocking={loader ?? false}  >
        
            <div className="row text-primary">
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Categoría:</label>
                    <SelectCategoria />
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6">
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Reporte:</label>
                    <SelectReporte />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-md-6 col-xs-6" hidden={showAssetTypes}>
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Tipo activo:</label>
                    <SelectAssetTypes />
                </div>
            </div>
            <div className="row">
                <Fechas />
            </div>
            <div className="row" hidden={showAssets}>
                <SelectAssetsDrivers reporte={reporte}/>
            </div>
            <div className="row">
                <div className="mt-5 justify-content-end" style={{ textAlign: 'right' }}>
                    <Button type="button" variant="secondary" className="m-3"  disabled={button} onClick={() => { modalReportes(); }}>
                        Visualizar Reporte
                    </Button>
                    <Button type="button" variant="secondary" className="m-3"  disabled={button} onClick={() => { exportarReporte(); }}>
                        Generar Reporte
                    </Button>
                </div>
            </div>
            <ModalTablaReporteVH show={show} handleClose={handleClose} title={"Reporte VH"} consultaReporteVH={consultaReportVH} />
            <ModalTablaReporteCO show={show2} handleClose={handleClose2} title={"Reporte CO"} consultaReporteCO={consultaReportCO}/>
            <ModalTablaReporteVHxCO show={show3} handleClose={handleClose3} title={"Reporte CO x VH"} consultaReportVHxCO={consultaReportVHxCO}/>
            </BlockUi>
        </>
    )
} 