
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import Soc from "./components/NivelCarga/Soc";
import { TablaNivelCarga } from "./components/NivelCarga/TablaNivelCarga";

import Vehiculos from "./components/NivelCarga/Vehiculos";
type Props = {
};

 const  NivelCarga: React.FC<Props> = () => {
    return(
        <div>
            <PageTitle >{TituloNivelCarga}</PageTitle>
            <TablaNivelCarga/>
            <Soc/>
            <Vehiculos/> 
        </div>
    )
}
export {NivelCarga};