import { createContext, useContext, useEffect, useState } from "react";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { FechaServidor } from "../../../../_start/helpers/Helper";


// clase con los funciones  y datos a utiilizar
export interface NeptunoContextModel {
    containerNeptuno?: string;
    setcontainerNeptuno: (container: string) => void;
}

const NeptunoContext = createContext<NeptunoContextModel>({
    setcontainerNeptuno: (container: string) => { }
});

const NeptunoProvider: React.FC = ({ children }) => {
    const [containerNeptuno, setcontainerNeptuno] = useState<string>();
    const value: NeptunoContextModel = {
        containerNeptuno,
        setcontainerNeptuno
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