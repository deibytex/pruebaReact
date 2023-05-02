import { GetClientes, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";

const tipoPreferencia = "2";

export  function getListadoClientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
    return  GetClientes(params);
};

export  function getClientesSeleccionado(usuarioIdS: string){
    var params: { [id: string]: string | null; } = {};
    params["usuarioIdS"] = usuarioIdS;
    params["clienteIds"] = null;
    params["tipoPreferencia"] = tipoPreferencia;
    
    // hacemos la consulta 
    return  Post_GetConsultasDinamicas({    
      Clase : "PortalQueryHelper",  
      NombreConsulta: "getPreferenciasDescarga", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};