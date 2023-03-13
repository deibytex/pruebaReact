import { Soc } from "./components/NivelCarga/Soc";
import { BotonesFiltros, DataRecargaTiempoClientes, EventoCargaProvider, Indicador, IndicadorCargado, useDataEventoCarga } from "./core/EventoCargaProvider";
import { useEffect, useState } from "react";

import { EventoCargaPrincipal } from "./components/EventoCarga/EventoCargaPrincipal";
import { PageTitle } from "../../../_start/layout/core";
import { TituloEventoCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { ExportarExcel } from "./components/EventoCarga/ExportarExcel";
type Props = {
};

 const  EventoCarga: React.FC<Props> = () => {
  
    const {  ShowSoc, setShowSoc} = useDataEventoCarga()
    return(
    <>
        <EventoCargaProvider>
        <PageTitle >{TituloEventoCarga}</PageTitle>
        <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width:'100%'}}   >
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
           
                    <div className="col-sm-6 col-md-6 col-xs-6 mt-3">
                        <BotonesFiltros></BotonesFiltros>
                        {/* <button type="button" title="Soc" className="btn btn-sm btn-primary" onClick={() => setShow(true)}><i className="bi-battery-charging" ></i></button>
                        {<>&nbsp;</>}
                        <button type="button" title="Vehiculos" className="btn btn-sm btn-danger" onClick={AbrirModalVehiculos}><i className="bi-car-front-fill" >{(IsFiltrado==true ? <span>&times;</span>:<span>no</span>)}</i></button>
                        {<>&nbsp;</>}
                        <ExportarExcel NombreArchivo={"EventoCarga"} ></ExportarExcel> */}
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5">
                        <div  style={{float:'right'}}>
                            <DataRecargaTiempoClientes></DataRecargaTiempoClientes>
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
                  
                    <div className="col-sm-12 col-md-12 col-xs-12">
                      <EventoCargaPrincipal ></EventoCargaPrincipal>
                    </div>
             
                </div>
              
        </EventoCargaProvider>
    </>
    )
 }
 export {EventoCarga}