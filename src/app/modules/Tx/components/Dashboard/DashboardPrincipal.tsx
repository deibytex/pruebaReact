import { AxiosError, AxiosResponse } from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog"
import { useDataDashboard } from "../../core/DashboardProvider"
import { GetSnapShotTickets2, GetSnapShotTransmision, GetSnapShotTransmisionAcumulado, GetSnapShotUnidadesActivasAcumulado, GetSnapShotUnidadesActivasChurn, GetUnidadesActivas, GetUnidadesActivasAcumulado } from "../../data/Dashboard"
import { Tickets } from "./Tickets"
import { Transmision } from "./Transmision"
import { UnidadesActivas } from "./UnidadesActivas"
import BlockUi from "@availity/block-ui"


export default function DashboardPrincipal() {
    const { ClienteSeleccionado, DataTx, Data, DataTk, setData, setDataTx, setDataTk, TabActive, setTabActive, SemanaSeleccionada, DataAcumuladoChurn, setDataAcumuladoChurn, Cargando, setConsulta, Consulta, setCargando, DataAcumulado, setDataAcumulado, DataChurn, setDataChurn, showChurn } = useDataDashboard()
    const [montarTx, setmontarTx] = useState<boolean>(false);
    const [montarTicket, setMontarTicket] = useState<boolean>(false);
    const [montarUnidades, setmontarUnidades] = useState<boolean>(true);
    const [ConsultaChurn, setConsultaChurn] = useState<boolean>(true);
    const [ConsultarAcumulado, setConsultarAcumulado] = useState<boolean>(true);
    const [ConsultaUnidades, setConsultaUnidades] = useState<boolean>(true);
    function ConsultarUnidades() {
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        setCargando(true);
        if (Fecha != null)
            GetUnidadesActivasAcumulado(Fecha, ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
                setData({ "Unidades": response.data });
                setCargando(false);
            }).catch((error: AxiosError<any>) => {
                errorDialog("Ha ocurrido un error al consultar las unidades", "");
                setCargando(false);
            });
    };
    function ConsultarTransmision() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? (SemanaSeleccionada?.length != 0 ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString()) : moment().format("DD/MM/YYYY").toString());
        GetSnapShotTransmision(Fecha, ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
            setDataTx({ "Transmision": response.data });
            setCargando(false);
        }).catch((error: AxiosError<any>) => {
            setCargando(false);
            //errorDialog("Ha ocurrido un error al consular transmision","");
        });
    };

    function ConsultarTickets() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? moment(SemanaSeleccionada['fecha'], "MM/DD/YYYY") : moment())
        GetSnapShotTickets2(Fecha.format("YYYY/MM/DD"), ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
            setDataTk({ "Ticket": response.data.data });
            setCargando(false);
        }).catch((error: AxiosError<any>) => {
            setCargando(false);
        });
    };

    function ConsultarAcumuladoSemana() {
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        GetSnapShotTransmisionAcumulado(Fecha, ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
            setDataAcumulado(response.data);
            setCargando(false);
        }).catch((error: AxiosError<any>) => {
            setCargando(false);
        });
    }
    async function ConsultarAcumuladoSnapShot() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        await GetSnapShotUnidadesActivasAcumulado(Fecha, ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
            setDataAcumuladoChurn(response.data);
            setCargando(false);
            setConsultarAcumulado(false)
        }).catch((error: AxiosError<any>) => {
            setCargando(false);
        });
    }
    async function ConsultarAcumuladoChurn() {
        setCargando(true);
        let Fecha = (SemanaSeleccionada != undefined ? SemanaSeleccionada['fecha'] : moment().format("DD/MM/YYYY").toString())
        await GetSnapShotUnidadesActivasChurn(Fecha, ClienteSeleccionado?.clienteIdS.toString()).then((response: AxiosResponse<any>) => {
            setDataChurn(response.data);
            setCargando(false);
            setConsultaChurn(false);
        }).catch((error: AxiosError<any>) => {
            setCargando(false);
        });
    }

    useEffect(() => {
        if (SemanaSeleccionada != undefined) {
            if (TabActive == "Tab1") {
                
                if (showChurn) {
                    // if (ConsultarAcumulado || Consulta)
                    //     ConsultarAcumuladoSnapShot();
                    // else
                    //     setDataAcumulado(Data);

                    let  Data = (DataChurn != undefined ? [...DataChurn] : []);

                    if (ConsultaChurn || Consulta)
                        ConsultarAcumuladoChurn();
                    else
                        setDataAcumulado(Data);
                } else {
                    if (Data?.length == 0)
                        ConsultarUnidades();
                    else {
                        let Undiades = (Data != undefined ? [...Data] : []);
                        const iscallServer = Undiades.length == 0 || (SemanaSeleccionada["fecha"] != Undiades[0].Fecha);
                        if (iscallServer)
                            ConsultarUnidades();
                        else
                            setData(Undiades);
                    }

                }
            }
        }
        return () => {
        }
    }, [SemanaSeleccionada, showChurn])

    useEffect(() => {

        let iscallServer = true;
        if (SemanaSeleccionada != undefined) {
            if (TabActive == "Tab2") {
                if (DataTx != undefined) {
                    let Datatxtemp = (DataTx ? DataTx["Transmision"] : [])

                    iscallServer = Datatxtemp.length == 0 || (SemanaSeleccionada["fecha"] != moment(Datatxtemp[0].Fecha).format("MM/DD/YYYY HH:ss:mm"));
                    // verifica que no le toque llamar al servidor nuevamente 

                    if (!iscallServer) {
                        let Datatxtemp = (DataTx ? DataTx["Transmision"] : [])
                        setDataTx({ "Transmision": Datatxtemp });
                        let dtAcumulado = (DataAcumulado != undefined ? [...DataAcumulado] : [])
                        setDataAcumulado(dtAcumulado);
                    }
                }
                //  si la respuesta es positiva se consulta los datos con la semana especificada 
                if (iscallServer) {
                    ConsultarTransmision();
                    ConsultarAcumuladoSemana();
                }

            }

            // REVISA Y VERIFICA QUE NO SE VUELVA A CONSULTAR LA MISMA SEMANA 
            if (TabActive == "Tab3") {
                if (DataTk != undefined) {
                    let Datatktemp = DataTk["Ticket"];
                    iscallServer = Datatktemp.length == 0 || (SemanaSeleccionada["semana"] != Datatktemp[0].fecha);
                    if (!iscallServer)
                        setDataTk({ "Ticket": Datatktemp });

                }
                if (iscallServer)
                    ConsultarTickets();
            }
        }

    }, [SemanaSeleccionada, TabActive])

    const MontarTransmision = (event: any) => {
        setmontarTx(true);
        setTabActive("Tab2");
    }
    const MontarTicket = (event: any) => {
        setMontarTicket(true)
        setTabActive("Tab3");
    }
    const MontarUnidades = (event: any) => {
        setmontarUnidades(true);
        setTabActive("Tab1");
    }
    return (
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
                                {(montarUnidades) && (TabActive == "Tab1") && (<UnidadesActivas></UnidadesActivas>)}
                            </div>
                            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                {(montarTx) && (TabActive == "Tab2") && (<Transmision></Transmision>)}
                            </div>
                            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                {(montarTicket) && (TabActive == "Tab3") && (<Tickets></Tickets>)}
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUi>
        </>
    )
}
