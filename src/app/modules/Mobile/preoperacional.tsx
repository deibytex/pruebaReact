import React from "react"
import { PageTitle } from "../../../_start/layout/core"
import { BaseIndicador } from "../Fatigue/components/Indicadores_Pc"

export default function FatigueDashboard() {

    return (
        <>
        <PageTitle >Preoperacional App </PageTitle>
                {/* begin::Row */}

                <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} pathIcon='' >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                        
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"}   >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                        </BaseIndicador>
                    </div>
                    <div className="col-xl-3">
                        <BaseIndicador className={"card-stretch mb-1 mb-xxl-2"} titulo={""} subtitulo={""}  >
                            {/*Contenido que quiero mostar dentro del indicador*/}
                        </BaseIndicador>
                    </div>
                </div>

                <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
                    <div className="col-xl-12">
                    </div>
                </div>
                {/* end::Row */}

        </>
    )
}