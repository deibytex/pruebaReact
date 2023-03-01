import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { getVehiculosOperando, getEncabezados, getVehiculosSinPreoperacional } from "../data/dataPreoperacional";

import React from "react";
import { sinPreoperacional, Preoperacional } from "../models/dataModels";
import { setuid } from "process";

// clase con los funciones  y datos a utiilizar
export interface PreoperacionalContextModel {
    vehiculosOperacion?: any;
    setvehiculosOperacion: (vehiculos: any) => void;
    ListadoVehiculoSinOperacion?: any[];
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => void;
    Encabezados?: Preoperacional[];
    setEncabezados: (lstencabezados: Preoperacional[]) => void;
    vehiculosSinPreoperacional?: sinPreoperacional[];
    setvehiculosSinPreoperacional: (lstSinPreoperacional: sinPreoperacional[]) => void;
    UserId?: string;
    setUserId: (id: string) => void;
    Visible?:boolean;
    setVisible : (visible:boolean)  => void;
    iserror?: any;
    setError: (error: any) => void;

}

const PreoperacionalContext = createContext<PreoperacionalContextModel>({
    setvehiculosOperacion: (vehiculos: any) => { },
    setListadoVehiculoSinOperacion: (lstvehiculos: any[]) => { },
    setEncabezados: (lstencabezados: Preoperacional[]) => { },
    setvehiculosSinPreoperacional: (lstSinPreoperacional: sinPreoperacional[]) => { },
    setUserId: (id: string) => "",
    setVisible:(Visible:boolean) =>{},
    setError: (error: any) => { }
});


const PreoperacionalProvider: React.FC = ({ children }) => {
    const [vehiculosOperacion, setvehiculosOperacion] = useState<any>({});
    const [ListadoVehiculoSinOperacion, setListadoVehiculoSinOperacion] = useState<any[]>([]);

    const [Encabezados, setEncabezados] = useState<Preoperacional[]>([]);
    const [vehiculosSinPreoperacional, setvehiculosSinPreoperacional] = useState<sinPreoperacional[]>([]);
    const [UserId, setUserId] = useState("");
    const [iserror, setError] = useState<any>({});
    const [Visible, setVisible] = useState<boolean>(false);

    const value: PreoperacionalContextModel = {
        vehiculosOperacion,
        setvehiculosOperacion,
        ListadoVehiculoSinOperacion,
        setListadoVehiculoSinOperacion,
        Encabezados,
        setEncabezados,
        vehiculosSinPreoperacional,
        setvehiculosSinPreoperacional,
        UserId,
        setUserId,
        Visible,
        setVisible,
        iserror,
        setError
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
    const { setvehiculosOperacion, setListadoVehiculoSinOperacion, setEncabezados, setvehiculosSinPreoperacional, setUserId, setError, iserror } = useDataPreoperacional();
    let idinterval: number = 0;

    //CONSULTA VEHICULOS OPERANDO
    let consulta = (clienteIdS: string, fecha: string) => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getVehiculosOperando(clienteIdS, fecha).then(

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

    // CONSULTA EVENTOS ACTIVOS POR MINUTO
    let consultaEncabezados = (clienteid: string, fecha: string) => {

        getEncabezados(clienteid, fecha, 'null').then(

            (response) => {

                setEncabezados(response.data);
                // cuando tengamos los datos activamos todo el trabajo pesado

            }).catch((e) => {
                setError({ accion: "DataVehiculoOperando", error: "No hay datos para este cliente" });
                // errorDialog("Consulta preoperacional", "No hay datos que mostrar");
            });

    }

    // CONSULTA EVENTOS ACTIVOS POR MINUTO
    let consultaSinPreoperacional = (clienteIdS: string, fecha: string) => {

        getVehiculosSinPreoperacional(clienteIdS, fecha).then(

            (response) => {

                setvehiculosSinPreoperacional(response.data);
                // cuando tengamos los datos activamos todo el trabajo pesado

            }).catch((e) => {
                setError({ accion: "DataVehiculoOperando", error: "No hay datos para este cliente" });
                // errorDialog("Consulta preoperacional", "No hay datos que mostrar");
            });;

    }

    let asignarUsuario = (userid: string) => {
        
        setUserId(userid);
    }

    useEffect(() => {

        if (children) {

            consulta(children['clienteIdS'], children['fecha']);
            consultaEncabezados(children['clienteid'], children['fecha']);
            consultaSinPreoperacional(children['clienteIdS'], children['fecha']);
            asignarUsuario(children['userId']);
            // si no tiene error hace el interval
            if (iserror === null || iserror === undefined)
                if (idinterval === 0) {
                    idinterval = window.setInterval(() => {
                        consulta(children['clienteIdS'], children['fecha']);
                        consultaEncabezados(children['clienteid'], children['fecha']);
                        consultaSinPreoperacional(children['clienteIdS'], children['fecha']);
                        asignarUsuario(children['userId'])
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