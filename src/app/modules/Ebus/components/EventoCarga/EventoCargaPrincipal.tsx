import BlockUi from "@availity/block-ui";
import { useEffect, useState } from "react"
import { EventoCargaProvider, SocFiltro, useDataEventoCarga, VehiculosFiltros } from "../../core/EventoCargaProvider"
import { Soc } from "../NivelCarga/Soc";
import { TablaEventoCarga } from "./TablaEventoCarga";
import "../../../../../../node_modules/@availity/block-ui/src/BlockUi.css"
import "../../../../../../node_modules/@availity/block-ui/src/Loader.css"
import { TablaDTO } from "../../models/EventoCargaModels";
type Props = {
    MostrarVehiculo:() =>void;
    MostrarSoc: () =>void;
    SocShow:boolean;
    VehiculosShow:boolean;
}

const  EventoCargaPrincipal : React.FC<Props> = ({MostrarVehiculo, MostrarSoc, SocShow, VehiculosShow}) =>{
const { IsFiltrado, dataTableFiltrada, VehiculosFiltrados, ClienteSeleccionado, setClientes, Clientes, setdataTableFiltrada, setClienteSeleccionado, setVisible, Visible,  dataTable, setIsFiltrado } = useDataEventoCarga();
const [Data, setData] = useState<[]>([]); 


useEffect(() =>{
    ((IsFiltrado) ?  setData(dataTableFiltrada): setData(dataTable));
},[IsFiltrado, dataTable, dataTableFiltrada, VehiculosShow, MostrarVehiculo])

    return (
        <>
          <EventoCargaProvider>
          <BlockUi tag="span" className="bg-primary"  keepInView blocking={(Visible == undefined? true:Visible)}>
                <div>
                   <TablaEventoCarga Datos={Data}></TablaEventoCarga>
                </div>
                <SocFiltro show={SocShow} handleClose={MostrarSoc}/>
                <VehiculosFiltros clienteIds={ClienteSeleccionado?.clienteIdS} show={VehiculosShow} handleClose={MostrarVehiculo} datatable={Data} setdataTableFiltrada={setdataTableFiltrada} setIsFiltrado={setIsFiltrado} IsFiltrado={(IsFiltrado == undefined ? false:IsFiltrado)} >{}</VehiculosFiltros>
                    
            </BlockUi>
          </EventoCargaProvider>
            
        </>
    )
}

export {EventoCargaPrincipal}