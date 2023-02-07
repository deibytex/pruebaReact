import { Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";

export  function GetClientes(usuarioids: string, userid:string) {
    var params: { [id: string]: string | null; } = {};
    params["usuarioids"] = usuarioids;
    params["userid"] = userid;
    // hacemos la consulta 
    return  Post_GetConsultasDinamicas({    Clase : "EbusQueryHelper",  NombreConsulta: "getListClienteAsignados", Pagina :null, RecordsPorPagina :null}, params);
   
}