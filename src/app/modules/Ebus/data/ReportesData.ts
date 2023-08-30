import moment from "moment";
import { Post_getDynamicValueProcedureDWHTabla, Post_getDynamicProcedureDWH } from "../../../../_start/helpers/Axios/DWHService";
import {  locateFormatNumberNDijitos, msToTimeSeconds } from "../../../../_start/helpers/Helper";

import { FormatoColombiaDDMMYYY } from "../../../../_start/helpers/Constants";

/**/
export function GetReporteAlarmas(clientesIds: string, FechaInicio: string, FechaFinal: string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicio;
    params['FechaFinal'] = FechaFinal;
    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteAlarmaReact", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}

export function GetReporteOdometro(FechaInicial: string, FechaFinal: string, clientesIds : string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
    params['ClienteIds'] = clientesIds;
  

    return Post_getDynamicProcedureDWH({
        NombreConsulta: "GetUltimoOdometroReact", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export function GetReporteEficiencia(FechaInicial: string, FechaFinal: string, clientesIds: number, tipo: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicial;
    params['FechaFin'] = FechaFinal;
    params['tipo'] = `${tipo}`;
    params['ClienteIds'] = `${clientesIds}`;

    return Post_getDynamicProcedureDWH({
        NombreConsulta: "GetReporteEficienciaMesVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetReporteOperadorMovil(FechaInicial: string, FechaFinal: string, tipo: string, clientesIds: number) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    params['Tipo'] = `${tipo}`;
    params['ClienteIds'] = `${clientesIds}`;
    return Post_getDynamicProcedureDWH({ Clase: "EbusQueryHelper", NombreConsulta: 'GetReporteZpPorCliente', Pagina: null, RecordsPorPagina: null }, params);
}

const tab1 = { icon: 'CarRental', titulo: "Móvil", subtitulo: "" }
const tab2 = { icon: 'Person', titulo: "Operador", subtitulo: "" }
const tab3 = { icon: 'Person', titulo: "Operador", subtitulo: "Zona" }

export const listTabs: any[] = [tab1, tab2, tab3]

export function GetReporteNivelCarga(FechaInicial: string, FechaFinal: string, clientesIds: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
    params['Movil'] = null;

    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetRecargasDetalladoPorFechasyVehiculoReact", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}

export function GetInformacionOdometro(FechaInicial: string, FechaFinal: string, clientesIds: string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;

    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteUltimoOdometroReact", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}


const tabEfi1 = { icon: 'CarRental', titulo: "Móvil", subtitulo: "Mensual" }
const tabEfi2 = { icon: 'CarRental', titulo: "Móvil", subtitulo: "Diario" }
const tabEfi3 = { icon: 'Person', titulo: "Operador", subtitulo: "Mensual" }
const tabEfi4 = { icon: 'Person', titulo: "Operador", subtitulo: "Diario" }
export const listTabsEficiencia: any[] = [tabEfi1, tabEfi2, tabEfi3, tabEfi4]



export function GetDataEficiencia(FechaInicial: string, FechaFinal: string, clientesIds: number, tipo: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicial;
    params['FechaFin'] = FechaFinal;
    params['ClienteIds'] = `${clientesIds}`;
    params['tipo'] = `${tipo}`;

    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "GetReporteEficienciaMesVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetReporteViajes(FechaInicial: string, FechaFinal: string,
    clientesIds: number, Movil: string | null) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
    params['Movil'] = `${Movil}`;

    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteViajesReact", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}


const tabSaf1 = { icon: 'Person', titulo: "Operador", subtitulo: "Mensual" }
const tabSaf2 = { icon: 'Person', titulo: "Operador", subtitulo: "Diario" }
const tabSaf3 = { icon: 'Person', titulo: "Operador", subtitulo: "Detallado" }
export const listTabsSafety: any[] = [tabSaf1, tabSaf2, tabSaf3]
 
const tabTablas = { icon: 'Person', titulo: "Indicadores", subtitulo: "Mensual" }
const tabMapaCalor = { icon: 'Map', titulo: "Mapa Calor", subtitulo: "Eventos" }
export const listTabsSafetyMapa: any[] = [tabTablas, tabMapaCalor]

export function GetDataSafety(FechaInicial: string, FechaFinal: string, clientesIds: number, tipo: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicial;
    params['FechaFin'] = FechaFinal;
    params['tipo'] = `${tipo}`;
    params['ClienteIds'] = `${clientesIds}`;

    return Post_getDynamicProcedureDWH({
        NombreConsulta: "getReporteSafety", Clase: "RagQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}


// listado de funciones personalizado para los reportes 
export const fncReporteAlarma = [
    {
        name: "DuracionHora",
        getData: (data: number) => {
            return msToTimeSeconds(data)
        }
    }
]
export const fncReporteOperadorMovil = [
    {
        name: "Fecha",
        getData: (data: any) => {
            return (moment(data).format(FormatoColombiaDDMMYYY))
        }
    }
]
// formato para la descarga excel del reporte de nivel de carga

export const fncReporteNivelCarga = [
    {
        name: "FechaCorte",
        getData: (data: any) => {
            return moment(data).format(FormatoColombiaDDMMYYY)
        }
    },
    {
        name: "Duracion",
        getData: (data: number) => {

            return msToTimeSeconds(data)
        }
    }, {
        name: 'Energia',

        getData: (data: number) => {
            return locateFormatNumberNDijitos(data, 2)
        }
    },
    {
        name: 'Odometro',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data, 2)
        }
    },
    {
        name: 'PotenciaPromedio',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data , 2)
        }
    },
]


// listado de funciones personalizado para los reportes 
export const fncReporteEficiencia = [
    {
        name: "Duracion",
        getData: (data: number) => {
            return msToTimeSeconds(data)
        }
    },
    {
        name: 'Energia',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data ?? 0, 2)
        }
    },
    {
        name: 'Eficiencia',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data ?? 0, 2)
        }
    },
    {
        name: 'VelProm',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data ?? 0, 2)
        }
    },
    {
        name: 'Descarga',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data ?? 0, 2)
        }
    },
    {
        name: 'Carga',
        getData: (data: number) => {
            return locateFormatNumberNDijitos(data ?? 0, 2)
        }
    }
]



// listado de funciones personalizado para los reportes 
export const fncReporteNoConductor = [
    {
        name: "noidporc",
        getData: (data: number) => {
            return data
        }
    }
]