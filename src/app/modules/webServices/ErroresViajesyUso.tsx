import { useSelector } from "react-redux";
import { PageTitle } from "../../../_start/layout/core";
import { UserModelSyscaf } from "../auth/models/UserModel";
import { RootState } from "../../../setup";
import { useEffect, useState } from "react";
import { DataReportesWebServices, WebServicesProvider } from "./core/provider";
import { ReportesWebService } from "./components/filtros";

export default function ErroresViajesyUso() {
    
    
    const [Chidlren, setChildren] = useState(0);

    // Traemos información del usuario Logueado
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    const model = (isAuthorized as UserModelSyscaf);
    
    useEffect(() => {       
        setChildren(model.usuarioIds);
    }, [isAuthorized]);

    //Retornamos pagina principal
    if (Chidlren != 0) {
        return (
            <>        
            <WebServicesProvider>
                <PageTitle >Generación Reportes</PageTitle>
                <DataReportesWebServices>{model.usuarioIds}</DataReportesWebServices>
                <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width: '100%' }}   >
                        <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >
                            {/* <div className=" card-stretch row g-0 g-xl-5 g-xxl-8 bg-primary"> */}
                                <ReportesWebService />
                            {/* </div> */}
                        </div>
                    </div>
            </WebServicesProvider>
            </>
        )
    }

    return (
        <>        
        </>
    )

}

