import axios from "axios";
import { GetClientes, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";

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

export  function setPreferenciasClientes( usuarioIdS: string, ClienteIdS: string) {

    var params: { [id: string]: string | null; } = {};
    params["usuarioIdS"] = usuarioIdS;
    params["ClienteIdS"] = ClienteIdS;
    params["tipoPreferencia"] = tipoPreferencia;
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "PortalQueryHelper" , NombreConsulta : "setPreferenciasDescarga" }
    });
  };

  export  function getErroresViajesyUso( fechaInicial: string, fechaFinal: string, clienteIdS: string) {

    var params: { [id: string]: string | null; } = {};
    params["FechaInicial"] = fechaInicial;
    params["FechaFinal"] = fechaFinal;
    params["clienteIdS"] = clienteIdS;
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "IMGQueryHelper" , NombreConsulta : "getReporteErroresViajesyUso" }
    });
  };