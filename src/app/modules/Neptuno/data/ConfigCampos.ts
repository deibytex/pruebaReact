import axios from "axios";
import { CORE_getconsultadinamicas, NEP_InsertaArchivo } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";
import { NuevoArchivoDTO } from "../models/neptunoDirectory";


  export  function insertaArchivo(props: NuevoArchivoDTO ) {
    return  axios({
      method: 'post',
      url: NEP_InsertaArchivo,      
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }