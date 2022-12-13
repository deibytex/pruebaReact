import axios from "axios";
import { CORE_ExecProcedureByTipoConsulta, CORE_getconsultadinamicas } from "../../../apiurlstore";
import { ParamsEndPointDynamic } from "../Models/paramsConsultasDinamicas";

export  function Post_getconsultadinamicas(props: ParamsEndPointDynamic , body: any) {
    return  axios({
      method: 'post',
      url: CORE_getconsultadinamicas,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  export  function Post_ExecProcedureByTipoConsulta(props: ParamsEndPointDynamic , body: any) {
    return  axios({
      method: 'post',
      url: CORE_ExecProcedureByTipoConsulta,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  
