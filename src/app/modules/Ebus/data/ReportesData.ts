import moment from "moment";
import { Post_getDynamicValueProcedureDWHTabla, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { locateFormatNumberNDijitos, msToTimeSeconds } from "../../../../_start/helpers/Helper";
import { TabProperty } from "../../../../_start/helpers/Models/Tabs";
import { FormatoColombiaDDMMYYY } from "../../../../_start/helpers/Constants";

/**/
export function GetReporteAlarmas(clientesIds: string, FechaInicio: string, FechaFinal: string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicio;
    params['FechaFinal'] = FechaFinal;
    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteAlarma", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}

export function GetReporteOdometro(FechaInicial: string, FechaFinal: string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;

    return Post_GetConsultasDinamicas({
        NombreConsulta: "GetUltimoOdometro", Clase: "EBUSQueryHelper",
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

    return Post_GetConsultasDinamicas({
        NombreConsulta: "GetReporteEficienciaMesVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetReporteOperadorMovil(FechaInicial: string, FechaFinal: string, tipo: string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    const NombreConsulta = (tipo == "0" ? "GetReporteOperadorMovil" : (tipo == "1" ? "GetReporteOperador" : "GetReporteOperadorZonas"))
    return Post_GetConsultasDinamicas({ Clase: "EbusQueryHelper", NombreConsulta: NombreConsulta, Pagina: null, RecordsPorPagina: null }, params);
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

    return Post_GetConsultasDinamicas({
        NombreConsulta: "GetRecargasDetalladoPorFechasyVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export function GetInformacionOdometro(FechaInicial: string, FechaFinal: string, clientesIds: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;

    return Post_GetConsultasDinamicas({
        NombreConsulta: "GetReporteUltimoOdometro", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
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

    return Post_GetConsultasDinamicas({
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

    return Post_GetConsultasDinamicas({
        NombreConsulta: "GetReporteViajes", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}


const tabSaf1 = { icon: 'Person', titulo: "Operador", subtitulo: "Mensual" }
const tabSaf2 = { icon: 'Person', titulo: "Operador", subtitulo: "Diario" }
const tabSaf3 = { icon: 'Person', titulo: "Operador", subtitulo: "Detallado" }
export const listTabsSafety: any[] = [tabSaf1, tabSaf2, tabSaf3]

export function GetDataSafety(FechaInicial: string, FechaFinal: string, clientesIds: number, tipo: number) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicio'] = FechaInicial;
    params['FechaFin'] = FechaFinal;
    params['tipo'] = `${tipo}`;
    params['ClienteIds'] = `${clientesIds}`;

    return Post_GetConsultasDinamicas({
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