
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
    //Para obtener, setear los datos, los usestate
    const {Visible, ResetearValores, DatosMapa, dataTable,  ClienteSeleccionado, setdataTable, setDatosMapa, setEstotal, EsTotal, DatosMapaIndividual, setDatosMapaIndividual} = useDataNivelCarga()
    const [show, setShow] = useState(false);
    const [showSoc, setShowSoc] = useState(false);
    const [Vehiculo, setVehiculo] = useState("");
    //UseEffect
    useEffect(() =>{
        (ResetearDatos?setEstotal(true):setEstotal(false))
    },[ResetearDatos])
//Para cargar los datos del mapa individual
const cargarMapaIndividual = (row: any) =>{
    setVehiculo(row.target.dataset.rel)
    setEstotal(false);
    let MapaIdnividual = DatosMapa.filter((item:any) =>{
      return (item.placa == row.target.dataset.rel);
    })
    setDatosMapaIndividual(MapaIdnividual);
    return row.target.dataset.rel;
  };
  //para retornar los datos de la tabla por componentes.
    return(
        <NivelCargaProvider>
            <div style={{display: 'flex', flexWrap: 'wrap', width:'100%'}}>
                <div style={{width:`${tamaTabla}`}}>{(dataTable.length != 0) && (<TablaNivelCarga  data={dataTable} cargarMapaIndividual={cargarMapaIndividual}/>)}</div>
                    <div style={{width:'10px'}}>
                        
                    </div>
                <div style={{width:`${tamaMapa}`}}>{( DatosMapa.length  != 0) && ( <Mapa ListadoVehiculos={(EsTotal ? DatosMapa: DatosMapaIndividual)}/>)}</div>
            </div>
        </NivelCargaProvider>
    )
}
export {Principal};