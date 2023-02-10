import React from "react"
import { PageTitle } from "../../../_start/layout/core"
import { BaseIndicador } from "../Fatigue/components/Indicadores_Pc"
import { DataVehiculoOperando } from "./core/provider"

export default function FatigueDashboard() {

    return (
        <>
        <PageTitle >Preoperacional App </PageTitle>
        <DataVehiculoOperando>{895}</DataVehiculoOperando>
                {/* begin::Row */}

                <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris">
                <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Total Vehículos</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px', backgroundColor:'#d1e7dd'}}>
                                {/* <span style={{fontWeight:'bold', fontSize:'30px'}}>{subido}</span> */}
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white" style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Movimiento</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px', backgroundColor:'#f8d7da'}}>
                                {/* <span style={{fontWeight:'bold', fontSize:'30px'}}>{modificado}</span> */}
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                        <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Preoperacional</label>
                        <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px', backgroundColor:'#b6effb'}}>
                                {/* <span style={{fontWeight:'bold', fontSize:'30px'}}>{download}</span> */}
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                        <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Novedad</label>
                        <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px', backgroundColor:'#b6effb'}}>
                                {/* <span style={{fontWeight:'bold', fontSize:'30px'}}>{download}</span> */}
                            </div>
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