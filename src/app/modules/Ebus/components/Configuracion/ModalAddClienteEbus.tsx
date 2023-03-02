import { useEffect } from "react";
import { Form, Modal } from "react-bootstrap-v5"
import { CargaClientes } from "../../core/ConfiguracionProvider";

type Props = {
    show:boolean;
    handleClose:() =>void;
    title:string;
}
const ModalAddClienteEbus : React.FC<Props> = ({show, handleClose, title}) =>{

    useEffect(() =>{

    },[])


   


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
                        <button type="button" className="btn btn-sm btn-primary">Guardar</button>
                    </div>
            </Modal.Footer>
            </Modal>

        </>
    )
}
export {ModalAddClienteEbus}