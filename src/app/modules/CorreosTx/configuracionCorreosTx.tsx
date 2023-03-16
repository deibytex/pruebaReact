import { PageTitle } from "../../../_start/layout/core";
import { FiltrosCorreos } from "./components/filtrosInformes";
import { CorreosTxProvider, DataCorreosTX } from "./core/provider";

export default function ConfiguracionCorreos() {

    //Retornamos pagina principal
    return (
        <>
            <CorreosTxProvider>
                <PageTitle>Configuración Informes Correos Tx</PageTitle>
                <DataCorreosTX></DataCorreosTX>
                <div className="row g-0 g-xl-10 g-xxl-8 bg-transparent card card-rounded mt-2 text-primary" style={{ padding: '20px' }}>
                    <div className="row  rounded shadow-sm bg-secondary">
                    <FiltrosCorreos/>
                    </div>
                </div>
            </CorreosTxProvider>
        </>
    )

}

