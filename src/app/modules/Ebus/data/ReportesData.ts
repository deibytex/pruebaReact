import {  Post_getDynamicValueProcedureDWHTabla } from "../../../../_start/helpers/Axios/DWHService";

/**/
export  function GetReporteAlarmas(clientesIds:string,FechaInicio:string,FechaFinal:string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicio'] = FechaInicio;
    params['FechaFinal'] = FechaFinal;
    return  Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteAlarma", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}
