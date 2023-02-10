
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Mapa } from "./components/NivelCarga/mapa";
import { Soc } from "./components/NivelCarga/Soc";

import { TablaNivelCarga } from "./components/NivelCarga/TablaNivelCarga";
import { Vehiculos } from "./components/NivelCarga/Vehiculos";
import { GetClientes, GetClientesEsomos, PostEventActiveViajesByDayAndClient } from "./data/NivelCarga";
import { ClienteDTO, InicioCliente, InicioTabla, MapaDTO, MapaInicial, TablaDTO } from "./models/NivelcargaModels";


type Props = {
};

 const  NivelCarga: React.FC<Props> = () => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [dataTable, setdataTable] = useState<TablaDTO[]>([InicioTabla]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [show, setShow] = useState(false);
    const [showSoc, setShowSoc] = useState(false);
    const [ListadoVehiculos, setListadoVehiculos] = useState<MapaDTO[]>([MapaInicial]);
    //Para los clientes
    useEffect(() =>{
        GetClientesEsomos().then((response:AxiosResponse<any>) =>{
            setClientes(response.data);
            setClienteSeleccionado(response.data[0])
        }).catch((error) =>{
            console.log(error);
            errorDialog("<i>Eror al consultar los clientes</i>","")
        })
        // PostEventActiveViajesByDayAndClient("914","22023").then((response:AxiosResponse<any>) =>{
        //     setdataTable(response.data);
        // }).catch((error) =>{
        //     console.log(error);
        //     errorDialog("<i>Eror al consultar los eventos</i>","")
        // })
    },[Clientes])

 function CargaListadoClientes() {
        return (           
                <Form.Select   className=" mb-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstClientes =  Clientes?.filter((value, index) => {
                        return value.clienteIdS === Number.parseInt(e.currentTarget.value)
                    })  
                    if(lstClientes)
                    setClienteSeleccionado(lstClientes[0]);
                }} aria-label="Default select example">
                    <option value={0}>Todos</option>
                    {                        
                        Clientes?.map((element,i) => {
                                let flag = (element.clienteIdS === ClienteSeleccionado.clienteIdS)
                            return (<option key={element.clienteIdS} selected={flag}  value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                        })
                    }
                </Form.Select>               
        );
      }



    return(
        <div>
            <PageTitle >{TituloNivelCarga}</PageTitle>
            <div className="row">
                <div className="col-sm-4 col-md-4 col-xs-4">
                    <button title="Vehiculos" className="btn btn-sm btn-primary" onClick={(e:any) =>{setShow(true)}}><i className="bi-car-front"></i></button>
                    <>&nbsp;</>
                    <button title="Soc" className="btn btn-sm btn-primary" onClick={(e:any) =>{setShowSoc(true)}}><i className="bi-battery-charging"></i></button>
                </div>
                <div className="col-sm-4 col-md-4 col-xs-4">
                   
                </div>
                <div className="col-sm-4 col-md-4 col-xs-4"  >
                    <label className="control-label label label-sm">Cliente</label>
                    <CargaListadoClientes/>
                </div>
            </div>
            
            <TablaNivelCarga data={dataTable}/>
            <Soc show={showSoc} handleClose={function (): void {
               setShowSoc(false);
            } }/>
            <Vehiculos CLienteIds={ClienteSeleccionado.clienteIdS} show={show} handleClose={function (): void {
                setShow(false);
            } }/> 
            <Mapa ListadoVehiculos={ListadoVehiculos}/>
        </div>
    )
}
export {NivelCarga};