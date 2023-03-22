
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap-v5";

import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";
import { useDataCorreosTx } from "../core/provider";
import { Clientes, ListaNotifacion } from "../models/dataModels"


type Props = {

}

export const FiltrosCorreos: React.FC<Props> = () => {

    //Data desde el provider
    const { Clientes, ClienteIdS, ListaNotifacion, ListaNotifacionId, setListaNotifacionId, setClienteId, setClienteIdS } = useDataCorreosTx();

    //Funciones de filtro - seteo
    const [lstListaNotifacion, setlstListaNotifacion] = useState<ListaNotifacion[]>([]);
    const [lstClientes, setlstClientes] = useState<Clientes[]>([]);


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

            fill != null ? filtered.push(fill[0]) : filtered.push();
        });

        setlstClientes(filtered);
    }

    }, [Clientes, ListaNotifacion])

    useEffect(() => {
        if (ClienteIdS != 0 && ListaNotifacion.length > 0) {
            //filtramos la lista según el cliente id
            let filterListas = (ListaNotifacion as ListaNotifacion[]).filter(function (arr) {
                return (arr.ClienteIds == ClienteIdS)
            });
            setlstListaNotifacion(filterListas);
            setListaNotifacionId(filterListas[0].ListaClienteNotifacionId)
        }

    }, [ClienteIdS, ListaNotifacion])

    useEffect(() => {
        if (Clientes.length > 0) {
            //filtramos la lista según el cliente id
            let clienteIdfilter = (Clientes as Clientes[]).filter(function (arr) {
                return (arr.clienteIdS == ClienteIdS)
            });

            // traemos la primera posicipon del filtro para actualizar el clinet id
            const [clienteId] = clienteIdfilter;
            setClienteId(clienteId.clienteId)
        }

    }, [ClienteIdS])

    function SelectClientes() {
        return (
            <Form.Select className=" mb-3 " name="clientes" value={ClienteIdS} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setClienteIdS(e.currentTarget.value as any);
            }}>
                {(lstClientes).map((cli) => {
                    return (
                        <option key={cli.clienteId} value={cli.clienteIdS}>
                            {cli.clienteNombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    function SelectListaCorreos() {
            return (
            <Form.Select className=" mb-3 " name="reporte" value={ListaNotifacionId} onChange={(e) => {
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


    //Retornamos los controles de filtro
    return (
        <>
            <div className="row text-primary">
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Seleccione cliente:</label>
                    <SelectClientes />
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6" >
                    <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Seleccione cliente:</label>
                    <SelectListaCorreos />
                </div>
            </div>
        </>
    )
} 