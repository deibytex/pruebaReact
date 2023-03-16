import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { TituloReportes } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core";
import Alarmas from "./components/Reportes/Alarmas";
import { ReportesProvider, useDataReportes } from "./core/ReportesProvider";
import { GetClientesEsomos } from "./data/NivelCarga";
import { ClienteDTO } from "./models/NivelcargaModels";



export default function Reportes(){

    const { ClienteSeleccionado,  setClienteSeleccionado } = useDataReportes();
    const [Clientes, setClientes] = useState<ClienteDTO[]>();
    useEffect(
        () => {
            GetClientesEsomos().then((response:AxiosResponse<any>) =>{
                setClientes(response.data);
                setClienteSeleccionado(response.data[0])
             
            }).catch((error) =>{
                console.log(error);
                errorDialog("<i>Eror al consultar los clientes</i>","")
            })

            console.log("emtra la modulo");
        }, []
    )

    function CargaListadoClientes( ) {
        return (           
                <Form.Select   className=" mb-3 " onChange={(e) => {
                    // buscamos el objeto completo para tenerlo en el sistema
                    let lstClientes =  Clientes?.filter((value:any, index:any) => {
                        return value.clienteIdS === Number.parseInt(e.currentTarget.value)
                    })  
                    if(lstClientes != undefined && lstClientes.length > 0)
                        setClienteSeleccionado(lstClientes[0]);
                }} aria-label="Default select example"  defaultValue={ClienteSeleccionado?.clienteIdS}>
                  
                    {                        
                        Clientes?.map((element:any,i:any) => {
                              
                            return (<option key={element.clienteIdS}   value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                        })
                    }
                </Form.Select>               
        );
      }

      return (
        <ReportesProvider>
           
            <PageTitle >{TituloReportes}</PageTitle>
        <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width:'100%'}}   >
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
           
               
                <div className="col-sm-12 col-md-12 col-xs-12">
                    <div  style={{float:'right'}}>
                    <CargaListadoClientes/>
                    </div>
                </div>
                
            </div>
             {/*Para insertar el componete secundario o la pagina que corresponde al principal*/}
             <div className="col-sm-12 col-md-12 col-xs-12 rounded border  shadow-sm">
                    <Alarmas/>
                </div>
            </div>
           
        </ReportesProvider>
      )
    
}