
import { AxiosResponse } from "axios";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { getListadoCLientes, getListaClienteNotifacion, getSites, getSitesNotifacion} from "../data/dataCorreosTx";

// clase con los funciones  y datos a utiilizar
export interface CorreosTxContextModel {
    Clientes?: any;
    setClientes: (lstClientes: any[]) => void;
    ClienteIdS?: any;
    setClienteIdS: (ClientesId: any) => void;
    ClienteId?: any;
    setClienteId: (ClientesId: any) => void;
    ListaNotifacion?: any;
    setListaNotifacion: (lstListaNotifacion: any[]) => void;
    ListaNotifacionId?: any;
    setListaNotifacionId: (ClientesId: any) => void;
    ListaSites?: any;
    setListaSites: (lstListaSites: any[]) => void;
    ListaSitesNotifacion?: any;
    setListaSitesNotifacion: (lstListaSitesNotifacion: any[]) => void;
}

const CorreosTxContext = createContext<CorreosTxContextModel>({
    setClientes: (lstdetalleClientes: any[]) => { },
    setClienteIdS: (ClientesId: any) => (0),
    setClienteId: (ClientesId: any) => (0),
    setListaNotifacion: (lstNotifacion: any[]) => { },
    setListaNotifacionId: (ClientesId: any) => (0),
    setListaSites: (lstSites: any[]) => { },
    setListaSitesNotifacion: (lstSitesNotifacion: any[]) => { },
});


const CorreosTxProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<any[]>([]);
    const [ClienteIdS, setClienteIdS] = useState<any>(0);
    const [ClienteId, setClienteId] = useState<any>(0);
    const [ListaNotifacion, setListaNotifacion] = useState<any[]>([]);
    const [ListaNotifacionId, setListaNotifacionId] = useState<any>(0);
    const [ListaSites, setListaSites] = useState<any[]>([]);
    const [ListaSitesNotifacion, setListaSitesNotifacion] = useState<any[]>([]);



    const value: CorreosTxContextModel = {
        Clientes,
        setClientes,
        ClienteId,
        setClienteId,
        ClienteIdS,
        setClienteIdS,
        ListaNotifacion,
        setListaNotifacion,
        ListaNotifacionId,
        setListaNotifacionId,
        ListaSites,
        setListaSites,
        ListaSitesNotifacion,
        setListaSitesNotifacion,
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
    const { setClientes, setClienteIdS, setClienteId, setListaNotifacion, setListaSites, setListaSitesNotifacion } = useDataCorreosTx();

    useEffect(() => {

        getListadoCLientes().then((response: AxiosResponse<any>) => {
            let datos = response.data[0];

            setClientes(response.data);
            setClienteIdS(datos["clienteIdS"]);
            setClienteId(datos["clienteId"]);

        }
        ).catch((error) => {
            errorDialog("ListadoClientes", "Error al consultar ListadoClientes, no se puede desplegar informacion");
        });

        getListaClienteNotifacion().then((response: AxiosResponse<any>) => {
            setListaNotifacion(response.data);
        }).catch((error) => {
            errorDialog("ListadoNotifacion", "Error al consultar ListadoNotifacion, no se puede desplegar informacion");
        });

        getSites(null).then((response: AxiosResponse<any>) => {
            setListaSites(response.data);
        }).catch((error) => {
            errorDialog("ListadoSites", "Error al consultar ListadoSites, no se puede desplegar informacion");
        });

        getSitesNotifacion(null).then((response: AxiosResponse<any>) => {
            setListaSitesNotifacion(response.data);
        }).catch((error) => {
            errorDialog("ListadoSitesNotifaacion", "Error al consultar ListadoSitesNotifaacion, no se puede desplegar informacion");
        });

    }, []);


    return <></>;
};


export { CorreosTxProvider, useDataCorreosTx, DataCorreosTX }