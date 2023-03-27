import React, { useEffect, useState } from "react";

import { useDataCorreosTx } from "../core/provider";


import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { insertListasCorreosTx, updateListasCorreosTx } from "../data/dataCorreosTx";
import {  Clientes, ListaNotifacion } from "../models/dataModels";
import { number } from "yup";


type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateListaCorreos: React.FC<Props> = ({ show, handleClose, title }) => {

    const { ListaNotifacionId, ClienteIdS, Clientes, ListaNotifacion, setClienteIdS, setListaNotifacion, setListaNotifacionId } = useDataCorreosTx();

    // const [Data, setData] = useState<CorreosTx[]>([]);
    const [showCLientes, setshowCLientes] = useState(true);
    const [showInactivar, setshowInactivar] = useState(true);
    const [NombreLista, setNombreLista] = useState("");
    const [clientids, setclientids] = useState(0);
    const [listanotifacionid, setlistanotifacionid] = useState(0);

    useEffect(() => {
            setListaNotifacionId(listanotifacionid);

    }, [listanotifacionid])

    function SelectClientes() {
        return (
            <Form.Select className=" mb-3 " name="clientes" value={clientids} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setclientids(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione Cliente</option>
                {(Clientes as Clientes[]).map((cli) => {
                    return (
                        <option key={cli.clienteId} value={cli.clienteIdS}>
                            {cli.clienteNombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    useEffect(() => {
        ListaNotifacionId != 0 ?
            setNombreLista((ListaNotifacion as ListaNotifacion[]).filter(nom => nom.ListaClienteNotifacionId == ListaNotifacionId)[0].NombreLista)
            : setNombreLista('');
    }, [ListaNotifacionId, title])

    useEffect(() => {
        if (title == "Crear Lista") {
            setshowCLientes(false);
            setshowInactivar(true);
            setclientids(0);
            setNombreLista('');
        } else {
            setshowCLientes(true);
            setshowInactivar(false);
            setclientids(ClienteIdS);
        }
    }, [title, ClienteIdS])


    const updateCorreo = (tipoModificacion: number) => {
        confirmarDialog(() => {
            if (title == "Crear Lista") {
                if (clientids != 0) {
                    insertListasCorreosTx(clientids, NombreLista).then((response) => {
                        successDialog("Operación Éxitosa", "");
                        setListaNotifacion([...ListaNotifacion, response.data[0]]);
                        setClienteIdS(clientids);

                        setlistanotifacionid((response.data[0]["ListaClienteNotifacionId"]) as number);
                        handleClose();
                    }).catch((error) => {
                        errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                    });

                } else
                    errorDialog("<i>Debe selecionar un cliente<i/>", "");
                }
            else {
                let EsActivo;
                tipoModificacion == 0 ? EsActivo = 1 : EsActivo = 0;
                updateListasCorreosTx(ListaNotifacionId, NombreLista, EsActivo).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    if (response.data[0][""] == 1) {
                        (ListaNotifacion as ListaNotifacion[]).map(function (dato) {
                            if (dato.ListaClienteNotifacionId == ListaNotifacionId) {
                                dato.NombreLista = NombreLista;
                            }
                            return dato;
                        });
                    }
                    else {
                        var elimLista = (ListaNotifacion as ListaNotifacion[]).filter(nom => nom.ListaClienteNotifacionId != ListaNotifacionId);
                        setListaNotifacion(elimLista);
                    }
                    handleClose();
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }

        }, title == "Crear Lista" ? `Esta seguro que desea agregar la lista` : `Esta seguro que modificar la lista`
            , "Guardar");

    };

    const getNombreLista = (e: any) => {
        setNombreLista(e.target.value);
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
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6" hidden={showCLientes}>
                            <label className="control-label label label-sm  m-3" htmlFor="correo" style={{ fontWeight: 'bold' }}>Seleccione Cliente:</label>
                            <SelectClientes />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="correo" style={{ fontWeight: 'bold' }}>Nombre Lista:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Nombre Lista" type="email" onChange={getNombreLista} value={NombreLista} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                        updateCorreo(0);
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="danger" hidden={showInactivar} onClick={() => {
                        updateCorreo(1);
                    }}>
                        Inactivar
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}
