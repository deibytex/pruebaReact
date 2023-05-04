import { createContext, useContext, useState } from "react";
import { ClienteDTO, InicioCliente } from "../../../../_start/helpers/Models/ClienteDTO";

export interface ClienteContextModel {
    ClienteSeleccionado? : ClienteDTO;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
}
const ClienteContext = createContext<ClienteContextModel>({
    setClienteSeleccionado: (Data: any) => {}
});
const ClienteProvider: React.FC = ({ children }) => {
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
 
    const value: ClienteContextModel = {
        setClienteSeleccionado,
        ClienteSeleccionado
    };
    return (
        <ClienteContext.Provider value={value}>
            {children}
        </ClienteContext.Provider>
    );
};

function useDataCliente() {
    return useContext(ClienteContext);
};
export { ClienteProvider, useDataCliente}