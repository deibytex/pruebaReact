
import { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { Oval, Watch } from "react-loader-spinner";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { TituloNivelCarga } from "../../../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../../../_start/layout/core";
import { DataEventosTiempoClientes, Indicador, NivelCargaProvider, useDataNivelCarga } from "../../core/NivelCargaProvider";
import { GetClientesEsomos, PostEventActiveViajesByDayAndClient } from "../../data/NivelCarga";
import { MapaDTO, MapaInicial, TablaDTO } from "../../models/NivelcargaModels";
import { Mapa } from "./mapa";
import { Soc } from "./Soc";
import { TablaNivelCarga } from "./TablaNivelCarga";
import { Vehiculos } from "./Vehiculos";
type Props = {
    ExpandirContraerTabla: () =>void;
    tamaTabla: string;
    tamaMapa:boolean;
    ResetearDatos: boolean;

};
const  Principal: React.FC<Props> = ({ExpandirContraerTabla, tamaTabla, tamaMapa, ResetearDatos}) => {
    //Para obtener, setear los datos, los usestate
    const {  DatosMapa, dataTable,   
         setEstotal} = useDataNivelCarga()
    //UseEffect
    useEffect(() =>{
        (ResetearDatos?setEstotal(true):setEstotal(false))
    },[ResetearDatos])
//Para cargar los datos del mapa individual




  tamaMapa = (tamaTabla === '6');

  //para retornar los datos de la tabla por componentes.
    return(
        <>
         
                <div  className={`row  col-sm-${tamaTabla} col-md-${tamaTabla} col-xs-${tamaTabla} `} >{(dataTable.length != 0) && (<TablaNivelCarga  data={dataTable} />)}</div>
                   
                <div style={{display : (tamaMapa) ?  'block' : 'none'  }}  className={`row  col-sm-6 col-md-6 col-xs-6`}>{( DatosMapa.length  != 0) && ( <Mapa />)}</div>
          
        </>
       
          
         
          
        
    )
}
export {Principal};