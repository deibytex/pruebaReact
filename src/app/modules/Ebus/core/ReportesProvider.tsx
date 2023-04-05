
import { createContext, useContext, useState } from "react";
import { ClienteDTO,  InicioCliente } from "../models/EventoCargaModels";

export interface ReportesContextModel {
    
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void; 
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
  
}
const ReportesContext = createContext<ReportesContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {}

});
export const ReportesProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
   

    const value: ReportesContextModel = {
       setClientes,
       setClienteSeleccionado,
       ClienteSeleccionado,
       Clientes
    };
    return (
        <ReportesContext.Provider value={value}>
            {children}
        </ReportesContext.Provider>
    );
};
export function useDataReportes() {
    return useContext(ReportesContext);
}


