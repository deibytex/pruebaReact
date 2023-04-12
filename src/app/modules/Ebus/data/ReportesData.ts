import {  Post_getDynamicValueProcedureDWHTabla, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { FiltrosReportes } from "../models/eBus";

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

export  function GetReporteOdometro(FechaInicial:string, FechaFinal: string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
   
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "GetUltimoOdometro", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export let ValidarFechas = (Filtros: FiltrosReportes, SetFiltro: ((arg0: FiltrosReportes) => void)) => {

    let flag = false;
     flag = (Filtros.FechaInicialInicial < Filtros.FechaInicial ||  Filtros.FechaFinal > Filtros.FechaFinal
        || (Filtros.FechaInicialInicial > Filtros.FechaInicial && 
            Filtros.FechaFinalInicial > Filtros.FechaFinal)
        )


         // cambiamos los datos iniciales 
    if ((Filtros.FechaInicialInicial > Filtros.FechaInicial) 
    || (Filtros.FechaInicialInicial > Filtros.FechaInicial && Filtros.FechaFinalInicial > Filtros.FechaFinal))
            SetFiltro({...Filtros, FechaInicialInicial: Filtros.FechaInicial})
   
if ((Filtros.FechaFinal > Filtros.FechaFinalInicial) || (Filtros.FechaInicialInicial > Filtros.FechaInicial && Filtros.FechaFinalInicial > Filtros.FechaFinal))
SetFiltro({...Filtros, FechaFinalInicial: Filtros.FechaFinal})   

return flag;


}
