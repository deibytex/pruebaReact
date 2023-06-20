import { createContext, useContext, useEffect, useState } from "react";


// clase con los funciones  y datos a utiilizar
export interface NeptunoContextModel {
    containerNeptuno?: string;
    setcontainerNeptuno: (container: string) => void;
    loader: boolean;
    setLoader:(container: boolean) => void;
    EsModificado: boolean;
    setEsModificado:(container: boolean) => void;
}

const NeptunoContext = createContext<NeptunoContextModel>({
    setcontainerNeptuno: (container: string) => { },
    setLoader: (container: boolean) => { },
    loader: false,
    EsModificado: false,
    setEsModificado:  (container: boolean)  => { }
});

const NeptunoProvider: React.FC = ({ children }) => {
    const [containerNeptuno, setcontainerNeptuno] = useState<string>();
    const [loader, setLoader] = useState<boolean>(false);
    const [EsModificado, setEsModificado] = useState<boolean>(false);
    const value: NeptunoContextModel = {
        containerNeptuno,
        setcontainerNeptuno, loader, setLoader,
        EsModificado: false,
        setEsModificado
    };
    return (
        <NeptunoContext.Provider value={value}>
            {children}
        </NeptunoContext.Provider>
    );
};

function useDataNeptuno() {
    return useContext(NeptunoContext);
}

export { NeptunoProvider, useDataNeptuno} 