import { BotonesFiltros, DataRecargaTiempoClientes, EventoCargaProvider, Indicador, IndicadorCargado, useDataEventoCarga } from "./core/EventoCargaProvider";
import { EventoCargaPrincipal } from "./components/EventoCarga/EventoCargaPrincipal";
import { PageTitle } from "../../../_start/layout/core";
import { TituloEventoCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { useEffect, useState } from "react";
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { GetClientesEsomos1 } from "./data/NivelCarga";
import { Form } from "react-bootstrap-v5";
import { ClienteDTO } from "./models/EventoCargaModels";
import { useSelector } from "react-redux";
import { RootState } from "../../../setup";
import { UserModelSyscaf } from "../auth/models/UserModel";



export default function EventoCarga() {
    const { setClienteSeleccionado, setClientes } = useDataEventoCarga();
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);
    //Para los use state
    const [lstClientes, setLstClientes] = useState<ClienteDTO[]>([]);
    const [cliente, setCliente] = useState<any>();
    useEffect(() => {
        // traemos los clientes asociados al usuario
        GetClientesEsomos1(model.Id).then(
            (response) => {
                setLstClientes(response.data); // seteamos el local para uso general
                setClientes(response.data); // seteamos los store
                setClienteSeleccionado(response.data[0])
                setCliente(response.data[0].clienteIdS)
            }

        ).catch((error) => {

            errorDialog("Consultar Clientes", "Error al consultar clientes, no se puede desplegar informacion");
        })
    }, [])

    function CargaListadoClientes() {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                setCliente(e.currentTarget.value)

                console.log(Number.parseInt(e.currentTarget.value))
            }} aria-label="Default select example" value={cliente} >
                {
                    lstClientes.map((element) => {

                        return (<option key={`listadocliente_${element.clienteIdS}`} value={element.clienteIdS}>{element.clienteNombre}</option>)
                    })
                }
            </Form.Select>
        );
    }

    return (
        <>
            <EventoCargaProvider>
                <PageTitle >{TituloEventoCarga}</PageTitle>
                <DataRecargaTiempoClientes>{cliente}</DataRecargaTiempoClientes>
                <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width: '100%' }}   >
                    <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >

                        <div className="col-sm-6 col-md-6 col-xs-6 mt-3">
                            <BotonesFiltros></BotonesFiltros>

                        </div>
                        <div className="col-sm-5 col-md-5 col-xs-5">
                            <div style={{ float: 'right' }}>
                                <CargaListadoClientes></CargaListadoClientes>
                               
                            </div>
                        </div>
                        <div className="col-sm-1 col-md-1 col-xs-1" >
                            <div style={{ float: 'right' }}>
                                <div style={{ paddingTop: '5px' }}></div>
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
