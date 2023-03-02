
import React from "react";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { getListas } from "../data/dataSotramac";
import { Listas } from "../models/dataModels";

// clase con los funciones  y datos a utiilizar
export interface SotramacContextModel {
    listas?: any;
    setlistas: (lstlistas: any[]) => void;
    iserror?: any;
    setError: (error: any) => void;

}

const SotramacContext = createContext<SotramacContextModel>({
    setlistas: (lstlistas: any[]) => { },
    setError: (error: any) => { }
});


const SotramacProvider: React.FC = ({ children }) => {

    const [listas, setlistas] = useState<any[]>([]);
    const [iserror, setError] = useState<any>({});

    const value: SotramacContextModel = {
        listas,
        setlistas,
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
    const {  setlistas, setError, iserror } = useDataSotramac();

    //CONSULTA VEHICULOS OPERANDO
    let consultaListas = (Sigla: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getListas(Sigla).then(

            (response) => {
                setlistas(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Listas", error });
        })

    }

    useEffect(() => {

        if (children) {

            consultaListas(children.toString());
            // si no tiene error hace el interval

        }

        return () => {
            setlistas([]);
        };
    }, [children]);

    return <></>;
};


export { SotramacProvider, useDataSotramac, DataReportesSotramac }