import axios from "axios";
import moment from "moment";
import { DWH_getconsultadinamicasprocedure, MOVIL_getReportesPorTipo } from "../../../../apiurlstore";

import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { FechaServidor } from "../../../../_start/helpers/Helper";

export  function getListas(Sigla: string){
    var params: { [id: string]: string | null; } = {};
    params["Sigla"] = Sigla;
    
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    
      Clase : "PortalQueryHelper",  
      NombreConsulta: "getListas", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};

export  function getDetalleListas(ListaId: number){
    var params: { [id: number]: number | null; } = {};
    params["ListaId"] = ListaId;
    
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    
      Clase : "PortalQueryHelper",  
      NombreConsulta: "getDetalleListas", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};
