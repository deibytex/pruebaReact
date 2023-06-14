import { AxiosError, AxiosResponse } from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog"
import {  useDataDashboard } from "../../core/DashboardProvider"
import {  GetSnapShotTickets2, GetSnapShotTransmision, GetUnidadesActivas, GetUnidadesActivasAcumulado } from "../../data/Dashboard"
import { Tickets } from "./Tickets"
import { Transmision } from "./Transmision"
import { UnidadesActivas } from "./UnidadesActivas"
import BlockUi from "@availity/block-ui"

export default function  DashboardPrincipal (){
    const {ClienteSeleccionado, setData, setDataTx, setDataTk,TabActive, setTabActive, SemanaSeleccionada, Cargando, setCargando} = useDataDashboard()
    const [montarTx, setmontarTx] = useState<boolean>(false);
    const [montarTicket, setMontarTicket] = useState<boolean>(false);
    const [montarUnidades, setmontarUnidades] = useState<boolean>(true);

     function ConsultarUnidades() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        GetUnidadesActivasAcumulado(Fecha,ClienteSeleccionado?.clienteIdS.toString()).then((response:AxiosResponse<any>) =>{
            setData({"Unidades":response.data});
            setCargando(false);
        }).catch((error:AxiosError<any>) =>{
            errorDialog("Ha ocurrido un error al consultar las unidades","");
            setCargando(false);
        });
    };
    function ConsultarTransmision() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined  ?  (SemanaSeleccionada?.length != 0 ?SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString()): moment().format("DD/MM/YYYY").toString());
            GetSnapShotTransmision(Fecha,ClienteSeleccionado?.clienteIdS.toString()).then((response:AxiosResponse<any>) =>{
                setDataTx({"Transmision":response.data});
                setCargando(false);
            }).catch((error:AxiosError<any>) =>{
                setCargando(false);
                //errorDialog("Ha ocurrido un error al consular transmision","");
            });
    };
    function ConsultarTickets() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        GetSnapShotTickets2(Fecha,ClienteSeleccionado?.clienteIdS.toString()).then((response:AxiosResponse<any>) =>{
            setDataTk({"Ticket":response.data.data});
            setCargando(false);
        }).catch((error:AxiosError<any>) =>{
            setCargando(false);
        });
    };

    useEffect(() =>{
        if(TabActive == "Tab1")
            ConsultarUnidades();
        //ConsultarTickets();
        return () =>{
           setData([]);
           setDataTx([]);
        }
    }, [SemanaSeleccionada, TabActive])

    useEffect(() =>{
        if(TabActive == "Tab2")
            ConsultarTransmision();
    },[SemanaSeleccionada, TabActive])

    useEffect(() =>{
        if(TabActive == "Tab3")
            ConsultarTickets()
        return () =>{
            setDataTk([]);
           setDataTx([]);
        }
    }, [SemanaSeleccionada, TabActive])
  
    const MontarTransmision = (event:any) =>{
        setmontarTx(true);
        setTabActive("Tab2");
    }
    const MontarTicket = (event:any) =>{
        setMontarTicket(true)
        setTabActive("Tab3");
    }
    const MontarUnidades = (event:any) =>{
        setmontarUnidades(true);
        setTabActive("Tab1");
    }
    return(
        <> 
         <BlockUi tag="div" keepInView blocking={Cargando ?? true}  >
            <div className="card">
                <div className="card-body">
                        <ul className="nav nav-pills mb-3 w-100" id="pills-tab" role="tablist">
                            <li className="nav-item w-33" role="presentation">
                                <button onClick={MontarUnidades} className="nav-link active text-success fw-bolder" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">U. activas</button>
                            </li>
                            <li className="nav-item w-33" role="presentation">
                                <button onClick={MontarTransmision} className="nav-link text-success fw-bolder" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Trasmisión</button>
                            </li>
                            <li className="nav-item w-33" role="presentation">
                                <button onClick={MontarTicket} className="nav-link text-success fw-bolder" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Tickets</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                              {(montarUnidades) && (<UnidadesActivas></UnidadesActivas>)} 
                            </div>
                            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                               {(montarTx) && ( <Transmision></Transmision>)}
                            </div>
                            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                              {(montarTicket) && (<Tickets></Tickets>)} 
                            </div>
                        </div>
                </div>
            </div>
            </BlockUi>
        </>
    )
}
