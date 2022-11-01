import axios from "axios";
import { CORE_getconsultadinamicas } from "../../../apiurlstore";
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
