import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog from "../../../../../../../_start/helpers/components/ConfirmDialog";



type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateRequerimientos: React.FC<Props> = ({ show, handleClose, title }) => {
    // const { ListaNotifacionId, CorreoId, Correo, TipoCorreo, detalleListas, CorreosTx, setCorreo, setTipoCorreo, setCorreosTx } = useDataCorreosTx();
    const [errorCorreo, seterrorCorreo] = useState<any>("");
    const [Tipo, setTipo] = useState<any>(0);

    function SelectTipo() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={Tipo} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setTipo(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione tipo</option>
                <option value={1}>Admin</option>
                <option value={2}>Soporte</option>
               
            </Form.Select>
        );
    }

    function SelectFlujo() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={Tipo} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setTipo(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione flujo</option>
                <option value={1}>Reabierto</option>
                <option value={2}>Creado - Sin Agente</option>
               
            </Form.Select>
        );
    }

    const updateCorreo = () => {
        confirmarDialog(() => {
            // if (title == "Agregar correo") {
            //     setCorreoTx(Correo, TipoCorreo, ListaNotifacionId).then((response) => {
            //         successDialog("Operación Éxitosa", "");
            //         setCorreosTx([...CorreosTx, response.data[0]]);
            //         handleClose();
            //     }).catch((error) => {
            //         errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            //     });
            // }
            // else {
            //     updateCorreosTx(Correo, TipoCorreo, CorreoId).then((response) => {

            //         if (response.statusText == "OK") {
            //             let correosedit = (CorreosTx as CorreosTx[]).map(function (dato) {
            //                 if (dato.CorreoTxIdS == CorreoId) {
            //                     dato.correo = Correo;
            //                     dato.tipoCorreo = TipoCorreo;
            //                     dato.TipoEnvio = (detalleListas as DetalleListas[]).filter(lis => lis.DetalleListaId == TipoCorreo)[0].Nombre;
            //                 }
            //                 return dato;
            //             });
            //             setCorreosTx(correosedit); 
            //             successDialog("Operación Éxitosa", "");
            //             handleClose();
            //         }
            //         else
            //             errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            //     }).catch((error) => {
            //         errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            //     });
            // }

        }, title == "Agregar correo" ? `Esta seguro que desea agregar el correo` : `Esta seguro que modificar el correo`
            , "Guardar");

    };


    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Tipo:</label>
                            <SelectTipo />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Label:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Label" type="text" />
                        </div>                        
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Valor:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Valor" type="text" />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Flujo:</label>
                            <SelectFlujo />
                        </div>                        
                    </div>

                    
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                        updateCorreo();
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}
