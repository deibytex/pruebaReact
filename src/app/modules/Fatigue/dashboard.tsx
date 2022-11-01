import { ChartDonaVehiculo } from "./components/chart_dona_agrupadoCritico";
import { BaseIndicador } from "./components/Indicadores";
import * as React from 'react';
import { PageTitle } from "../../../_start/layout/core";
import { FAG_PanelCentral } from "./components/panelCentral";
import { IndicadorGestion } from "./components/indicadorGestion";
import { IndicadorPanelGeneral } from "./components/indicadorPanelGeneral";
import { datosFatigue } from "./dataFatigue";




export default function fatigueDashboard() {
    let arrayTotal: [] = [];
    let arrayTotalSinGestionar: any[] = [];
    let dataConAlertas = datosFatigue.getTimeLine();
    dataConAlertas.filter((m) => {
        return (m.Estado == "Operando" && m["Alertas"].length > 0);
    }).map((m) => {
        Array.prototype.push.apply(arrayTotal, m["Alertas"]);
        return m["Alertas"];
    });

    arrayTotalSinGestionar =  arrayTotal.filter((m) => {
        return (m["EsGestionado"] != 1);
    });

    return (

        <>
            <PageTitle >Fatigue App</PageTitle>
            {/* begin::Row */}
            <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}  pathIcon='' >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} titulo="Clasificacion por Flota"  />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}   >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} nameChart="Operando_Alertas" tipoData={2} titulo={"Categorización por Riesgo"} />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <IndicadorPanelGeneral className={""}/>
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <IndicadorGestion className={""} alertas={`${arrayTotalSinGestionar.length}/${arrayTotal.length}`} />
                    </BaseIndicador>
                </div>
            </div>

            <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
                <div className="col-xl-12">
                    <FAG_PanelCentral className="card-stretch mb-5 mb-xxl-8"></FAG_PanelCentral>
                </div>
            </div>

            {/* end::Row */}

        </>
    )
}