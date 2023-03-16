import BlockUi from "@availity/block-ui"
import MaterialReactTable from "material-react-table"
import { TituloReporteTx } from "../../../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../../../_start/layout/core"
import { CargaClientes, ExportarExcelBoton, useDataReporte } from "../../core/ReporteProvider"
import { TableReporte } from "./TableReporte"

const ReportesPrincipal : React.FC = () =>{
    const {Cargando} = useDataReporte()
    return(
        <>
         <BlockUi tag="span" className="shadow-sm"  keepInView blocking={(Cargando == undefined? true:Cargando)}>
   
                <div className="row mt-5 shadow-sm">
                    <div className="col-sm-6 col-md-6 col-xs-6 mt-3">
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5 mt-3">
                        <CargaClientes></CargaClientes>
                    </div>
                    <div className="col-sm-1 col-md-1 col-xs-1 float-end mt-3">
                        <ExportarExcelBoton></ExportarExcelBoton>
                    </div>
                </div>
                <div className="bg-primary  mt-5 shadow-sm">
                    <div className="card card-border">
                        <TableReporte></TableReporte>
                    </div>
                </div>
            </BlockUi>
        </>
       
    )
}
export {ReportesPrincipal}