
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";


// clase con los funciones  y datos a utiilizar
export interface CorreosTxContextModel {


}

const CorreosTxContext = createContext<CorreosTxContextModel>({

});


const CorreosTxProvider: React.FC = ({ children }) => {



    const value: CorreosTxContextModel = {
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
 

    return <></>;
};


export { CorreosTxProvider, useDataCorreosTx, DataCorreosTX }