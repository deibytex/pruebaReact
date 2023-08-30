import React, { useEffect, useState } from "react";
import { CorreosTx } from "../../models/dataModels";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { successDialog, errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { useDataCorreosTx } from "../../core/provider";
import { setCorreoTx, updateCorreosTx } from "../../data/dataCorreosTx";
import { DetalleListas } from "../../models/dataModels";



type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateCorreos: React.FC<Props> = ({ show, handleClose, title }) => {
    const { ListaNotifacionId, CorreoId, Correo, TipoCorreo, detalleListas, CorreosTx, setCorreo, setTipoCorreo, setCorreosTx } = useDataCorreosTx();
    const [errorCorreo, seterrorCorreo] = useState<any>("");
    function SelectTipoCorreo() {
        return (
            <Form.Select className=" mb-3 " name="tipocorreo" value={TipoCorreo} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setTipoCorreo(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione tipo correo</option>
                {(detalleListas as DetalleListas[]).map((li) => {
                    return (
                        <option key={li.Sigla} value={li.DetalleListaId}>
                            {li.Nombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    const updateCorreo = () => {
        confirmarDialog(() => {
            if (title == "Agregar correo") {
                setCorreoTx(Correo, TipoCorreo, ListaNotifacionId).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    setCorreosTx([...CorreosTx, response.data[0]]);
                    handleClose();
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }
            else {
                updateCorreosTx(Correo, TipoCorreo, CorreoId).then((response) => {

                    if (response.statusText == "OK") {
                        let correosedit = (CorreosTx as CorreosTx[]).map(function (dato) {
                            if (dato.CorreoTxIdS == CorreoId) {
                                dato.correo = Correo;
                                dato.tipoCorreo = TipoCorreo;
                                dato.TipoEnvio = (detalleListas as DetalleListas[]).filter(lis => lis.DetalleListaId == TipoCorreo)[0].Nombre;
                            }
                            return dato;
                        });
                        setCorreosTx(correosedit); 
                        successDialog("Operación Éxitosa", "");
                        handleClose();
                    }
                    else
                        errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }

        }, title == "Agregar correo" ? `Esta seguro que desea agregar el correo` : `Esta seguro que modificar el correo`
            , "Guardar");

    };

    const getCorreo = (e: any) => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        setCorreo(e.target.value);
        !Correo || regex.test(e.target.value) === false ? seterrorCorreo("Correo No Valido") : seterrorCorreo("")
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
                            <label className="control-label label label-sm  m-3" htmlFor="correo" style={{ fontWeight: 'bold' }}>Correo:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese correo" type="email" onChange={getCorreo} value={Correo} />
                            <span className="text-danger">{errorCorreo}</span>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="correo" style={{ fontWeight: 'bold' }}>Tipo Correo:</label>
                            <SelectTipoCorreo />
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
