import { ChartDonaVehiculo } from "./components/chart_dona_agrupadoCritico_Pc";
import { BaseIndicador } from "./components/Indicadores_Pc";
import { PageTitle } from "../../../_start/layout/core";
import { FAG_PanelCentral } from "./components/panelCentral";
import { IndicadorGestion } from "./components/indicadorGestion_Pc";
import { IndicadorPanelGeneral } from "./components/indicadorPanelGeneral_Pc";
import { datosFatigue } from "./dataFatigue";
import { DataVehiculoOperando, FatigueProvider, useDataFatigue } from "./core/provider";
import { useEffect, useState } from "react";
import { GetAlarmas, GetClientesFatiga } from "./data/dashBoardData";
import { ClientesFatiga } from "./models/EventosActivos";
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { Form } from "react-bootstrap-v5";
import { Console } from "console";

import React from "react";
import { AxiosResponse } from "axios";


export default function FatigueDashboard() {
    const [lstClientes, setLstClientes] = useState<ClientesFatiga[]>([]);
    const [clienteSeleccionado, setclienteSeleccionado] = useState<ClientesFatiga>();
    const [tipoSeguimiento, settipoSeguimiento] = useState<number>(0);
    const {setDataAlertas} = useDataFatigue();
    let TiposSeguimientos: any[] = [];
    TiposSeguimientos.push({ TipoId: 1, Tipo: "Eventos" });
    // TiposSeguimientos.push({ TipoId: 2, Tipo : "Alarmas"});


    let arrayTotal: [] = [];
    let arrayTotalSinGestionar: any[] = [];
    // let dataConAlertas = datosFatigue.getTimeLine();
    // dataConAlertas.filter((m) => {
    //     return (m.Estado == "Operando" && m["Alertas"].length > 0);
    // }).map((m) => {
    //     Array.prototype.push.apply(arrayTotal, m["Alertas"]);
    //     return m["Alertas"];
    // });

    arrayTotalSinGestionar = arrayTotal.filter((m) => {
        return (m["EsGestionado"] != 1);
    });

    useEffect(() => {

        GetClientesFatiga().then(
            (response) => {
                setLstClientes(response.data);
            }

        ).catch((error) => {
            errorDialog("Consultar Clientes", "Error al consultar clientes, no se puede desplegar informacion");
        })
       
    }, [])

  

    
    function CargaListadoClientes() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let cliente = lstClientes.filter((value, index) => {
                    return value.ClienteIdS === Number.parseInt(e.currentTarget.value)

                })
                if (lstClientes)
                    setclienteSeleccionado(cliente[0])
            }} defaultValue={clienteSeleccionado?.ClienteIdS} >
                <option>Seleccione</option>
                {
                    lstClientes.map((element) => {

                        return (<option key={`listadocliente_${element.ClienteIdS}`} value={element.ClienteIdS}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }
    function TipoSeguiminento() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                settipoSeguimiento(Number.parseInt(e.currentTarget.value))
            }} >

                {
                    TiposSeguimientos.map((element) => {
                        let flag = (element.TipoId === tipoSeguimiento)
                        return (<option key={`opcion${element.TipoId}`}  value={element.TipoId}>{element.Tipo}</option>)
                    })
                }
            </Form.Select>
        );
    }
    return (

        <>
            {/**  FatigueProvider proveedor de datos a traves de la aplicacion
             * nos garantiza que todos los datos que se obtengan sus hijos tengan acceso a consultarlo sin necesidad de pasarlo
             * con parametros o sesiones
            */}


            <FatigueProvider>
                <PageTitle >Fatigue App </PageTitle>
                <DataVehiculoOperando>{clienteSeleccionado?.ClienteIdS}</DataVehiculoOperando>
                {/* begin::Row */}
                <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width: '100%' }}   >
                    <div className="row  col-sm-12 col-md-12 col-xs-12 
                    rounded border  mt-1 mb-2 shadow-sm bg-secondary text-primary" style={{ width: '100%' }}  >


                        <div className="d-inline-flex col-xl-6 mt-2">
                            <h6 className=" m-3">Cliente:</h6>
                            <CargaListadoClientes />
                        </div>
{/* 
                        <div className="d-inline-flex col-xl-6 mt-2">
                            <h6 className=" m-3">Tipo:</h6>
                            <TipoSeguiminento />
                        </div> */}
                    </div>
                    <div className="row g-0 g-xl-5 g-xxl-8 rounded border  mt-1 mb-2 shadow-sm bg-secondary text-primary">
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} pathIcon='' >
                            {/*Contenido que quiero mostar dentro del indicador*/}

                            <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} titulo="Clasificacion por Flota" />
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}   >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                            <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} nameChart="Operando_Riesgo" tipoData={2} titulo={"Categorización por Riesgo"} />
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >

                            {/*Contenido que quiero mostar dentro del indicador*/}
                            <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} nameChart="Operando_Alertas" tipoData={3} titulo={"Categorización Alertas Críticas"} />
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                            <IndicadorGestion className={""} />
                        </BaseIndicador>
                    </div>
                </div>


                <div className="row g-0 g-xl-5 g-xxl-8 rounded border  mt-1 mb-2 shadow-sm bg-secondary text-primary">
                    <div className="col-xl-12">
                        <FAG_PanelCentral className="card-stretch mb-5 mb-xxl-8"></FAG_PanelCentral>
                    </div>
                </div>
                </div>

                {/* end::Row */}
            </FatigueProvider>
        </>
    )
}