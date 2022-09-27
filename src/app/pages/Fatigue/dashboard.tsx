import { ChartDonaVehiculo } from "./partials/chart_dona_agrupadoCritico";
import { BaseIndicador } from "./partials/Indicadores";
import * as React from 'react';
import { PageTitle } from "../../../_start/layout/core";



export default function fatigueDashboard() {

    return (

        <>

              <PageTitle>Fatigue App</PageTitle>
            {/* begin::Row */}
            <div className="row g-0 g-xl-5 g-xxl-8">
                <div className="col-xl-3">                
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Clasificacion por Grupos"} subtitulo={""} pathIcon='' >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">                
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Clasificacion por Grupos"} subtitulo={"25 Critico"} >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">                
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Clasificacion por Grupos"} subtitulo={"25 Critico"} >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} />
                    </BaseIndicador>
                </div>
                <div className="col-xl-3">                
                    <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={"Clasificacion por Grupos"} subtitulo={"25 Critico"} >
                        {/*Contenido que quiero mostar dentro del indicador*/}
                        <ChartDonaVehiculo className={"card-stretch mb-3 mb-xxl-4"} />
                    </BaseIndicador>
                </div>
            </div>
            
            {/* end::Row */}

        </>
    )
}