import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { FechaServidor } from "../../../../_start/helpers/Helper";
import { getVehiculosOperando } from "../data/dataPreoperacional";

import React from "react";

// clase con los funciones  y datos a utiilizar
export interface PreoperacionalContextModel {
    vehiculosOperacion?: any;
    setvehiculosOperacion: (vehiculos: any) => void;
    ListadoVehiculoSinOperacion?: any[];
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => void;
    iserror?: any;
    setError: (error: any) => void;
 
}

const PreoperacionalContext = createContext<PreoperacionalContextModel>({
    setvehiculosOperacion: (vehiculos: any) => { },
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => { },
    setError: (error: any) => { }
});


const PreoperacionalProvider: React.FC = ({ children }) => {
    const [vehiculosOperacion, setvehiculosOperacion] = useState<any>({});
    const [ListadoVehiculoSinOperacion, setListadoVehiculoSinOperacion] = useState<any[]>([]);
    const [iserror, setError] = useState<any>({});
    const value: PreoperacionalContextModel = {
        vehiculosOperacion,
        setvehiculosOperacion,
        ListadoVehiculoSinOperacion,
        setListadoVehiculoSinOperacion, iserror, setError
    };
    return (
        <PreoperacionalContext.Provider value={value}>
            {children}
        </PreoperacionalContext.Provider>
    );
};

function useDataPreoperacional() {
    return useContext(PreoperacionalContext);
}

// se encarga de consultar la información 
// de los vehiculos operando y en una frecuencia de 5 min 
// segun parametrización que debe realizarse

const DataVehiculoOperando: React.FC = ({ children }) => {
    const { setvehiculosOperacion, setListadoVehiculoSinOperacion, setError, iserror } = useDataPreoperacional();
    let idinterval: number = 0;


    //CONSULTA VEHICULOS OPERANDO
    let consulta = (children: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getVehiculosOperando(children, FechaServidor).then(

            (response) => {
                let datos = response.data[0];

                // traemos la informacion del  objeto a traer y la seteamos 
                // al objeto que tendrá la información en el contexto                 
                setvehiculosOperacion({
                    "Operando": datos["TotalOperando"],
                    "No Operando": datos["TotalVehiculosSinOpera"]
                });
                setListadoVehiculoSinOperacion(response.data);
            }

        ).catch((error) => {
            setError({ accion: "DataVehiculoOperando", error });
        })

    }

  
    useEffect(() => {

        if (children) {
        
            consulta(children.toString());
            // si no tiene error hace el interval
            if (iserror === null || iserror === undefined)
                if (idinterval === 0) {
                    idinterval = window.setInterval(() => {
                        consulta(children.toString());
                    }, 120000)
                }
        }

        return () => {
            setvehiculosOperacion([]);
        };
    }, [children]);
    return <></>;
};


export { PreoperacionalProvider, useDataPreoperacional, DataVehiculoOperando }