import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";

import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { ConsultarUsuarios } from "../data/dataLogs";
import { initialdataUsuarios, UsuariosDTO } from "../models/logModel";

export interface LogContextModel {
    FechaInicial?: string|undefined;
    FechaFinal?: string| undefined;
    Usuarios?: UsuariosDTO[];
    setFechaInicial : (FechaInicial: string) => void;
    setFechaFinal : (FechaFinal: string) => void;
    setUsuarios: (usuarios:UsuariosDTO[]) => void;
    UsuarioSeleccionado ?: UsuariosDTO;
    setUsuarioSeleccionado: (usuarios: UsuariosDTO) => void;
    
}
const LogContext = createContext<LogContextModel>({
    setFechaInicial: (FechaInicial: string) => { },
    setFechaFinal: (FechaFinal: string) => { },
    setUsuarios: (usuarios: UsuariosDTO[]) => { },
    setUsuarioSeleccionado:(Usuario:UsuariosDTO)  =>{}
});
const LogProvider: React.FC = ({ children }) => {
    const [FechaInicial, setFechaInicial] = useState<string>();
    const [FechaFinal, setFechaFinal] = useState<string>();
    const [Usuarios, setUsuarios] = useState<UsuariosDTO[]>([]);
    const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuariosDTO>();
    const value: LogContextModel = {
        FechaInicial,
        FechaFinal,
        Usuarios,
        setFechaInicial,
        setFechaFinal,
        setUsuarios,
        UsuarioSeleccionado,
        setUsuarioSeleccionado
    };
    return (
        <LogContext.Provider value={value}>
            {children}
        </LogContext.Provider>
    );
};

function useDatLog() {
    return useContext(LogContext);
}

const CargaInicialParametros: React.FC = () => {
    const { Usuarios , setUsuarios, UsuarioSeleccionado, setUsuarioSeleccionado,   setFechaInicial, setFechaFinal } = useDatLog();
    setFechaInicial(moment().add(-1,'months').format("DD/MM/YYYY"))
    setFechaFinal(moment().format("DD/MM/YYYY"))
useEffect(() =>{
   
    ConsultarUsuarios("null").then(
      (response) => {
        setUsuarios(response.data);
        
      }
  ).catch((error) => {
      errorDialog("Consultar usuarios", "Error al consultar usuarios, no se puede desplegar informacion");
  });
},[]);

return <>{(Usuarios !== undefined && UsuarioSeleccionado != undefined ) && CargaListadoUsuarios(Usuarios, UsuarioSeleccionado,  setUsuarioSeleccionado )}</>;
}

function CargaListadoUsuarios( LstUSuarios: UsuariosDTO[], UsuarioSeleccionado : UsuariosDTO,  setUsuarioSeleccionado : ((arg0: UsuariosDTO) => void)) {
    return (           
            <Form.Select   className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let Usuarios =  LstUSuarios?.filter((value, index) => {
                    return value.UsuarioId === e.currentTarget.value
                })  
              
            }} aria-label="Default select example">
                <option value="-1" selected={true}>Seleccione</option>
                {                        
                    LstUSuarios?.map((element,i) => {
                            let flag = (element.UsuarioId === UsuarioSeleccionado?.UsuarioId)
                        return (<option key={element.UsuarioId} selected={flag}  value={element.UsuarioId}>{element.Nombres}</option>)
                    })
                }
            </Form.Select>               
    );
  }
 
export { LogProvider, useDatLog, CargaInicialParametros} 