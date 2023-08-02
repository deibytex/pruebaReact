import moment from "moment"
import { FormatoColombiaDDMMYYY } from "../../../../../_start/helpers/Constants"

const tabReq1 = { icon: 'Equalizer', titulo: "Todos ", subtitulo: "" }
const tabReq2 = { icon: 'Equalizer', titulo: "Asignados", subtitulo: "" }
const tabReq3 = { icon: 'Equalizer', titulo: "Cerradas", subtitulo: "" }
const tabReq4 = { icon: 'Equalizer', titulo: "Reportes ", subtitulo: "" }
export const listTabsRequerimientos: any[] = [tabReq1, tabReq2, tabReq3, tabReq4]
export const fncReporte = [
    {
        name: "Fecha",
        getData: (data: any) => {
            return (moment(data).format(FormatoColombiaDDMMYYY))
        }
    }
]

//======================================================================================================================================
export const FiltroData = {
    // Indicadores asignados
    getAsignados: (data: any[]) => {
        return data.filter(f => ["Asignado Soporte", "Asignado Agente", "Asignado ST"].includes((f.Estado)));
    },
    //indicadores de cerrados
    getCerrados: (data: any[]) => {
        return data.filter(f => ["Cerrado"].includes((f.Estado)));
    },
    //Indicador de abiertos
    getAbiertos: (data: any[]) => {
        return data.filter(f => ["Creado", "Reabierto"].includes((f.Estado)));
    },
    //Indicador de soporte
    getSoporte: (data: any[]) => {
        return data.filter(f => ["Soporte, En Soporte, Rev Soporte"].includes((f.Estado)));
    },
    //Es el reporte total
    getReporte: function (data: any[]) {
        return (data).reduce((p, c) => {
            const Cabecera = JSON.parse(c.Cabecera);
            let name = Cabecera[0].registrationNumber;
            p[name] = p[name] ?? [];
            p[name].push(c);
            return p;
        }, {});
    },
    //para sacar los clientes
    getClientes: (data: any[]) => {
        let Cabeceras = data.map((e: any) => JSON.parse(e.Cabecera));
        return Cabeceras.reduce((p, c) => {
            let name = c[0].nombrecliente;
            p[name] = p[name] ?? [];
            p[name].push(c[0].clienteid);
            return p;
        }, {});
    },
    //para sacar los agentes
    getAgentes: (data: any[]) => {
        let Cabeceras = data.map((e: any) => JSON.parse(e.Cabecera));
        return Cabeceras.reduce((p, c) => {
            let name = c[0].agente;
            p[name] = p[name] ?? [];
            p[name].push(c[0].UsuarioId);
            return p;
        }, {});
    },
    //para sacarlos estados
    getEstados: (data: any[]) => {
        return data.map(f => f.Estado).filter(UnicoArrayValores);
    },
    //Para filtrar por agentes
    getFiltrobyAgente: (data: any[], UsuarioId: any) => {
        //Taraigo los datos de las cabeceras y las convierto a array para poder buscarlas posteriormente.
        let Cabeceras = data.map((e: any) => JSON.parse(e.Cabecera));
        //FIltro las cabeceras por usuariops
        let CabeceraFound = Cabeceras.filter((e: any) => e[0].UsuarioId == UsuarioId);
        //Declaro un array para meter los datos y porteriormente retornarlos
        let l: any = [];
        //Recorro las cabeceras encoentraas. 
        CabeceraFound.reduce((a, b) => {
            //Filtro los registros que coincidan con el filtro aplicado, como tengo los datos para filtrar es en las cabeceras
            //de deserializo y escojo el primer registro y serializo convierto a string para compar si equivalen al mismo
            //Si lo es retorno el registro completo
            let o = data.filter((val: any) => {
                let cabecera = JSON.parse(val.Cabecera);
                if (String(JSON.stringify(cabecera[0])) == String(JSON.stringify(b[0]))) {
                    return val;
                }
            })
            //Agrego el primer registro encontrado
            l.push(o[0])
        }, {})
        //retorno el array con los elementos a mostrar
        return l;
    },
    //Para filtrar por estados
    getFiltrobyEstados: (data: any[], Estado: any) => {
        return data.filter(f => f.Estado == Estado);
    },
    getFiltrobyCliente: (data: any[], Clienteid: any) => {
        //Taraigo los datos de las cabeceras y las convierto a array para poder buscarlas posteriormente.
        let Cabeceras = data.map((e: any) => JSON.parse(e.Cabecera));
        //FIltro las cabeceras por usuariops
        let CabeceraFound = Cabeceras.filter((e: any) => e[0].clienteid == Clienteid);
        //Declaro un array para meter los datos y porteriormente retornarlos
        let l: any = [];
        //Recorro las cabeceras encoentraas. 
        CabeceraFound.reduce((a, b) => {
            //Filtro los registros que coincidan con el filtro aplicado, como tengo los datos para filtrar es en las cabeceras
            //de deserializo y escojo el primer registro y serializo convierto a string para compar si equivalen al mismo
            //Si lo es retorno el registro completo
            let o = data.filter((val: any) => {
                let cabecera = JSON.parse(val.Cabecera);
                if (String(JSON.stringify(cabecera[0])) == String(JSON.stringify(b[0]))) {
                    return val;
                }
            })
            //Agrego el primer registro encontrado
            l.push(o[0])
        }, {})
        //retorno el array con los elementos a mostrar
        return l;
    },
    getAsignadosTipo: (data: any[], Tipo:any) => {
        return data.filter(f => ["Asignado Soporte", "Asignado Agente", "Asignado ST"].includes((f.Estado)) && f.Tipo == Tipo);
    },
    getAbiertosTipo: (data: any[], Tipo:any) => {
        return data.filter(f => ["Creado", "Reabierto"].includes((f.Estado)) && f.Tipo == Tipo);
    },
     //indicadores de cerrados
     getCerradosTipo: (data: any[], Tipo:any) => {
        return data.filter(f => ["Cerrado"].includes((f.Estado)) && f.Tipo == Tipo);
    },
     //Indicador de soporte
     getSoporteTipo: (data: any[], Tipo:any) => {
        return data.filter(f => ["Soporte, En Soporte, Rev Soporte"].includes((f.Estado)) && f.Tipo == Tipo);
    },
};

// cuando se usa un filtro permite traer el unico valor de todas los valores del array
function UnicoArrayValores(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}