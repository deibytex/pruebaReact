import { PageTitle } from "../../../../_start/layout/core";
import { ReporteExcelencia } from "./components/filtrosExcelencia";
import { DataReportesSotramac, SotramacProvider } from "./core/provider";

export default function Reportes() {

    //Retornamos pagina principal
    return (
        <>
            <SotramacProvider>
                <PageTitle >Preoperacional App</PageTitle>
                <DataReportesSotramac>{'REXCOP'}</DataReportesSotramac>
                <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width: '100%' }}   >
                    <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >
                        {/* <div className=" card-stretch row g-0 g-xl-5 g-xxl-8 bg-primary"> */}
                            <ReporteExcelencia />
                        {/* </div> */}
                    </div>
                </div>
            </SotramacProvider>
        </>
    )

}

