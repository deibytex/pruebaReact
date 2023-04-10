import { TituloDashboardTx } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import { DashboardPrincipal } from "./components/Dashboard/DashboardPrincipal"
import { CargaClientes, DashboardProvider, CargarSemanas, useDataDashboard, ExportarExcel, ActualizarUnidades } from "./core/DashboardProvider"
import FileSaver from "file-saver";
import XLSX from 'sheetjs-style';
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";

const Dashboard:React.FC= () =>{
    const { Data } = useDataDashboard()
   
   
return(
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
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 text-center">
                               <ExportarExcel></ExportarExcel>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                              <ActualizarUnidades></ActualizarUnidades>
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
export {Dashboard}