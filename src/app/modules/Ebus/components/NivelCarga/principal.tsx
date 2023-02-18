
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
    tamaMapa:string;
    ResetearDatos: boolean;

};
const  Principal: React.FC<Props> = ({ExpandirContraerTabla, tamaTabla, tamaMapa, ResetearDatos}) => {
   
    const {Visible, ResetearValores, DatosMapa, dataTable,  ClienteSeleccionado, setdataTable, setDatosMapa, setEstotal, EsTotal, DatosMapaIndividual, setDatosMapaIndividual} = useDataNivelCarga()
    const [show, setShow] = useState(false);
    const [showSoc, setShowSoc] = useState(false);
    const [Vehiculo, setVehiculo] = useState("");
useEffect(() =>{
    (ResetearDatos?setEstotal(true):setEstotal(false))
},[ResetearDatos])

const cargarMapaIndividual = (row: any) =>{
    setVehiculo(row.target.dataset.rel)
    setEstotal(false);
    let MapaIdnividual = DatosMapa.filter((item:any) =>{
      return (item.placa == row.target.dataset.rel);
    })
    setDatosMapaIndividual(MapaIdnividual);
    return row.target.dataset.rel;
  };
    return(
        <NivelCargaProvider>
            <Soc show={showSoc} handleClose={function (): void {
            setShowSoc(false);
            } }/>
            <Vehiculos CLienteIds={(ClienteSeleccionado != null ? ClienteSeleccionado?.clienteIdS: null )} show={show} handleClose={function (): void {
                setShow(false);
            } }/> 
            <div style={{display: 'flex', flexWrap: 'wrap', width:'100%'}}>
                <div style={{width:`${tamaTabla}`}}>{(dataTable.length != 0) && (<TablaNivelCarga  data={dataTable} cargarMapaIndividual={cargarMapaIndividual}/>)}</div><div style={{width:`${tamaMapa}`}}>{( DatosMapa.length  != 0) && ( <Mapa ListadoVehiculos={(EsTotal ? DatosMapa: DatosMapaIndividual)}/>)}</div>
            </div>
        </NivelCargaProvider>
    )
}
export {Principal};