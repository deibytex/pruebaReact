import moment from "moment";
import { FiltroData, SetDiagnostico } from "../../data/Requerimientos";
import confirmarDialog, { successDialog } from "../../../../../../_start/helpers/components/ConfirmDialog";
import { AxiosResponse } from "axios";
import { Modal } from "react-bootstrap-v5";
import { useToaster, Notification } from "rsuite";
import { useEffect } from "react";
type Props = {
    show: boolean;
    handleClose: (show:any) => void;
    title?: string;
    data?:any
}
const   CreacionSt:React.FC<Props> =  ({show,handleClose, title, data}) => {
    const toaster = useToaster();

    const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
      return (<Notification className="bg-light-danger" type={type} header={titulo}
        closable duration={10000}>
        {mensaje}
      </Notification>)
    }

    useEffect(() =>{
        console.log(data);
    },[data])
    
    //==========================================================================================================
    // RESUELVE EL REQUERIMIENTO
    //==========================================================================================================
    const AsignarST = (data:any, ListadoDLPRespuesta:any, EstadosRequerimientos:any) =>{
   
        // let _Cabecera = {
        //     administrador: data.Administrador,
        //     UsuarioAdministradorId: data.Id,
        //     assetid: data[0].assetid,
        //     clienteid: data[0].clienteid.toString(),
        //     registrationNumber: data[0].registrationNumber,
        //     nombrecliente: data[0].nombrecliente,
        //     agente: (data.UserId == "0" ? "" :data.Nombres),
        //     UsuarioId: (data.UserId == "0" ? "" :data.UserId),
        // }
        // // setCabecera(_Cabecera);
        let _obs = data.ObsInicial;
        _obs.push(
            {
                fecha: moment().format("DD/MM/YYYY HH:MM"),
                observacion: `Se realiza el diagnostico y se ${(FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ? "completa el diagnostico quedando resuelto" : "guarda sin completar el diagnostico")}`,
                usuario: data.Nombres,
                estado: JSON.stringify((FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ?  EstadosRequerimientos.filter((e:any)=>e.valor == "8" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]:EstadosRequerimientos.filter((e:any)=>e.valor == "5" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]))
            }
        )
        let Campos = {};
        Campos["Diagnostico"] = JSON.stringify(ListadoDLPRespuesta);
        Campos["Observaciones"] = JSON.stringify(_obs);
        Campos["Estado"] = JSON.stringify((FiltroData.getEsCompletado(ListadoDLPRespuesta).length == 0 ?  EstadosRequerimientos.filter((e:any)=>e.valor == "8" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0]:EstadosRequerimientos.filter((e:any)=>e.valor == "5" ).map((a:any) =>{return {"label":a.label,"valor":a.valor}})[0])); 
        Campos["Id"] = data.Id;
        confirmarDialog(() => {
            SetDiagnostico(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(response.data[0][""], '');
                    let datos: any = data.DatosTabla.map((val: any) => {
                        if (val.Id == data.Id) {
                            val.Estado = Campos['Estado'];
                            val.Diagnostico = Campos['Diagnostico']
                            val.Observaciones = Campos['Observaciones'];
                        }
                        return val;
                    });
                    // let Tiporeporte = [...TipoReporteBase];
                    // Tiporeporte[tabSel].Data = data;
                    // setTipoReporte(Tiporeporte);
                    // FiltroDatos();
                    // PintarIndicadores(data);
                    let dataNotificacion = {};
                    dataNotificacion['UsuarioId'] = data.Id;
                    dataNotificacion['RequerimientoId'] = data.Id;
                    dataNotificacion['Descripcion'] = data.TextoNotificacionAmin.replace("{Admin}",`${data.Administrador}`).replace("{UsuarioDestino}",`${data.Nombres}`).replace("{Consecutivo}",`${data.ConsecutivoNotificacion}`);
                    dataNotificacion['NotificarCorreo']= data.NotificarCorreo;
                    dataNotificacion['NotificarPortal']= data.NotificarPortal;
                    FiltroData.Notificar(dataNotificacion)
                    // setloader(false);
                }

            }).catch(({ error }) => {
                console.log("Error", error)
            });
        }, `¿Esta seguro que desea enviar el requerimiento a servicio técnico`);
    };

    return <>
           <Modal show={show} onHide={handleClose} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="card" style={{overflowY:'scroll',height: '300px'}}>
                        <div className="row">
                            aaaaa
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    </>   
}
export default CreacionSt