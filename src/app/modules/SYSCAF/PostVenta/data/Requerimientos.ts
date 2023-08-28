import moment from "moment"
import { FormatoColombiaDDMMYYY } from "../../../../../_start/helpers/Constants"
import confirmarDialog, { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog"
import {   Post_GetConsultasDinamicasUserCore,  Post_getDynamicProcedureDWH } from "../../../../../_start/helpers/Axios/DWHService"
import { FiltroDashBoardData } from "./PostVentaData"
// import { Usuarios } from "../mockData/indicadores"
import { Post_getconsultadinamicas } from "../../../../../_start/helpers/Axios/CoreService"

const tabReq1 = { icon: 'Equalizer', titulo: "Todos ", subtitulo: "" }
const tabReq2 = { icon: 'Equalizer', titulo: "Asignados", subtitulo: "" }
//Soporte
const tabReq5 = { icon: 'Equalizer', titulo: "No Asignados", subtitulo: "" }
const tabReq3 = { icon: 'Equalizer', titulo: "Cerradas", subtitulo: "" }
const tabReq4 = { icon: 'Equalizer', titulo: "Reportes ", subtitulo: "" }

export const listTabsRequerimientos: any[] = [tabReq1, tabReq2, tabReq5, tabReq3, tabReq4 ]
export const fncReporte = [
    {
        name: "Fecha",
        getData: (data: any) => {
            return (moment(data).format(FormatoColombiaDDMMYYY))
        }
    }
]

//=====================================================================================================================================
//Guarda los requerimientos
export function SetRequerimiento(Datos:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Cabecera"] = Datos.Cabecera;
    params["Observaciones"] = Datos.Observaciones;
    params["Estado"] = Datos.Estado;
    params["Id"] = String(Datos.Id);
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "ModificarRequerimiento", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}

//Elimina los requerimientos
export function DeleteRequerimiento(Datos:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Observaciones"] = Datos.Observaciones;
    params["Estado"] = Datos.Estado;
    params["Id"] = String(Datos.Id);
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "EliminarRequerimiento", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}

//Trae los requerimientos
export function GetRequerimientos(FechaInicial:any,FechaFinal:any, Perfil:any ){
    var params: { [id: string]: string | null | undefined; } = {};
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    params["PerfilId"] = String(Perfil);
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetRequerimientosInterfaz", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Notifica
export function SetNotificaciones(Datos:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["UsuarioId"] = Datos.UsuarioId;
    params["RequerimientoId"] = String(Datos.RequerimientoId);
    params["Descripcion"] = Datos.Descripcion;
    params["NotificarCorreo"] = Datos.NotificarCorreo;
    params["NotificarPortal"] = Datos.NotificarPortal;
    return Post_getconsultadinamicas({
        NombreConsulta: "SetNotificacionesRequerimiento", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Encabezado
export function GetEncabezado(AssetId:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["AssetId"] =AssetId;
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetEncabezado", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
export function GetEncabezadoFallas(FechaInicial:any, FechaSinTx:any, ClienteIds:any  ){
    var params: { [id: string]: string | null | undefined; } = {};
    params["FechaInicial"] =FechaInicial;
    params["FechaFinal"] =FechaSinTx;
    params["ClienteIds"] =String(ClienteIds);
    return Post_getDynamicProcedureDWH({
        NombreConsulta: "GetFallaEncabezado", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Se guarda el diagnostico
export function SetDiagnostico(Datos:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Diagnostico"] = Datos.Diagnostico;
    params["Observaciones"] = Datos.Observaciones;
    params["Estado"] = Datos.Estado;
    params["Id"] = String(Datos.Id);
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "setDiagnostico", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}

//Se Consultan las configuraciones
export function GetConfiguracion(Sigla:any|null){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Sigla"] = Sigla;
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetConfiguracion", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}

//======================================================================================================================================
export const FiltroData = {
    // Indicadores asignados
    getAsignados: (data: any[],Estado: any) => {
        return data.filter(f => [...Estado.split(",")].includes(((FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado).label : f.Estado))));
    },
    getNoAsignados: (data: any[],Estado: any) => {
        return data.filter(f =>[...Estado.split(",")].includes( ((FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado).label : f.Estado))));
    },
    //indicadores de cerrados
    getCerrados: (data: any[],Estado: any) => {
        return data.filter(f => [...Estado.split(",")].includes(((FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado).label : f.Estado))));
    },
    //Indicador de abiertos
    getAbiertos: (data: any[],Estado: any) => {
        return data.filter(f => [...Estado.split(",")].includes(((FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado).label : f.Estado))));
    },
    //Indicador de soporte
    getSoporte: (data: any[],Estado: any) => {
        return data.filter(f => [...Estado.split(",")].includes(((FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado).label : f.Estado))));
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
                let name =  c[0].agente;
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
        return data.filter((f:any) =>{
            let estado = (FiltroDashBoardData.EsJson(f.Estado)  == true ? JSON.parse(f.Estado) : f.Estado);
            
            return ((estado.label == undefined ? estado : estado.label) == Estado ?? f);
        });
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
    getAsignadosTipo: (data: any[], Estado:any, Tipo:any) => {
        return data.filter(f => [...Estado.split(",")].includes((f.Estado)) && f.Tipo == Tipo);
    },
    getAbiertosTipo: (data: any[], Estado:any,Tipo:any) => {
        return data.filter(f => ![...Estado.split(",")].includes((f.Estado)) && f.Tipo == Tipo);
    },
     //indicadores de cerrados
     getCerradosTipo: (data: any[],Estado:any, Tipo:any) => {
        return data.filter(f => [...Estado.split(",")].includes((f.Estado)) && f.Tipo == Tipo);
    },
     //Indicador de soporte
     getSoporteTipo: (data: any[],Estado:any, Tipo:any) => {
        return data.filter(f => [...Estado.split(",")].includes((f.Estado)) && f.Tipo == Tipo);
    },
    getIsActivoMod:(row:any, estado:any) =>{
        let Estado =  (FiltroDashBoardData.EsJson(row.original.Estado)  ? JSON.parse(row.original.Estado):row.original.Estado);
        if((Estado.label == undefined  ? Estado:Estado.label) != estado)
            return false;
        else
            return true;
    },
    getvalidar:(Observacion:any) =>{
      if(Observacion == null || Observacion == undefined){
        errorDialog("Debe ingresar una observación","");
        return false;
      }
        
        return true;
    },
    getIsUsuarioSoporte:(Usuario:any,Usuarios :any) =>{
        let Existe = Usuarios.filter((f:any) =>f.UserId == Usuario);
       return (Existe.length != 0 ? true:false);
    },
    getFiltroGestor : (data:any[], Usuario:any, Usuarios:any) =>{
        if(Usuario == "")
            return;

        let UsuarioFound = Usuarios.filter((f:any) =>f.UserId == Usuario);
        if(UsuarioFound.length != 0){
            if(UsuarioFound[0].EsGestor ==  true){
                return data
            }
            else
                return data.filter((val:any) =>{
                    let Estado =  (FiltroDashBoardData.EsJson(val.Estado)  == true ? JSON.parse(val.Estado) : val.Estado);
                    if(Estado.valor  == "1" || Estado.valor == "3" || val.UsuarioId == Usuario){
                        return val;
                    }
                 
                })
        }
    },
    getEstadosJson : (Estado:any) =>{
        let estado = (FiltroDashBoardData.EsJson(Estado)  == true ? JSON.parse(Estado) : Estado);
        return(estado.label == undefined ? estado : estado.label);
    },
    getEsCompletado : (data:any[]) =>{
        return data.filter((val:any) =>{
            if(val.esobligatorio == "si" && val.Respuesta == false)
              return val;
            else if(val.observaciones == "si-obligatorio" && val.RespuestaObservacion == "" || val.RespuestaObservacion == null || val.RespuestaObservacion == undefined )
                return val;
        })
    },
    getComprobarEstado : (data:any) =>{
        let valor:boolean = false;
        let b =  data.filter((val:any)=>{
                if(val.esobligatorio =="si" && !val.Estado)
                return val;
            });
            if(b.length == 0)
                valor = false;
            else
                valor = true;
        return valor
    },
    getConfiguracionSigla: (data: any[],Sigla: any) => {
        let datos = data.map((f:any) => {
            if(f.Sigla == Sigla) 
                return JSON.parse(f.Configuracion);
        }).filter((e) => e)
        return  datos;
    },
};
// cuando se usa un filtro permite traer el unico valor de todas los valores del array
function UnicoArrayValores(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

 //FUNCIONES PARA LOS REQUERIMIENTOS
export const RequerimientoFunciones = {
      // Indicadores asignados
   
    SetAsignarRequerimiento: (data: any) => {
        confirmarDialog(() => {

        }, `¿Esta seguro que desea asignar el registro?`, 'Aceptar');
    },
}   


//Espacios pAra las Columnas
