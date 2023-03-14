import { PageTitle } from "../../../_start/layout/core";
import { ReporteExcelencia } from "./components/filtrosExcelencia";
import { DataReportesSotramac, SotramacProvider } from "./core/provider";

export default function Reportes() {

    //Retornamos pagina principal
    return (
        <>
        <SotramacProvider>
            <PageTitle >Preoperacional App</PageTitle>
            <DataReportesSotramac>{'REXCOP'}</DataReportesSotramac>
            <div className=" card-stretch row g-0 g-xl-5 g-xxl-8 bg-primary">
            <ReporteExcelencia />
            </div>            
        </SotramacProvider>
    </>
    )

}

