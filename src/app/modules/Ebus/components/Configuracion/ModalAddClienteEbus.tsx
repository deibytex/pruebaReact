import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { CargaClientes, useDataConfiguracionEbus } from "../../core/ConfiguracionProvider";
import { SetActiveEvent } from "../../data/Configuracion";

type Props = {
    show:boolean;
    handleClose:() =>void;
    title:string;
}
const ModalAddClienteEbus : React.FC<Props> = ({show, handleClose, title }) =>{
 const { ClienteSeleccionado, Clientes} = useDataConfiguracionEbus();
    useEffect(() =>{

    },[])


    const setActiveEventCliente = () =>{
        let Cliente = (ClienteSeleccionado != undefined ? ClienteSeleccionado?.clienteIdString : "0")
        confirmarDialog(() => {
            SetActiveEvent(Cliente,"1").then((response:AxiosResponse<any>) =>{
                successDialog("Operación Éxitosa","");
            }).catch((error)=>{
                errorDialog("ha ocurrido un error contacte con el administrador","");
            });
        }, `Esta seguro que desea guardar la asignación `, "Guardar")
    }


    return(
        <>
            <Modal 
                    show={show} 
                    onHide={handleClose} 
                    size="sm">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xs-12">
                        <CargaClientes></CargaClientes>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                    <div className="">
                        <button type="button" className="btn btn-sm btn-secondary"  onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                            <>&nbsp;</>
                        <button type="button" className="btn btn-sm btn-primary" onClick={setActiveEventCliente}>Guardar</button>
                    </div>
            </Modal.Footer>
            </Modal>

        </>
    )
}
export {ModalAddClienteEbus}