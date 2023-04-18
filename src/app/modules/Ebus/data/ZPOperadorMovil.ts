import { Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";

export function GetReporteOperadorMovil(FechaInicial:string, FechaFinal:string, tipo:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    const NombreConsulta = (tipo == "0" ? "GetReporteOperadorMovil": (tipo == "1" ? "GetReporteOperador" : "GetReporteOperadorZonas"))
    return  Post_GetConsultasDinamicas({ Clase : "EbusQueryHelper",  NombreConsulta: NombreConsulta, Pagina :null, RecordsPorPagina :null}, params);
}