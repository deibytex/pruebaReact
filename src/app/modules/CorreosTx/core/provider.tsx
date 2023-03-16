
import { AxiosResponse } from "axios";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { getListadoCLientes, getListaClienteNotifacion} from "../data/dataCorreosTx";

// clase con los funciones  y datos a utiilizar
export interface CorreosTxContextModel {
    Clientes?: any;
    setClientes: (lstClientes: any[]) => void;
    ClienteId?: any;
    setClienteId: (ClientesId: any) => void;
    ListaNotifacion?: any;
    setListaNotifacion: (lstListaNotifacion: any[]) => void;
    ListaNotifacionId?: any;
    setListaNotifacionId: (ClientesId: any) => void;
}

const CorreosTxContext = createContext<CorreosTxContextModel>({
    setClientes: (lstdetalleClientes: any[]) => { },
    setClienteId: (ClientesId: any) => (0),
    setListaNotifacion: (lstNotifacion: any[]) => { },
    setListaNotifacionId: (ClientesId: any) => (0),
});


const CorreosTxProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<any[]>([]);
    const [ClienteId, setClienteId] = useState<any>(0);
    const [ListaNotifacion, setListaNotifacion] = useState<any[]>([]);
    const [ListaNotifacionId, setListaNotifacionId] = useState<any>(0);



    const value: CorreosTxContextModel = {
        Clientes,
        setClientes,
        ClienteId,
        setClienteId,
        ListaNotifacion,
        setListaNotifacion,
        ListaNotifacionId,
        setListaNotifacionId
    };

    return (

        <CorreosTxContext.Provider value={value}>
            {children}
        </CorreosTxContext.Provider>

    );
};

function useDataCorreosTx() {
    return useContext(CorreosTxContext);
}

// se encarga de consultar la información 
// de los vehiculos operando y en una frecuencia de 5 min 
// segun parametrización que debe realizarse

const DataCorreosTX: React.FC = ({ children }) => {
    const { setClientes, setClienteId, setListaNotifacion } = useDataCorreosTx();

    useEffect(() => {

        getListadoCLientes().then((response: AxiosResponse<any>) => {
            let datos = response.data[0];

            setClientes(response.data);
            setClienteId(datos["clienteIdS"]);

        }
        ).catch((error) => {
            errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
        });

        getListaClienteNotifacion().then((response: AxiosResponse<any>) => {
            setListaNotifacion(response.data);
        })

    }, []);


    return <></>;
};


export { CorreosTxProvider, useDataCorreosTx, DataCorreosTX }