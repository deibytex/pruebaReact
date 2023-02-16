
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
};
const  Principal: React.FC<Props> = () => {
   
    const {Visible, DatosMapa, dataTable,  ClienteSeleccionado, setdataTable, setDatosMapa} = useDataNivelCarga()
    const [show, setShow] = useState(false);
    const [showSoc, setShowSoc] = useState(false);
    const [tamaMapa, settamaMapa] = useState("50%");
    const [tamaTabla, settamaTabla] = useState("50%");
    //Para los clientes
    useEffect(() =>{
       setDatosMapa(DatosMapa);
    },[DatosMapa,dataTable])
 
    //Funcion  para la tabla 100% o 50%
    const ExpandirContraerTabla = () =>{
       //Tabla
        if(tamaTabla == '50%')
          settamaTabla("100%");
        else
          settamaTabla("50%");
        //Mapa
        if(tamaMapa == '50%')
            settamaMapa('0%')
        else
            settamaMapa('50%')
    }
    return(
            <NivelCargaProvider>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <button className="btn btn-sm btn-primary" title="Expadir contraer tabla" onClick={ExpandirContraerTabla}><i className="bi-display"></i></button>
                    </div>
                
                    <div className="col-sm-5 col-md-5 col-xs-5">
                        {/* <CargaListadoClientes/> */}
                       {/* <DataEventosTiempoClientes>{moment().format("MYYYY").toString()}</DataEventosTiempoClientes> */}
                    </div>
                    <div className="col-sm-1 col-md-1 col-xs-1">
                        <Indicador Visible={(Visible == undefined ? true:false)}></Indicador>
                    </div>
                </div>
                <Soc show={showSoc} handleClose={function (): void {
                setShowSoc(false);
                } }/>
                <Vehiculos CLienteIds={(ClienteSeleccionado != null ? ClienteSeleccionado?.clienteIdS: null )} show={show} handleClose={function (): void {
                    setShow(false);
                } }/> 
                <div style={{display: 'flex', flexWrap: 'wrap', width:'100%'}}>
                    <div style={{width:`${tamaTabla}`}}>{(dataTable.length != 0) && (<TablaNivelCarga data={dataTable}/>)}</div><div style={{width:`${tamaMapa}`}}>{( DatosMapa.length  != 0) && ( <Mapa ListadoVehiculos={(DatosMapa)}/>)}</div>
                </div>
            </NivelCargaProvider>
    )
}
export {Principal};