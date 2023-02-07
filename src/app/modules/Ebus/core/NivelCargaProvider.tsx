import { createContext, useContext, useEffect, useState } from "react";
import { initialdataUsuarios, UsuariosDTO } from "../../Neptuno/models/logModel";

// clase con los funciones  y datos a utiilizar
export interface NivelCargaProviderContextModel {
    Usuarios?: UsuariosDTO[];
    setUsuarios: (usuarios:UsuariosDTO[]) => void;
    UsuarioSeleccionado ?: UsuariosDTO;
    setUsuarioSeleccionado: (usuarios: UsuariosDTO) => void;
}
const NivelCargaContext = createContext<NivelCargaProviderContextModel>({
    setUsuarios: (usuarios: UsuariosDTO[]) => { },
    setUsuarioSeleccionado:(Usuario:UsuariosDTO)  =>{}
});
const NivelCargaProvider: React.FC = ({ children }) => {
    const [Usuarios, setUsuarios] = useState<UsuariosDTO[]>([initialdataUsuarios]);
    const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuariosDTO>(initialdataUsuarios);
    const value: NivelCargaProviderContextModel = {
         Usuarios,
        setUsuarios,
        UsuarioSeleccionado,
        setUsuarioSeleccionado
    };
    return (
        <NivelCargaContext.Provider value={value}>
            {children}
        </NivelCargaContext.Provider>
    );
};
function useDataNivelCarga() {
    return useContext(NivelCargaContext);
}

export { NivelCargaProvider, useDataNivelCarga }