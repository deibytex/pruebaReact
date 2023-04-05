import BlockUi from "@availity/block-ui";
import {  useState } from "react"
import {  SocFiltro, useDataEventoCarga, VehiculosFiltros } from "../../core/EventoCargaProvider"
import { TablaEventoCarga } from "./TablaEventoCarga";
import { TablaDTO } from "../../models/NivelcargaModels";


const  EventoCargaPrincipal : React.FC = () =>{
const { setShowSoc, ShowSoc, setShowVehiculos, IsFiltrado,   
       setdataTableFiltrada,  Visible,  setIsFiltrado } = useDataEventoCarga();
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