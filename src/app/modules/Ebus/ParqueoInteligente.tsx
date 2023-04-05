import { TituloParqueo } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core";
import { ParqueoPrincipal } from "./components/ParqueoInteligente/ParqueoPrincipal";
import { DataClientes, Indicador, IndicadorCargado, ParqueoProvider } from "./core/ParqueoProvider";


    export default function ParqueoInteligente(){  
    return (<>
        <ParqueoProvider>
        <PageTitle >{TituloParqueo}</PageTitle>
        <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width:'100%'}}   >
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
           
                <div className="col-sm-6 col-md-6 col-xs-6">

                </div>
                <div className="col-sm-5 col-md-5 col-xs-5">
                    <div  style={{float:'right'}}>
                        <DataClientes></DataClientes>
                    </div>
                </div>
                <div className="col-sm-1 col-md-1 col-xs-1" >
                    <div style={{float:'right'}}>
                        <div style={{paddingTop:'5px'}}></div>
                        <Indicador></Indicador>
                        <IndicadorCargado></IndicadorCargado>
                    </div>
                </div>
            </div>
             {/*Para insertar el componete secundario o la pagina que corresponde al principal*/}
             <div className="col-sm-12 col-md-12 col-xs-12 rounded border  shadow-sm">
                    <ParqueoPrincipal></ParqueoPrincipal>
                </div>
            </div>
           
        </ParqueoProvider>
    </>)
 }
