
import React from "react";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { getAssetTypes, getDetalleListas, getListas, getSitesSotramac } from "../data/dataSotramac";
import { Listas } from "../models/dataModels";
import { array } from "yup";

// clase con los funciones  y datos a utiilizar
export interface SotramacContextModel {
    listas?: any;
    setlistas: (lstlistas: any[]) => void;
    detalleListas?: any;
    setdetalleListas: (lstdetalleListas: any[]) => void;
    listasIds?: any;
    setlistasids: (ids: any) => void;
    sites?: any;
    setsites: (lstsites: any[]) => void;
    assetTypes?: any;
    setassetTypes: (lstassettypes: any[]) => void;
    iserror?: any;
    setError: (error: any) => void;

}

const SotramacContext = createContext<SotramacContextModel>({
    setlistas: (lstdetalleListas: any[]) => { },
    setdetalleListas: (lstlistas: any[]) => { },
    setlistasids: (ids: any) => (""),
    setsites: (lstsite: any[]) => ([]),
    setassetTypes: (lstassettypes: any[]) => ([]),
    setError: (error: any) => { }
});


const SotramacProvider: React.FC = ({ children }) => {

    const [listas, setlistas] = useState<any[]>([]);
    const [detalleListas, setdetalleListas] = useState<any[]>([]);
    const [listasIds, setlistasids] = useState("");
    const [sites, setsites] = useState<any[]>([]);
    const [assetTypes, setassetTypes] = useState<any[]>([]);
    const [iserror, setError] = useState<any>({});

    const value: SotramacContextModel = {
        listas,
        setlistas,
        detalleListas,
        setdetalleListas,
        listasIds,
        setlistasids,
        sites,
        setsites,
        assetTypes,
        setassetTypes,
        iserror,
        setError
    };

    return (

        <SotramacContext.Provider value={value}>
            {children}
        </SotramacContext.Provider>

    );
};

function useDataSotramac() {
    return useContext(SotramacContext);
}

// se encarga de consultar la información 
// de los vehiculos operando y en una frecuencia de 5 min 
// segun parametrización que debe realizarse

const DataReportesSotramac: React.FC = ({ children }) => {
    const { setlistas, setError, setlistasids, setdetalleListas, setsites, setassetTypes, listasIds, iserror } = useDataSotramac();

    //Cosulta Listas (Opciones de categoria)
    let consultaListas = (Sigla: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getListas(Sigla).then(

            (response) => {
                setlistasids((response.data as any[]).map(a => a.ListaId).join())
                setlistas(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Listas", error });
        })

    }

    //CONSULTA DETALLE LISTAS (CATEGORIAS)
    let consultaDetalleListas = (ListaIds: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getDetalleListas(ListaIds).then(

            (response) => {
                setdetalleListas(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Detalle Listas", error });
        })

    }

    //CONSULTA SITES SOTRAMAC
    let consultaSites = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getSitesSotramac().then(

            (response) => {
                setsites(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Sites", error });
        })

    }

    //CONSULTA LOS TIPOS DE ASSETS
    let consultaAssetTypes = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getAssetTypes().then(

            (response) => {
                setassetTypes(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Assets Types", error });
        })

    }

    useEffect(() => {

        if (children) {

            consultaListas(children.toString());
            consultaSites();
            consultaAssetTypes();
            consultaDetalleListas(listasIds);
            // si no tiene error hace el interval

        }

        return () => {
            setlistas([]);
        };
    }, [children, listasIds]);

    return <></>;
};


export { SotramacProvider, useDataSotramac, DataReportesSotramac }