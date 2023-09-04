import { Post_ExecProcedureByTipoConsulta, Post_getconsultadinamicas } from "../../../../../_start/helpers/Axios/CoreService";

export  function setConfiguracion(Sigla: string, Configuraciones: string , Movimientos: string, tipo: string ){
    var params: { [id: string]: string | null; } = {};
    params["sigla"] = Sigla;
    params["data"] = Configuraciones;
    params["movimientos"] = Movimientos;
    params["tipo"] = tipo;
    
    // hacemos la consulta 
    return  Post_ExecProcedureByTipoConsulta({    
      Clase : "GOIQueryHelper",  
      NombreConsulta: "setConfiguracion", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};

export  function getConfiguracion(Sigla: string ){
  var params: { [id: string]: string | null; } = {};
  params["sigla"] = Sigla;

  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "GOIQueryHelper",  
    NombreConsulta: "getConfiguracion", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};


export  function getUsuarios(clienteId: string ){
  var params: { [id: string]: string | null; } = {};
  params["clienteId"] = clienteId;

  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "PortalQueryHelper",  
    NombreConsulta: "getUserByClientId", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};