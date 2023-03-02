import { TituloConfiguracionEbus } from "../../../_start/helpers/Texts/textosPorDefecto"
import { PageTitle } from "../../../_start/layout/core"
import { ConfiguracionPrincipal } from "./components/Configuracion/ConfiguracionPrincipal"
import { ConfiguracionEbusProvider } from "./core/ConfiguracionProvider"

type Props ={

}
const Configuracion : React.FC<Props> = () =>{
    return(
        <>
        <ConfiguracionEbusProvider>
            <PageTitle >{TituloConfiguracionEbus}</PageTitle>
            <ConfiguracionPrincipal></ConfiguracionPrincipal>
        </ConfiguracionEbusProvider>
           
        </>
    )
}
export {Configuracion}