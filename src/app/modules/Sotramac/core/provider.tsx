
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { GetAssets, getAssetTypes, getDetalleListas, GetDrivers, getListas, getSitesSotramac } from "../data/dataSotramac";


// clase con los funciones  y datos a utiilizar
export interface SotramacContextModel {
    listas?: any;
    setlistas: (lstlistas: any[]) => void;
    detalleListas?: any;
    setdetalleListas: (lstdetalleListas: any[]) => void;
    listasIds?: any;
    setlistasids: (ids: any) => void;
    assetTypes?: any;
    setassetTypes: (lstassettypes: any[]) => void;
    assets?: any;
    setassets: (lstassets: any[]) => void;
    drivers?: any;
    setdrivers: (lstdrivers: any[]) => void;
    fechaInicial?: any;
    setfechaInicial: (fechainicial: any) => void;
    fechaFinal?: any;
    setfechaFinal: (fechafinal: any) => void;
    driverSelected?: any;
    setdriverSelected: (driverSelected: any) => void;
    assetSelected?: any;
    setassetSelected: (assetSelected: any) => void;
    siteId?: any;
    setsiteId: (lstsiteId: any) => void;
    assetTypeId?: any;
    setassetTypeId: (lstassetTypeId: any) => void;
    iserror?: any;
    setError: (error: any) => void;

}

const SotramacContext = createContext<SotramacContextModel>({
    setlistas: (lstdetalleListas: any[]) => { },
    setdetalleListas: (lstlistas: any[]) => { },
    setlistasids: (ids: any) => (""),
    setassetTypes: (lstassettypes: any[]) => ([]),
    setassets: (lstassets: any[]) => ([]),
    setdrivers: (lstdrivers: any[]) => ([]),
    setfechaInicial: (fechainicial: any) => (""),
    setfechaFinal: (fechafinal: any) => (""),
    setdriverSelected: (driverSelected: any) => (""),
    setassetSelected: (assetSelected: any) => (""),
    setsiteId: (lstsiteId: any) => (0),
    setassetTypeId: (lstassetTypeId: any) => (0),
    setError: (error: any) => { }
});


const SotramacProvider: React.FC = ({ children }) => {

    const [listas, setlistas] = useState<any[]>([]);
    const [detalleListas, setdetalleListas] = useState<any[]>([]);
    const [listasIds, setlistasids] = useState("");
    const [assetTypes, setassetTypes] = useState<any[]>([]);
    const [assets, setassets] = useState<any[]>([]);
    const [drivers, setdrivers] = useState<any[]>([]);
    const [fechaInicial, setfechaInicial] = useState("");
    const [fechaFinal, setfechaFinal] = useState("");
    const [driverSelected, setdriverSelected] = useState("");
    const [assetSelected, setassetSelected] = useState("");
    const [siteId, setsiteId] = useState(0);
    const [assetTypeId, setassetTypeId]= useState(0);
    const [iserror, setError] = useState<any>({});

    const value: SotramacContextModel = {
        listas,
        setlistas,
        detalleListas,
        setdetalleListas,
        listasIds,
        setlistasids,
        assetTypes,
        setassetTypes,
        assets,
        setassets,
        drivers,
        setdrivers,
        fechaInicial,
        setfechaInicial,
        fechaFinal,
        setfechaFinal,
        assetSelected,
        setassetSelected,
        driverSelected,
        setdriverSelected,
        siteId,
        setsiteId,
        assetTypeId,
        setassetTypeId,
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
    const { setlistas, setError, setlistasids, setdetalleListas, setassetTypes, setassets, setdrivers, setassetTypeId,
             listasIds, iserror } = useDataSotramac();

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

    //CONSULTA LOS TIPOS DE ASSETS
    let consultaAssetTypes = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        getAssetTypes().then(

            (response) => {
                let datos = response.data[0];

                // traemos la informacion del  objeto a traer y la seteamos 
                // al objeto que tendrá la información en el contexto                 
                setassetTypeId(
                     datos["AssetTypeId"],
                  );
                setassetTypes(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Assets Types", error });
        })

    }

     //CONSULTA LOS ASSETS
     let consultaAssets = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        GetAssets().then(

            (response) => {
                setassets(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Assets Types", error });
        })

    }

    let consultaDrivers = () => {
        // consultamos en la base de datos la informacion de vehiculos operando
        GetDrivers().then(

            (response) => {
                setdrivers(response.data);
            }

        ).catch((error) => {
            setError({ accion: "Assets Types", error });
        })

    }


    useEffect(() => {

        if (children) {

            consultaListas(children.toString());
            consultaAssetTypes();
            consultaAssets();
            consultaDrivers();
            // si no tiene error hace el interval

        }

        return () => {
            setlistas([]);
        };
    }, [children]);

    useEffect(() => {

        if (listasIds != "") {

            consultaDetalleListas(listasIds);
            // si no tiene error hace el interval

        }

        return () => {
            <></>
        };
    }, [listasIds]);

    return <></>;
};


export { SotramacProvider, useDataSotramac, DataReportesSotramac }