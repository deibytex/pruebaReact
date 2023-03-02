import { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { ObtenerListadoCLientes } from "../data/Configuracion";
import { ClienteDTO, InicioCliente } from "../models/ConfiguracionModels";

export interface ConfiguracionEbusContextModel {
    Clientes? : ClienteDTO[];
    ClienteSeleccionado? : ClienteDTO;
    setClientes:(Cliente: ClienteDTO[]) => void;
    setClienteSeleccionado:(Cliente: ClienteDTO) => void;
   
}
const ConfiguracionEbusContext = createContext<ConfiguracionEbusContextModel>({
    setClientes: (Cliente: any) => {},
    setClienteSeleccionado: (Data: any) => {},
});
const ConfiguracionEbusProvider: React.FC = ({ children }) => {
    const [Clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [ClienteSeleccionado, setClienteSeleccionado] = useState<ClienteDTO>(InicioCliente);
    const [Visible, setVisible] = useState<boolean>(true);
    const value: ConfiguracionEbusContextModel = {
        setClientes,
        setClienteSeleccionado,
        ClienteSeleccionado,
        Clientes
    };
    return (
        <ConfiguracionEbusContext.Provider value={value}>
            {children}
        </ConfiguracionEbusContext.Provider>
    );
};

function useDataConfiguracionEbus() {
    return useContext(ConfiguracionEbusContext);
};

const CargaClientes: React.FC = ({children}) => {
    const { setClienteSeleccionado, setClientes, ClienteSeleccionado, Clientes } = useDataConfiguracionEbus();
    useEffect(() =>{
        ObtenerListadoCLientes().then((response:AxiosResponse<any>) => {
            setClientes(response.data);
            setClienteSeleccionado(response.data[0]);
        }
    ).catch((error) => {
        errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
    });
    },[]);

    return <>{(ClienteSeleccionado !== undefined && Clientes != undefined ) && SeleccionClientes(Clientes,ClienteSeleccionado,setClienteSeleccionado)}</>;
}


function SeleccionClientes (Clientes:any, ClienteSeleccionado:any, setClienteSeleccionado: ((arg0: ClienteDTO) => void) )  {
    return (           
        <Form.Select   className=" mb-3 " onChange={(e) => {
            // buscamos el objeto completo para tenerlo en el sistema
            let lstClientes =  Clientes?.filter((value:any, index:any) => {
                return value.clienteIdS === Number.parseInt(e.currentTarget.value)
            })  
            if(lstClientes)
                setClienteSeleccionado(lstClientes[0]);
        }} aria-label="Default select example">
            <option value={0}  >Seleccione</option>
            {                        
                Clientes?.map((element:any,i:any) => {
                        let flag = (element.clienteIdS === ClienteSeleccionado?.clienteIdS)
                    return (<option key={element.clienteIdS} selected={flag}  value={(element.clienteIdS != null ? element.clienteIdS:0)}>{element.clienteNombre}</option>)
                })
            }
        </Form.Select>               
    );
}
export { ConfiguracionEbusProvider, useDataConfiguracionEbus, CargaClientes}