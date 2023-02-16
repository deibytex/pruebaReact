
import moment from "moment";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Principal } from "./components/NivelCarga/principal";

import { DataEventosTiempoClientes, NivelCargaProvider } from "./core/NivelCargaProvider";


type Props = {
};

 const  NivelCarga: React.FC<Props> = () => {
    return(
            <NivelCargaProvider>
                <PageTitle >{TituloNivelCarga}</PageTitle>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                       
                    </div>
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <DataEventosTiempoClientes>{moment().format("MYYYY").toString()}</DataEventosTiempoClientes>
                    </div>
                </div>

                <Principal></Principal>
            </NivelCargaProvider>
    )
}
export {NivelCarga};