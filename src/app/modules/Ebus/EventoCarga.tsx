import { Soc } from "./components/NivelCarga/Soc";
import { DataRecargaTiempoClientes, EventoCargaProvider, Indicador, IndicadorCargado, useDataEventoCarga } from "./core/EventoCargaProvider";
import { useEffect, useState } from "react";

import { EventoCargaPrincipal } from "./components/EventoCarga/EventoCargaPrincipal";
import { PageTitle } from "../../../_start/layout/core";
import { TituloEventoCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { ExportarExcel } from "./components/EventoCarga/ExportarExcel";
type Props = {
};

 const  EventoCarga: React.FC<Props> = () => {
    const [show, setShow] = useState<boolean>(false)
    const [showV, setShowV] = useState<boolean>(false)
    let { ClienteSeleccionado, setClientes, Clientes, setClienteSeleccionado,dataTableFiltrada,  dataTable, setShowVehiculos, setIsFiltrado, IsFiltrado} = useDataEventoCarga()
const AbrirModalVehiculos = () =>{
    setShowV(true); 
    setIsFiltrado(true);
}

   
    return(
    <>
        <EventoCargaProvider>
        <PageTitle >{TituloEventoCarga}</PageTitle>
            <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <button type="button" title="Soc" className="btn btn-sm btn-primary" onClick={() => setShow(true)}><i className="bi-battery-charging" ></i></button>
                        {<>&nbsp;</>}
                        <button type="button" title="Vehiculos" className="btn btn-sm btn-danger" onClick={AbrirModalVehiculos}><i className="bi-car-front-fill" ></i></button>
                        {<>&nbsp;</>}
                        <ExportarExcel NombreArchivo={"EventoCarga"} ></ExportarExcel>
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
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xs-12">
                      <EventoCargaPrincipal MostrarVehiculo={() => setShowV(false)} MostrarSoc={() => setShow(false)} SocShow={show} VehiculosShow={showV} ></EventoCargaPrincipal>
                    </div>
                </div>
        </EventoCargaProvider>
    </>
    )
 }
 export {EventoCarga}