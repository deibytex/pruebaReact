import moment from "moment";
import { FiltroData, SetDiagnostico, SetRequerimiento } from "../../data/Requerimientos";
import confirmarDialog, { successDialog } from "../../../../../../_start/helpers/components/ConfirmDialog";
import { AxiosResponse } from "axios";
import { Button, Modal } from "react-bootstrap-v5";
import { useToaster, Notification } from "rsuite";
import { useEffect, useState } from "react";
import { FlashOff } from "@mui/icons-material";
type Props = {
    show: boolean;
    handleClose: (show:any) => void;
    title?: string;
    data?:any
}
const   CreacionSt:React.FC<Props> =  ({show,handleClose, title, data}) => {
    const toaster = useToaster();
    const [RequerimientoSAMM,setRequerimientoSAMM] = useState<string>("")
    const [DataEnvio, setDataEnvio] = useState<any[]>()
    const [ObservacionRST,setObservacionRST] = useState<string>("")
    const [NotificacionST,setNotificacionST] = useState<string>("Hola {Admin}, Estás siendo notificado porque el agente {UsuarioDestino} ha enviado el requerimiento {Consecutivo} a servicio tecnico. Por favor, revisa la información. Saludos cordiales.");
    const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
      return (<Notification className="bg-light-danger" type={type} header={titulo}
        closable duration={10000}>
        {mensaje}
      </Notification>)
    }

    
    //==========================================================================================================
    // RESUELVE EL REQUERIMIENTO
    //==========================================================================================================
    const AsignarST = (data:any, ListadoDLPRespuesta:any, EstadosRequerimientos:any) =>{
        let _obs = data.ObsInicial;
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: `${ObservacionRST} con requerimiento de sam ${RequerimientoSAMM}`,
                usuario: data.Nombres,
                estado: JSON.stringify(EstadosRequerimientos.filter((e:any)=>e.valor == "7" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0])
            }
        )
        confirmarDialog(() => {
            let Cambecera:any[] = [];
            Cambecera.push(data.Encabezado);
            let Campos = {};
            Campos["Cabecera"] = JSON.stringify(Cambecera);
            Campos["Observaciones"] = JSON.stringify(_obs);
            Campos["Estado"] = JSON.stringify(EstadosRequerimientos.filter((e:any) => e.valor === "7").map((ff:any) =>{return {"label":ff.label,"valor":ff.valor}})[0]);
            Campos["Id"] = data.Id;
            SetRequerimiento(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    let dataNotificacion = {};
                    dataNotificacion['UsuarioId'] = data.Encabezado.UsuarioId;
                    dataNotificacion['RequerimientoId'] = data.Id;
                    dataNotificacion['Descripcion'] = NotificacionST.replace("{Admin}",`${data.Encabezado.administrador}`).replace("{UsuarioDestino}",`${data.Nombres}`).replace("{Consecutivo}",`${data.Consecutivo}`);
                    dataNotificacion['NotificarCorreo']= "true";
                    dataNotificacion['NotificarPortal']= "true";
                    FiltroData.Notificar(dataNotificacion)
                }
                handleClose(false);
            }).catch(({ error }) => {
                console.log("Error", error)
            });
        }, `¿Esta seguro que desea enviar el requerimiento a servicio técnico`, "Guardar");
    };
    return <>
           <Modal show={show} onHide={handleClose} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Requerimiento a servicio tecnico numero ${(data.Consecutivo != undefined ? data.Consecutivo:"")}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="m-0  p-0">
                    <div className="card">
                        <div className="row">
                            {(data.Encabezado != undefined) && (<div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                    <div className="row">
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <div className="">
                                                <label className="mx-4 fs-6 fw-bolder">Cliente: </label>
                                            </div>
                                            <span className="mx-4 fs-5 text-muted">{data.Encabezado.nombrecliente}</span>
                                        </div>
                                        <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3">
                                            <div className="">
                                                <label className="mx-4 fs-6 fw-bolder">Placa: </label>
                                            </div>
                                            <span className="mx-4 fs-6 text-muted">{data.Encabezado.registrationNumber}</span>
                                        </div>
                                        <div className="col-sm-5 col-xl-5 col-md-5 col-lg-5">
                                            <div className="">
                                                <label className="mx-4 fs-6 fw-bolder">Administrador (es) : </label>
                                            </div>
                                            <span className="mx-4 fs-5 text-muted">{data.Encabezado.administrador}</span>
                                        </div>
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <div className="">
                                                <label className="mx-4 fs-6 fw-bolder">Días sin Tx: </label>
                                            </div>
                                            <span className="mx-4 fs-5 text-muted">{(data.Encabezado.DiasSinTx == undefined ? "0" : data.Encabezado.DiasSinTx)}</span>
                                        </div>
                                        {
                                            (data.Encabezado.Fallas != 0) && (<div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                                <div className="">
                                                    <label className="mx-4 fs-6 fw-bolder">Fallas : </label>
                                                </div>
                                                <span className="mx-4 fs-6 text-muted">{(data.Encabezado.Fallas == undefined ? "0" : data.Encabezado.Fallas)}</span>
                                            </div>)
                                        }
                                         <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 m-5">
                                                <div className="">
                                                    <label className="label label-sm fw-bolder">Numero SAMM</label>
                                                </div>
                                                <input className="form-control input input-sm" value={RequerimientoSAMM} onChange={(e) =>{
                                                    setRequerimientoSAMM(e.target.value);
                                                }}/>
                                            </div>
                                            <div className="col-sm-11 col-xl-11 col-md-11 col-lg-11 m-5">
                                                <div className="">
                                                    <label className="label label-sm fw-bolder">Observaciones</label>
                                                </div>
                                                <textarea className="form-control" value={ObservacionRST} onChange={(ff) =>{
                                                    setObservacionRST(ff.target.value);
                                                }} />
                                            </div>
                                    </div>
                                </div>
                                )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-sm" variant="info" onClick={() => {
                        AsignarST(data,data.ListadoDLPRespuesta,data.EstadosRequerimientos);
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" className="btn btn-sm" variant="secondary" onClick={() => handleClose(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
    </>   
}
export default CreacionSt