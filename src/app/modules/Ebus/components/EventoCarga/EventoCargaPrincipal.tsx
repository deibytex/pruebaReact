import BlockUi from "@availity/block-ui";
import { useEffect, useState } from "react"
import { EventoCargaProvider, SocFiltro, useDataEventoCarga, VehiculosFiltros } from "../../core/EventoCargaProvider"
import { Soc } from "../NivelCarga/Soc";
import { TablaEventoCarga } from "./TablaEventoCarga";
import "../../../../../../node_modules/@availity/block-ui/src/BlockUi.css"
import "../../../../../../node_modules/@availity/block-ui/src/Loader.css"
import { TablaDTO } from "../../models/EventoCargaModels";
type Props = {
    MostrarSoc: () =>void;
    SocShow:boolean;
}

const  EventoCargaPrincipal : React.FC<Props> = ({MostrarSoc, SocShow}) =>{
const {contador, showVehiculos, setShowVehiculos, IsFiltrado, dataTableFiltrada, VehiculosFiltrados, ClienteSeleccionado, setClientes, Clientes, setdataTableFiltrada, setClienteSeleccionado, setVisible, Visible,  dataTable, setIsFiltrado } = useDataEventoCarga();
const [Data, setData] = useState<[]>([]); 
const [showV, setShowV] = useState<boolean>(false)

const MostrarVehiculo = () => {
    setShowV(false);
    setShowVehiculos(false);
}
useEffect(() =>{
    if(contador  != undefined){
        if(contador == false){
            setData(dataTable);
        }
        else  if(contador == true && dataTableFiltrada.length == 0 && IsFiltrado == false)
        {
            setData(dataTable);
        }
        else if(contador == true && dataTableFiltrada.length != 0 && IsFiltrado == true)
        {
            setData(dataTableFiltrada);
        }
        else if(contador && IsFiltrado == true)
        {
            setdataTableFiltrada([]);
            setIsFiltrado(false);
            setShowV(false);
            setShowVehiculos(false);
        }
        else{
            setData(dataTable);
        }
    }
    

  //  ((IsFiltrado) ?  setData(dataTableFiltrada): setData(dataTable));

},[IsFiltrado, dataTable, contador,dataTableFiltrada ])

    return (
        <>
          <EventoCargaProvider>
          <BlockUi tag="span" className="bg-primary"  keepInView blocking={(Visible == undefined? true:Visible)}>
                <div>
                   <TablaEventoCarga Datos={Data}></TablaEventoCarga>
                </div>
                <SocFiltro show={SocShow} handleClose={MostrarSoc}/>
                <VehiculosFiltros clienteIds={ClienteSeleccionado?.clienteIdS} show={(showVehiculos != undefined ? showVehiculos:false)} handleClose={MostrarVehiculo} datatable={Data} setdataTableFiltrada={setdataTableFiltrada} setIsFiltrado={setIsFiltrado} IsFiltrado={(IsFiltrado!= undefined?IsFiltrado:false)} >{}</VehiculosFiltros>
                    
            </BlockUi>
          </EventoCargaProvider>
            
        </>
    )
}

export {EventoCargaPrincipal}