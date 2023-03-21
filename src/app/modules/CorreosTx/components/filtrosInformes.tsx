
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
    const { Clientes, ClienteId, ListaNotifacion, ListaNotifacionId, setListaNotifacionId, setClienteId } = useDataCorreosTx();

    //Funciones de filtro - seteo
    const [lstListaNotifacion, setlstListaNotifacion] = useState<ListaNotifacion[]>([]);
    const [lstClientes, setlstClientes] = useState<Clientes[]>([]);


    useEffect(() => {
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


    }, [Clientes, ListaNotifacion])

    useEffect(() => {
        if (ClienteId != 0) {
            //filtramos la lista según el cliente id
            let filter = (ListaNotifacion as ListaNotifacion[]).filter(function (arr) {
                return (arr.ClienteIds == ClienteId)
            });
            setlstListaNotifacion(filter);
        }

    }, [ClienteId, ListaNotifacion])

    function SelectClientes() {
        return (
            <Form.Select className=" mb-3 " name="clientes" value={ClienteId} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setClienteId(e.currentTarget.value as any);
            }}>
                {(lstClientes).map((cli) => {
                    return (
                        <option key={cli.clienteIdS} value={cli.clienteIdS}>
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
                <option value="">Seleccione una lista</option>
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