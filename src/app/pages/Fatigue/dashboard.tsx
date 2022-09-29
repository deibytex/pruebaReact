import { ChartDonaVehiculo } from "./partials/chart_dona_agrupadoCritico";
import { BaseIndicador } from "./partials/Indicadores";
import * as React from 'react';
import { PageTitle } from "../../../_start/layout/core";
import { FAG_PanelCentral } from "./partials/panelCentral";




export default function fatigueDashboard() {



    return (

        <>

            <PageTitle>Fatigue App</PageTitle>
            {/* begin::Row */}
            <div className="row g-0 g-xl-5 g-xxl-8">
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}  pathIcon='' >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} titulo="Clasificacion por Flota" />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}   >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} nameChart="Operando_Alertas" tipoData={2} titulo={"Flota Operando con Alertas"} />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Indicador 2"} subtitulo={""}  >
                        {/*Contenido que quiero mostar dentro del indicador*/}

                    </BaseIndicador>
                </div>
                <div className="col-xl-3">
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Indicador 2"} subtitulo={""}  >
                        {/*Contenido que quiero mostar dentro del indicador*/}

                    </BaseIndicador>
                </div>
            </div>

            <div className="row g-0 g-xl-5 g-xxl-8">
                <div className="col-xl-12">
                    <FAG_PanelCentral className="card-stretch mb-5 mb-xxl-8"></FAG_PanelCentral>
                </div>
            </div>

            {/* end::Row */}

        </>
    )
}