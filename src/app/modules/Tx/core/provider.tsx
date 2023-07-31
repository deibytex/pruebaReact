
import { AxiosResponse } from "axios";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { getDetalleListas } from "../../Clientes/Sotramac/data/dataSotramac";
import { getListadoCLientes, getListaClienteNotifacion, getSites, getSitesNotifacion, getCorreosTx} from "../data/dataCorreosTx";

// clase con los funciones  y datos a utiilizar
export interface CorreosTxContextModel {
    Clientes?: any;
    setClientes: (lstClientes: any[]) => void;
    ClienteIdS?: any;
    setClienteIdS: (ClientesIdS: any) => void;
    ClienteId?: any;
    setClienteId: (ClientesId: any) => void;
    ListaNotifacion?: any;
    setListaNotifacion: (lstListaNotifacion: any[]) => void;
    ListaNotifacionId?: any;
    setListaNotifacionId: (ListaNotifacionId: any) => void;
    ListaSites?: any;
    setListaSites: (lstListaSites: any[]) => void;
    ListaSitesNotifacion?: any;
    setListaSitesNotifacion: (lstListaSitesNotifacion: any[]) => void;
    CorreosTx?: any;
    setCorreosTx: (lstCorreosTx: any[]) => void;
    CorreoId?: any;
    setCorreoId: (CorreoId: any) => void;
    Correo?: any;
    setCorreo: (Correo: any) => void;
    TipoCorreo?: any;
    setTipoCorreo: (ipoCorreo: any) => void;
    detalleListas?: any;
    setdetalleListas: (lstdetalleListas: any[]) => void;
}

const CorreosTxContext = createContext<CorreosTxContextModel>({
    setClientes: (lstdetalleClientes: any[]) => { },
    setClienteIdS: (ClientesIdS: any) => (0),
    setClienteId: (ClientesId: any) => (0),
    setListaNotifacion: (lstNotifacion: any[]) => { },
    setListaNotifacionId: (ListaNotifacionId: any) => (0),
    setListaSites: (lstSites: any[]) => { },
    setListaSitesNotifacion: (lstSitesNotifacion: any[]) => { },
    setCorreosTx: (lstdetalleCorreosTx: any[]) => { },
    setCorreoId: (CorreoId: any) => (0),
    setCorreo: (Correo: any) => (""),
    setTipoCorreo: (TipoCorreo: any) => (0),
    setdetalleListas: (lstlistas: any[]) => { }
});


const CorreosTxProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<any[]>([]);
    const [ClienteIdS, setClienteIdS] = useState<any>(0);
    const [ClienteId, setClienteId] = useState<any>(0);
    const [ListaNotifacion, setListaNotifacion] = useState<any[]>([]);
    const [ListaNotifacionId, setListaNotifacionId] = useState<any>(0);
    const [ListaSites, setListaSites] = useState<any[]>([]);
    const [ListaSitesNotifacion, setListaSitesNotifacion] = useState<any[]>([]);
    const [CorreosTx, setCorreosTx] = useState<any[]>([]);
    const [CorreoId, setCorreoId] = useState<any>(0);
    const [Correo, setCorreo] = useState<any>("");
    const [TipoCorreo, setTipoCorreo] = useState<any>(0);
    const [detalleListas, setdetalleListas] = useState<any[]>([]);



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
        CorreosTx,
        setCorreosTx,
        CorreoId,
        setCorreoId,
        Correo,
        setCorreo,
        TipoCorreo,
        setTipoCorreo,
        detalleListas,
        setdetalleListas,
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
    const { setClientes, setClienteIdS, setClienteId, setListaNotifacion, setListaSites, setListaSitesNotifacion, setCorreosTx, setdetalleListas, ListaNotifacion } = useDataCorreosTx();

    useEffect(() => {

        getListaClienteNotifacion().then((response: AxiosResponse<any>) => {
            setListaNotifacion(response.data);
        }).catch((error) => {
            errorDialog("ListadoNotifacion", "Error al consultar ListadoNotifacion, no se puede desplegar informacion");
        });

        getListadoCLientes().then((response: AxiosResponse<any>) => {
            

            let clientesnotificacion = (response.data).filter(function (arr: any) {
                let noti = JSON.parse(arr.ParamsSistema);
                return (noti.notificacion == 1)
            });

            getListaClienteNotifacion();

            let prueba = (ListaNotifacion).filter(function (item: any) {
                return response.data.indexOf(item["ClienteIds"]) > -1
            });

            console.log('filtrado', prueba);
            console.log('sin filtrar', ListaNotifacion);
            console.log('clientes cuser', response.data)
            let datos = clientesnotificacion[0]; 

            setClientes(response.data);
            setClienteIdS(datos["clienteIdS"]);
            setClienteId(datos["ClienteId"]);

        }
        ).catch((error) => {
            errorDialog("ListadoClientes", "Error al consultar ListadoClientes, no se puede desplegar informacion");
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

        getCorreosTx(null).then((response: AxiosResponse<any>) => {
            setCorreosTx(response.data);
        }).catch((error) => {
            errorDialog("ListadoSitesNotifaacion", "Error al consultar ListadoSitesNotifaacion, no se puede desplegar informacion");
        });

        getDetalleListas("2").then((response: AxiosResponse<any>) => {
            setdetalleListas(response.data);
        }).catch((error) => {
            errorDialog("ListadoTipoCorreos", "Error al consultar los tipos correos, no se puede desplegar informacion");
        });

        return () => {
            setClientes([]);
            setListaNotifacion([]);
            setListaSites([]);
            setListaSitesNotifacion([]);
            setCorreosTx([]);
            setClienteIdS(0);
            setClienteId(0);
            setdetalleListas([]);
        };

    }, []);


    return <></>;
};


export { CorreosTxProvider, useDataCorreosTx, DataCorreosTX }