import { Post_getconsultadinamicas, Post_Getconsultadinamicas, Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { Post_GetListaSemanas, Post_GetSnapShotTickets, Post_GetSnapShotTransmision, Post_UnidadesActivas } from "../../../../_start/helpers/Axios/DWHService";


export function GetListadoSemanas(Anio: string) {
    var params: { [id: string]: string | null; } = {};
    params['Anio'] = Anio;
    return Post_GetListaSemanas(params);
}

export function GetUnidadesActivas(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetUnidadesActivas", Pagina: null, RecordsPorPagina: null }, params);
}

export function GetSnapShotTickets(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    return Post_Getconsultadinamicas({ Clase: "TXQueryHelper", NombreConsulta: "GetTickets", Pagina: null, RecordsPorPagina: null }, params);
}
export function GetSnapShotTransmision(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetTransmision", Pagina: null, RecordsPorPagina: null }, params);
}

export function GetUnidadesActivas2(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_UnidadesActivas(params);
}
export function GetSnapShotTickets2(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_GetSnapShotTickets(params);
}
export function GetSnapShotTransmision2(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_GetSnapShotTransmision(params);
}

export function SetActualizaUnidadesActivas(Fecha: string) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    return Post_getconsultadinamicas({ Clase: "TXQueryHelper", NombreConsulta: "SetSnapshotUnidadesActivasFecha", Pagina: null, RecordsPorPagina: null }, params);
}
export function GetUnidadesActivasAcumulado(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetSnapshotUnidadesActivas3", Pagina: null, RecordsPorPagina: null }, params);
}
export function GetSnapShotTransmisionAcumulado(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetTransmisionAcumulado4Semanas", Pagina: null, RecordsPorPagina: null }, params);
}

export function GetSnapShotUnidadesActivasAcumulado(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetSnapshotUnidadesActivasAcumulado", Pagina: null, RecordsPorPagina: null }, params);
}
export function GetSnapShotUnidadesActivasChurn(Fecha: string | null, ClienteId: string | null | undefined) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return Post_getconsultadinamicasUser({ Clase: "TXQueryHelper", NombreConsulta: "GetSnapshotUnidadesActivasChurn", Pagina: null, RecordsPorPagina: null }, params);
}

//======================================================================================================================================
export const FiltroData = {
    // obtiene la informaci'on de unidades con Activo facturable SI
    getActivosSiNO: (data: any[]) => {
        return data.filter(f => ["Si", "No"].includes((f.ClasificacionId == "No Definido" ? f.ActivoFacturable : f.ClasificacionId)));
    },
    getDataActivos: function (data: any[]) {
        return this.getActivosSiNO(data).reduce((p, c) => {
            const esFacturable = c.ClasificacionId == "Si" ? "Facturable" : "No Facturable";
            let exist = p.filter((f: any) => f.ClasificacionId == esFacturable);
            if (exist.length == 0)
                p.push({ ClasificacionId: esFacturable, Total: 1 });
            else
                exist[0].Total++;
            return p;
        },
            []);
    },
    // trae el listado de los administradoes agrupados y totaltiza los datos
    getAdministradores: function (data: any[]) {
        return this.getActivosSiNO(data).reduce((p, c) => {
            const admin = c.Administrador;
            let exist = p.filter((f: any) => f.Administrador == admin);
            if (exist.length == 0)
                p.push({ Administrador: admin, Total: 1 });
            else
                exist[0].Total++;
            return p;
        },
            []);
    },

    // trae el total de verticales por estado o administrador
    // trae el listado de los administradoes agrupados 
    getDataVerticalPorEstado: function (data: any[], estado: string, administrador: string) {
        return this.getActivosSiNO(data).reduce((p, c) => {
            const a = (c.ClasificacionId == "No Definido" ? c.ActivoFacturable : c.ClasificacionId);
            // si el estado es -1 significa que son todos los estados  de lo contrario toma el estado que se le pase
            // tambien con el administrador 
            if ((estado == "-1" || a == estado) && (administrador == '-1' || c.Administrador == administrador)) {
                let exist = p.filter((f: any) => f.Vertical == c.Vertical);
                if (exist.length == 0)
                    p.push({ Vertical: c.Vertical, Total: 1 });

                else
                    exist[0].Total++;
            }
            return p;
        },
            []);


    },
    getDataFacturableConsolidada: function (data: any[], estado: string) {
        return this.getActivosSiNO(data).reduce((p, c) => {
            const a = (c.ClasificacionId == "No Definido" ? c.ActivoFacturable : c.ClasificacionId);
            // si el estado es -1 significa que son todos los estados  de lo contrario toma el estado que se le pase
            // tambien con el administrador 
            if (a == estado) {
                let exist = p.filter((f: any) => f.Base == c.Base);
                if (exist.length == 0)
                    p.push({ Base: c.Base, Total: 1 });
                else
                    exist[0].Total++;
            }
            return p;
        },
            []);

    },
    getDataFacturableDetallada: function (data: any[], estado: string) {
        return this.getActivosSiNO(data).filter(f => f.ClasificacionId == estado);
    }
};