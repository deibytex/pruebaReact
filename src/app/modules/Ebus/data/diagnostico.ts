import moment from "moment";

import { Post_GetConsultasDinamicasCore } from "../../../../_start/helpers/Axios/DWHService";

export  function GetListadoNoCarga(ClienteIds: string, FechaInicial: Date, FechaFinal : Date) {
    var params: { [id: string]: string | null; } = {};

   
    params["FechaInicio"] =moment(FechaInicial).format("yyyyMMDD HH:mm");
    params["FechaFinal"] =moment(FechaFinal).format("yyyyMMDD HH:mm");
    params["Clienteids"] =ClienteIds;
    // hacemos la consulta 
    return  Post_GetConsultasDinamicasCore({    Clase : "EbusQueryHelper",  NombreConsulta: "DiagnosticoCarga", Pagina :null, RecordsPorPagina :null}, params);
   
}


