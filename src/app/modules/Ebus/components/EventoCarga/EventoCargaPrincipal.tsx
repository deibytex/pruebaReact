import BlockUi from "@availity/block-ui";
import { useEffect, useState } from "react"
import { EventoCargaProvider, SocFiltro, useDataEventoCarga, VehiculosFiltros } from "../../core/EventoCargaProvider"
import { Soc } from "../NivelCarga/Soc";
import { TablaEventoCarga } from "./TablaEventoCarga";
import "../../../../../../node_modules/@availity/block-ui/src/BlockUi.css"
import "../../../../../../node_modules/@availity/block-ui/src/Loader.css"
import { TablaDTO } from "../../models/NivelcargaModels";


const  EventoCargaPrincipal : React.FC = () =>{
const {contador, showVehiculos, setShowSoc, ShowSoc, setShowVehiculos, IsFiltrado, dataTableFiltrada,  
     ClienteSeleccionado,  setdataTableFiltrada,  Visible,  dataTable, setIsFiltrado, VehiculosFiltrados, MinSocCarga, MaxSocCarga } = useDataEventoCarga();
const [Data, setData] = useState<TablaDTO[]>([]); 
const [showV, setShowV] = useState<boolean>(false)

const MostrarVehiculo = () => {
    setShowV(false);
    setShowVehiculos(false);
}




    return (
        <>
          
          <BlockUi tag="span" className="bg-primary"  keepInView blocking={(Visible == undefined? true:Visible)}>
                <div>
                   <TablaEventoCarga ></TablaEventoCarga>
                </div>
                <SocFiltro show={(ShowSoc == undefined ? false:ShowSoc)} setShowSoc={setShowSoc}  datatable={Data} setdataTableFiltrada={setdataTableFiltrada} setIsFiltrado={setIsFiltrado} IsFiltrado={(IsFiltrado!= undefined?IsFiltrado:false)}/>
                <VehiculosFiltros >{}</VehiculosFiltros>
                    
            </BlockUi>
        
            
        </>
    )
}

export {EventoCargaPrincipal}