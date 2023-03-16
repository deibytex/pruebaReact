import { AxiosResponse } from "axios";
import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { PostEventActiveRecargaByDayAndClient } from "../data/Eventocarga";
import { GetClientesEsomos, GetVehiculos, ValidarTiempoActualizacion } from "../data/NivelCarga";
import { ClienteDTO, dualListDTO, InicioCliente, TablaDTO } from "../models/EventoCargaModels";
import { AssetsDTO } from "../models/NivelcargaModels";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { ExportarExcel } from "../components/EventoCarga/ExportarExcel";
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


