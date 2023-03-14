import { width } from "@mui/system";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { object } from "yup";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { useDataParqueo } from "../../core/ParqueoProvider";
import { GetUltimaPosicionVehiculos } from "../../data/Parqueo";
import {  TablaDTO } from "../../models/ParqueoModels";
import { ModalParqueo } from "./ModalParqueo";

type Props = {
    ClienteIds: string | undefined;
    Data:[];
    Visible : () =>void;
};

 const  Parqueo: React.FC<Props> = ({ClienteIds, Visible, Data}) => {
    const {setVisible} = useDataParqueo();
    const [posiciones, setPosiciones] = useState<{}>({})
    const [Datos, setDatos] = useState<[]>([])
    const [DataTabla,setDataTabla ] = useState<TablaDTO[]>([])
    const [show,setShow ] = useState<boolean>(false)
    const [title,setTitle] = useState<string>("Detalles parqueo")
    let Periodo = moment().format("MYYYY").toString();
    const _LocDefault = 'En circulacion';
    useEffect(() =>{
        setDatos(Data);
        let _vehiculosAgrupados = AgruparLocacion(Data)
        setPosiciones(_vehiculosAgrupados);
    },[Data])

    const filterObjeto = (list:any, compare:any)=> {
        var newList = [];
        var countProp = compare.length;
        var countMatch = 0;
        var valComp;
        var valList;
        for (var iList in list) {
            if (list[iList].locationId == compare)
                newList.push(list[iList]);
        }
        return newList;
    }
    const OnclickDetallesParqueo = (event:any) =>{
        let Dato = event.currentTarget.attributes["data-rel"].value;
       let DatosCompletos = filterObjeto(Datos, Dato);
       setShow(true);
       setDataTabla(DatosCompletos);
       setTitle((DatosCompletos[0].localizacion == '' ? _LocDefault:DatosCompletos[0].localizacion))
    }

    const AgruparLocacion = (Datos:any) => {
        let Locaciones = {};
        let locationOnly = {};
        Datos.forEach((x: { locationId: PropertyKey; localizacion: any; assetsDescription: any; latitud: any; longitud: any; aVLString: any; placa:any;}) => {
            if (!Locaciones.hasOwnProperty(x.locationId)) {
                Locaciones[x.locationId] = {
                    Vehiculos: []
                };
            };
    
            //Agregamos los datos de la locacion. 
            Locaciones[x.locationId].Vehiculos.push({
                LocalizacionId: x.locationId,
                Localizacion: x.localizacion,
                assetsDescription: x.placa,
                Latitud: x.latitud,
                Longitud: x.longitud,
                AVL: x.aVLString
            });
        })
        return Locaciones;
    }

    const CloseModal = () =>{
       setShow(false);
    }
    function CargarUbicaciones (Datos:any) {
        let Data = [];
        for (let index = 0; index < Datos.length; index++) {
            Data.push(
                <div key={index} className="card   px-2col-xs-3 col-sm-3 col-md-3 col-xl-3 col-lg-3" style={{marginBottom:'5px'}}>
                    <div className="card card-border rounded text-white bg-primary">
                        <div id="Titulo" style={{backgroundColor:'white', color:' #26a68c'}}>
                            <span className= "badge-pill align-self-center ml-auto text-syscaf-azul" style = {{ fontWeight:'bold'}} title={( Datos[index].Vehiculos[0].LocalizacionId == 0 ? _LocDefault.toUpperCase() : Datos[index].Vehiculos[0].Localizacion.toUpperCase())}>
                                {( Datos[index].Vehiculos[0].LocalizacionId == 0 ? _LocDefault.toUpperCase() : ( Datos[index].Vehiculos[0].Localizacion.toUpperCase().length > 25 ?  Datos[index].Vehiculos[0].Localizacion.toUpperCase().substring(24, 0):Datos[index].Vehiculos[0].Localizacion.toUpperCase()))} 
                            </span>
                        </div>
                        <div className="card-body rounded" id="bodyCaja" title={Datos[index].Vehiculos[0].Localizacion.toUpperCase()}>
                            <div className="d-flex">
                                <div className="row" style={{width:'100%'}}>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-xl-6 col-lg-6">
                                        <h2 className="font-weight-semibold mb-0"><i className="bi-car-front-fill" style={{color:'white', fontSize:'35px'}}></i></h2>
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-xl-6 col-lg-6" style={{textAlign:'end'}}>
                                        <span className="badge-pill align-self-center ml-auto" style={{color:'white', fontSize:'25px'}}> { Datos[index].Vehiculos.length} </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex"><h3 className="font-weight-semibold mb-0"></h3></div>
                        </div>
                        <div title={Datos[index].Vehiculos[0].Localizacion.toUpperCase()} className="detalle card card-rounded shadow-sm" onClick={OnclickDetallesParqueo} 
                        style={{cursor: 'pointer', backgroundColor: 'white', color: '#26a68c'}} data-rel={Datos[index].Vehiculos[0].LocalizacionId}>
                            <div style={{marginLeft:'1px', marginRight:'1px' , marginBottom:'1px', width:'100%'}} className="row">
                                <div style={{backgroundColor:'white',  width:'80%'}} className="text-syscaf-azul col-xs-6 col-sm-6 col-md-6 col-xl-6 col-lg-6">
                                    <span style={{paddingLeft: '5px'}}> Ver Detalles</span>
                                </div>
                                <div style={{backgroundColor:'white',  width:'20%'}} className="text-syscaf-azul col-xs-6 col-sm-6 col-md-6 col-xl-6 col-lg-6" >
                                    <i id="iconodetalle" style={{float:'right', paddingRight: '5px', paddingTop:'4px'}} className="bi-search"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
             }    
        return  (<>{(Data.length != 0 ) && (Data)}</>)
    }
   
    return (
        <> {(DataTabla.length != 0 ) && (<ModalParqueo show={show} title={title} handleClose={CloseModal} Data={DataTabla}></ModalParqueo>)} {(Object.entries(posiciones).length != 0 ) && (CargarUbicaciones(Object.values(posiciones)))}</>
    )
 }

 export {Parqueo}