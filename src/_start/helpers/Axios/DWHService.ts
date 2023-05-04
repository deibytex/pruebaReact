import axios from "axios";
import { ASSET_GetAssetsClienteId, ASSET_GetAssetsEstados, ASSET_GetClientesClienteIds, BASES_getDetalleListas, CLIENTE_GetClientes, CORE_getconsultadinamicasUser,
   CORE_getconsultadinamicasUserDWH, DRIVER_GetDriversClienteId, DWH_GetConsultasDinamicas, DWH_getDynamicValueProcedureDWHTabla, EBUS_GetClientesUsuarios, 
   EBUS_GetColumnasDatatable, EBUS_getEventActiveRecargaByDayAndClient, 
   EBUS_getEventActiveViajesByDayAndClient, EBUS_GetListaClientesActiveEvent, 
   EBUS_GetListadoClientesUsuario, EBUS_GetLocations, EBUS_GetTiempoActualizacion,
    EBUS_GetUltimaPosicionVehiculos, EBUS_GetUsuariosEsomos, EBUS_SetClientesActiveEvent, 
    EBUS_SetColumnasDatatable, 
    TX_GetListaSemana, TX_GetSnapShotTickets, TX_GetSnapShotTransmision, TX_GetUnidadesActivas } from "../../../apiurlstore";
import { ParamsEndPointDynamic } from "../Models/paramsConsultasDinamicas";

export function Post_GetConsultasDinamicas(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: DWH_GetConsultasDinamicas,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  export function Post_getDynamicValueProcedureDWHTabla(props: any, body: any) {
    return axios({
      method: 'post',
      url: DWH_getDynamicValueProcedureDWHTabla,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  
  export function Post_GetConsultasDinamicasUser(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: CORE_getconsultadinamicasUser,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  
  export function Post_GetConsultasDinamicasUserDWH(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: CORE_getconsultadinamicasUserDWH,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  
 
  

  export  function getVehiculosCliente( ClienteIds: string|null, UsertState : string) {
    return  axios({
      method: 'get',
      url: ASSET_GetClientesClienteIds,     
      headers: { 'Content-Type': 'application/json' },
      params : { ClienteIds, UsertState }
    });
  }

  export  function getVehiculosClienteId( ClienteId: string|null, UsertState : string|null) {
    return  axios({
      method: 'get',
      url: ASSET_GetAssetsClienteId,     
      headers: { 'Content-Type': 'application/json' },
      params : { ClienteId, UsertState }
    });
  }

  export  function getConductoresClienteId( ClienteId: string|null) {
    return  axios({
      method: 'get',
      url: DRIVER_GetDriversClienteId,     
      headers: { 'Content-Type': 'application/json' },
      params : { ClienteId }
    });
  }
  

  export  function getClientesEBUS() {
    return  axios({
      method: 'get',
      url: EBUS_GetClientesUsuarios,     
      headers: { 'Content-Type': 'application/json' },
      params : { }
    });
  }

  export  function Post_EventActiveViajesByDayAndClient(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_getEventActiveViajesByDayAndClient,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export  function Post_SetColumnasDatatable(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_SetColumnasDatatable,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export  function Post_GetColumnasDatatable(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_GetColumnasDatatable,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export  function Post_GetTiempoActualizacion(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_GetTiempoActualizacion,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }


  export  function Post_GetUltimaPosicionVehiculos(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_GetUltimaPosicionVehiculos,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }


  export  function Post_EBUS_getEventActiveRecargaByDayAndClient(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_getEventActiveRecargaByDayAndClient,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export  function GetClientes(props:any) {
    return  axios({
      method: 'get',
      url: CLIENTE_GetClientes,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export  function GetClientesActiveEvent(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_GetListaClientesActiveEvent,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export  function setClientesActiveEvent(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_SetClientesActiveEvent,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export function Post_GetLocations(props: any) {
    return  axios({
      method: 'post',
      url: EBUS_GetLocations,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export function Post_GetClientesUsuarios(props: any) {
    return  axios({
      method: 'post',
      url: EBUS_GetUsuariosEsomos,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export function Post_GetListadoClientesUsuario(props: any) {
    return  axios({
      method: 'post',
      url: EBUS_GetListadoClientesUsuario,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  
  /* TX */
  export function Post_GetListaSemanas(props: any) {
    return  axios({
      method: 'get',
      url: TX_GetListaSemana,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export function Post_UnidadesActivas(props: any) {
    return  axios({
      method: 'get',
      url: TX_GetUnidadesActivas,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export function Post_GetSnapShotTickets(props: any) {
    return  axios({
      method: 'get',
      url: TX_GetSnapShotTickets,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  
  export function Post_GetSnapShotTransmision(props: any) {
    return  axios({
      method: 'get',
      url: TX_GetSnapShotTransmision,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }
  export  function Post_GetEstadosAssets( tipoIdS: string|null) {
    return  axios({
      method: 'get',
      url: ASSET_GetAssetsEstados,     
      headers: { 'Content-Type': 'application/json' },
      params : { tipoIdS }
    });
  }
  export  function Post_GetDetallesListas( Sigla: string|null) {
    return  axios({
      method: 'get',
      url:  BASES_getDetalleListas,     
      headers: { 'Content-Type': 'application/json' },
      params : { Sigla }
    });
  }
 