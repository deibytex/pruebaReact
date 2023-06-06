import moment from "moment";
import { useEffect, useState } from "react";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Principal } from "./components/NivelCarga/principal";
import {  DataEventosTiempoClientes,   NivelCargaProvider, useDataNivelCarga } from "./core/NivelCargaProvider";
import { GetClientesEsomos1 } from "./data/NivelCarga";
import { ClienteDTO } from "../../../_start/helpers/Models/ClienteDTO";
import { Notification } from "rsuite";
import { errorDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { Form } from "react-bootstrap-v5";
import { useSelector } from "react-redux";
import { RootState } from "../../../setup";
import { UserModelSyscaf } from "../auth/models/UserModel";
import { BotonesFiltros, Indicador, IndicadorCargado } from "./components/NivelCarga/commonComponents";



export default function NivelCarga() {
    const {  setClienteSeleccionado, setClientes} = useDataNivelCarga();
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);
    //Para los use state
    const [lstClientes, setLstClientes] = useState<ClienteDTO[]>([]);
    const [cliente, setCliente] = useState<any>();
    const [tamaMapa] = useState(true);
    const [tamaTabla, settamaTabla] = useState("6");
    const [VisibleL, setVisibleL] = useState(true);
    const { Visible } = useDataNivelCarga()
    const [Reset, setReset] = useState(false);
    //el  useEffect
    useEffect(() => {
        (Reset ? setReset(true) : setReset(false));
        setVisibleL((Visible === undefined ? false : Visible));
    }, [Reset, Visible])

    const ExpandirContraerTabla = () => {
        let result = (tamaTabla === '6') ? "12" : "6";
        settamaTabla(result);


    }
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
    //se retorna la pagina o los botones para expandir/contraer la tabla y resetear datos
    return (
        <NivelCargaProvider>
            <PageTitle >{TituloNivelCarga}</PageTitle> 
            {/* trae la informacion por cliente y cambia los datos segun cambia el cliente */}
            <DataEventosTiempoClientes>{cliente}</DataEventosTiempoClientes>
            <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width: '100%' }}   >
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >
                    <div className="col-sm-6 col-md-6 col-xs-6 mt-2">
                        <button className="btn btn-sm btn-primary m-2" title="Expadir contraer tabla" onClick={ExpandirContraerTabla}><i className="bi-display"></i></button>
                        <BotonesFiltros></BotonesFiltros>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5 mt-2">
                        <div style={{ float: 'right' }}>
                            <CargaListadoClientes></CargaListadoClientes>
                           
                        </div>
                    </div>
                    <div className="col-sm-1 col-md-1 col-xs-1 mt-2">
                        <div style={{ float: 'right' }}>
                            <div style={{ paddingTop: '6px' }}></div>
                            <Indicador>{VisibleL}</Indicador>
                            <IndicadorCargado>{VisibleL}</IndicadorCargado>
                        </div>
                    </div>
                </div>
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm " style={{ width: '100%' }}  >
                    <Principal ExpandirContraerTabla={ExpandirContraerTabla} tamaTabla={tamaTabla} tamaMapa={tamaMapa} ResetearDatos={Reset}></Principal>
                </div>
            </div>

        </NivelCargaProvider>
    )
}
