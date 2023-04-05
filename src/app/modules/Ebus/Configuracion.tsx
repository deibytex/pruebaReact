import { TituloConfiguracionEbus } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import { ConfiguracionPrincipal } from "./components/Configuracion/ConfiguracionPrincipal"
import { ConfiguracionEbusProvider } from "./core/ConfiguracionProvider"

    export default function Configuracion() {
  
    return(
        <>
        <ConfiguracionEbusProvider>
       
            <PageTitle >{TituloConfiguracionEbus}</PageTitle>
            <ConfiguracionPrincipal></ConfiguracionPrincipal>
            
        </ConfiguracionEbusProvider>
           
        </>
    )
}
