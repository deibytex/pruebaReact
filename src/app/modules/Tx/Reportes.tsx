import { TituloReporteTx } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import { ReportesPrincipal } from "./components/Reporte/ReportesPrincipal"
import { ReporteProvider } from "./core/ReporteProvider"
const Reportes: React.FC = () =>{
return (
    <>
    <ReporteProvider>
        <PageTitle >{TituloReporteTx}</PageTitle>
        <ReportesPrincipal ></ReportesPrincipal>
    </ReporteProvider>
  
    </>
)
}
export {Reportes}