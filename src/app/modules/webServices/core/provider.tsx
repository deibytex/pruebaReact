
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getClientesSeleccionado, getListadoClientes, } from "../data/dataWebServices";
import moment from "moment";


// clase con los funciones  y datos a utiilizar
export interface WebServicesContextModel {
    clientes?: any;
    setclientes: (lstclientes: any[]) => void;
    clientesSelected?: any;
    setclientesSelected: (lstclientesSelected: any[]) => void;
    fechaInicial?: Date;
    setfechaInicial: (fechainicial: Date) => void;
    fechaFinal?: Date;
    setfechaFinal: (fechafinal: Date) => void;
    usuarioId?: any;
    setusuarioId: (usuarioId: any) => void;
    nombreReporte?: any;
    setnombreReporte: (nombreReporte: any) => void;
    tipoReporte?: any;
    settipoReporte: (nombreReporte: any) => void;
    iserror?: any;
    setError: (error: any) => void;
    loader? : boolean ;
    setloader: (loader: boolean) => void;

}

const WebServicesContext = createContext<WebServicesContextModel>({
    setclientes: (lstclientes: any[]) => { },
    setclientesSelected: (lstclientesSelected: any[]) => { },
    setfechaInicial: (fechainicial: Date) => (new Date()),
    setfechaFinal: (fechafinal: Date) => (new Date()),
    setusuarioId: (usuarioId: any) => (""),
    setnombreReporte: (nombreReporte: any) => (""),
    settipoReporte: (tipoReporte: any) => (1),
    setError: (error: any) => { },
    setloader: (loader: boolean) => { }
});


const WebServicesProvider: React.FC = ({ children }) => {

    const [clientes, setclientes] = useState<any[]>([]);
    const [clientesSelected, setclientesSelected] = useState<any[]>([]);
    const [fechaInicial, setfechaInicial] = useState(new Date());
    const [fechaFinal, setfechaFinal] = useState(new Date());
    const [usuarioId, setusuarioId] = useState("");
    const [nombreReporte, setnombreReporte] = useState("");
    const [tipoReporte, settipoReporte] = useState(1);
    const [iserror, setError] = useState<any>({});
    const [loader, setloader] = useState<boolean>(true);

    const value: WebServicesContextModel = {
        clientes,
        setclientes,
        clientesSelected,
        setclientesSelected,
        fechaInicial,
        setfechaInicial,
        fechaFinal,
        setfechaFinal,
        usuarioId,
        setusuarioId,
        nombreReporte,
        setnombreReporte,
        tipoReporte,
        settipoReporte,
        iserror,
        setError,
        loader, 
        setloader
    };

    return (

        <WebServicesContext.Provider value={value}>
            {children}
        </WebServicesContext.Provider>

    );
};

function useDataWebServices() {
    return useContext(WebServicesContext);
}

// se encarga de consultar la información 
// de los vehiculos operando y en una frecuencia de 5 min 
// segun parametrización que debe realizarse

const DataReportesWebServices: React.FC = ({ children }) => {
    const { setError, setloader, setclientes, setclientesSelected, setusuarioId, setfechaFinal, setfechaInicial } = useDataWebServices();

    //Cosulta clientes activos
    let consultaClientes = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getListadoClientes().then(

            (response) => {
                setclientes(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Clientes", error });
        })

    }

    //CONSULTA DETALLE CLIENTES SELECCIONADOS
    let consultaClientesSeleccionados = (usuarioIdS: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getClientesSeleccionado(usuarioIdS).then(

            (response) => {
                setclientesSelected((response.data as any[]).map(a => a.clienteIdS.toString()));

                setloader(false);
            }

        ).catch((error) => {
            setError({ accion: "clientes seleccionados", error });
        })

    }


    useEffect(() => {

        if (children) {
            setloader(true);
            setusuarioId(children);
            setfechaInicial(moment().add(-1, 'months').startOf('month').toDate());
            setfechaFinal(moment().add(-1, 'months').endOf('month').endOf('day').toDate());
            consultaClientes();
            consultaClientesSeleccionados(children.toString());
            // si no tiene error hace el interval

        }

        return () => {
            setclientes([]);
            setclientesSelected([]);
        };
    }, [children]);

    return <></>;
};


export { WebServicesProvider, useDataWebServices, DataReportesWebServices }