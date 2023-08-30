
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap-v5";
import { useDataCorreosTx } from "../../core/provider";
import { Clientes, ListaNotifacion } from "../../models/dataModels"
import { UpdateListaCorreos } from "./modalUpdatedListaCorreos";
import { clientes } from "../../../Img/models/dataModels";


type Props = {

}

export const FiltrosCorreos: React.FC<Props> = () => {

    //Data desde el provider
    const { Clientes, ClienteIdS, ListaNotifacion, ListaNotifacionId, setListaNotifacionId, setClienteId, setClienteIdS } = useDataCorreosTx();

    //Funciones de filtro - seteo
    const [lstListaNotifacion, setlstListaNotifacion] = useState<ListaNotifacion[]>([]);
    const [lstClientes, setlstClientes] = useState<any[]>([]);
    const [ListaNotificacionId, setListaNotificacionId] = useState('');

    //Modal
    const [tituloModalCorreos, settituloModalCorreos] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => {
        settituloModalCorreos('');        
        setShow(false);        
    };

    const showModal = () => {
        setShow(true);
    }


    useEffect(() => {
        if (Clientes.length > 0 && ListaNotifacion.length > 0) {
        // traemos los clientes id's que tienen lista creada
        var clientesids: any = [];

        (ListaNotifacion as ListaNotifacion[]).filter(function (item) {
            return clientesids.indexOf(item["ClienteIds"]) < 0 ? clientesids.push(item["ClienteIds"]) : false
        });

        //Filtramos los clientes según los id´s que tenemos creados 
        let filtered: Clientes[] = [];

        (clientesids).map((arr: any) => {
            let fill = (Clientes as Clientes[]).filter(function (item) {
                return (arr == item.clienteIdS)
            })

            if(fill != null ) filtered.push(fill[0]);
        });

        setlstClientes(filtered);

        var prueba = (filtered as Clientes[]).filter(function (arr) {
            return (arr != undefined)
        }); 
        setClienteIdS(prueba[0].clienteIdS);
        setClienteId(prueba[0].clienteIdS);
    }

    }, [Clientes, ListaNotifacion])

    useEffect(() => {
        if (ClienteIdS != 0 && ListaNotifacion.length > 0) {
            //filtramos la lista según el cliente id
            let filterListas = (ListaNotifacion as ListaNotifacion[]).filter(function (arr) {
                return (arr.ClienteIds == ClienteIdS)
            });
            setlstListaNotifacion(filterListas);
            if (filterListas.length > 0)
             setListaNotifacionId(filterListas[0].ListaClienteNotifacionId);
        }

    }, [ClienteIdS, ListaNotifacion, ListaNotifacionId])

    useEffect(() => {
        setListaNotifacionId(ListaNotifacionId)

    }, [ListaNotifacionId])

    useEffect(() => {
        if (Clientes.length > 0) {
            //filtramos la lista según el cliente id
            let clienteIdfilter = (Clientes as any[]).filter(function (arr) {
                return (arr.clienteIdS == ClienteIdS)
            });

            // traemos la primera posicipon del filtro para actualizar el clinet id
            const [clienteId] = clienteIdfilter;
            setClienteId(clienteId.ClienteId)
        }

    }, [ClienteIdS])

    function SelectClientes() {
        return (
            <Form.Select className=" mb-3 " name="clientes" value={ClienteIdS} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setClienteIdS(e.currentTarget.value as any);
            }}>
                {(lstClientes) &&  (lstClientes).filter( f=> f != undefined).map((cli:any) => {
                
                    return (
                        <option key={cli.ClienteId} value={cli.clienteIdS
                        }>
                            {cli.clienteNombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    function SelectListaCorreos() {
            return (
            <Form.Select className=" mb-3 " name="reporte" value={ListaNotificacionId} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setListaNotifacionId(e.currentTarget.value as any);
            }}>
                {
                    lstListaNotifacion.map((rep) => {
                        return (
                            <option key={rep.ListaClienteNotifacionId} value={rep.ListaClienteNotifacionId}>
                                {rep.NombreLista}
                            </option>
                        );
                    })
                }
            </Form.Select>
        );        
    }

    useEffect(() => {
        setListaNotificacionId(ListaNotifacionId);
    }, [ListaNotifacionId])


    const modalSetCorreo = (title: string) => {
        settituloModalCorreos(title);
        showModal();
    }


    //Retornamos los controles de filtro
    return (
        <>
            <div className="row text-primary">
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Seleccione cliente:</label>
                    <SelectClientes />
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Seleccione Lista:</label>
                    <SelectListaCorreos />
                </div>
            </div>
            <div className="row">
                <div className="mt-1 justify-content-end" style={{ textAlign: 'right' }}>
                    <Button type="button" variant="primary" className="m-2" onClick={() => {modalSetCorreo("Modificar Lista")} }>
                        Modificar
                    </Button>
                    <Button type="button" variant="primary" className="m-2" onClick={() => {modalSetCorreo("Crear Lista")} }>
                        Crear
                    </Button>
                </div>
            </div>
            <UpdateListaCorreos show={show} handleClose={handleClose} title={tituloModalCorreos} />
        </>
    )
}