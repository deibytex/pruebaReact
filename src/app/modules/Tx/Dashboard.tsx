import BlockUi from "@availity/block-ui"
import { TituloDashboardTx } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import DashboardPrincipal from "./components/Dashboard/DashboardPrincipal"
import { CargaClientes, DashboardProvider, CargarSemanas, useDataDashboard, ExportarExcel, ActualizarUnidades } from "./core/DashboardProvider"
import { useEffect } from "react"


export default function Dashboard() {
    const { Cargando, setCargando, setshowChurn, showChurn } = useDataDashboard()
        useEffect(() =>{
            setCargando(true);
            return () =>{}
        }, [])

    return (
        <>
            <DashboardProvider>
               
                    <PageTitle >{TituloDashboardTx}</PageTitle>
                    <div className="card shadow-sm pt-5 mt-5">
                        <div className="container">
                            <div className="row shadow-sm" >
                                <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                    <label className="label control-label label-sm fw-bolder">Fecha</label>
                                    <CargarSemanas></CargarSemanas>
                                </div>
                                <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                    <label className="label  control-label label-sm fw-bolder">Clientes</label>
                                    <CargaClientes></CargaClientes>
                                </div>
                               
                                <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                                    <ExportarExcel></ExportarExcel>
                                </div>
                                <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                                    {/* <ActualizarUnidades></ActualizarUnidades> */}
                                </div>
                            </div>
                            <div className="row shadow bg-secundary">
                                <div className="col-sm-12 col-md-12 col-lg-123 col-xl-12 col-xxl-12">
                                    <DashboardPrincipal></DashboardPrincipal>
                                </div>
                            </div>
                        </div>
                    </div>
               
            </DashboardProvider>
        </>
    )
}
