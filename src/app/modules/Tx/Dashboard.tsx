import { TituloDashboardTx } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import { DashboardPrincipal } from "./components/Dashboard/DashboardPrincipal"
import { CargaClientes, DashboardProvider, CargarSemanas, useDataDashboard } from "./core/DashboardProvider"
import FileSaver from "file-saver";
import XLSX from 'sheetjs-style';
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";

const Dashboard:React.FC= () =>{
    const { Data } = useDataDashboard()
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    const ActualizarUnidadesActivas = (e:any) =>{

    }

    const ExportarExcel = async () =>{
        if(Data!= undefined && Data.length > 0){
            let NombreArchivo = "ReporteUnidadesActivas"
            const ws = XLSX.utils.json_to_sheet(Data);
            const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
            const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
            const data = new Blob([excelBuffer],{type: fileType});
            FileSaver(data,`${NombreArchivo}${fileExtension}`);
        }else{
            errorDialog("No hay datos que exportar","");
        }
    }
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
                                <button type="button" className="btn btn-sm btn-success mt-8" onClick={ExportarExcel}><i className="bi-file-earmark-excel"></i>Exportar</button>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <button type="button" className="btn btn-sm btn-danger mt-8" onClick={ActualizarUnidadesActivas}> <i className="bi-emoji-angry"></i>Actualizar</button>
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