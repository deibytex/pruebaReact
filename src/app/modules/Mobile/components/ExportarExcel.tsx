import FileSaver from "file-saver";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataPreoperacional } from "../core/provider";
import React, { useState } from "react";
import { Preoperacional, Respuestas, sinPreoperacional } from "../models/respuestas";
import { Button } from "react-bootstrap-v5";
import moment from "moment";
import { getRespuestas } from "../data/dataPreoperacional";
import { AxiosResponse } from "axios";
import { forEachChild } from "typescript";
import { object } from "yup";
type Props ={
    NombreArchivo: string;
    tipoDescarga: number;
}
export const ExportarExcel : React.FC<Props>= ({NombreArchivo, tipoDescarga}) =>{
    const { Encabezados, vehiculosSinPreoperacional } = useDataPreoperacional();
    const [ Respuestas, setRespuestas ] = useState<Respuestas[]>([]);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    
        const exportarExcel = async() =>{
            if (tipoDescarga === 0){
                if((Encabezados as Preoperacional[]).length > 0){

                    getRespuestas(null).then((respuesta: AxiosResponse<Respuestas[]>) => {
                        
                        Encabezados?.map((arr) => {
                        let filter = respuesta.data.filter(function (item) {
                            return (item.EncabezadoId == arr.EncabezadoId)
                        })  
                        // console.log(filter.sort((a, b) => {return a.Secuencia - b.Secuencia}));                   
                        setRespuestas(filter);
                    })
                    });

                    

                    let finaldata = (Encabezados as Preoperacional[]).map((item) =>{
                        
                       let todo = Respuestas.map((arr)=> {
                            let Objeto = {};
                            Objeto["Conductor"] = item.Conductor;
                            Objeto["Fecha y Hora"] = item.FechaHoraString;
                            Objeto["Cliente"] =  item.clienteNombre;
                            Objeto["Vehículo"] =  item.Description;
                            Objeto["Gestor"] = item.Gestor;
                            Objeto["Estado Gestión"] = item.EsGestionado ? "En Gestion" : "Es Gestionado" ;
                            Objeto["1"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 1) ? arr.Respuesta : "";
                            Objeto["2"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 2) ? arr.Respuesta : "";;
                            Objeto["3"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 3) ? arr.Respuesta : "";;
                            Objeto["4"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 4) ? arr.Respuesta : "";;
                            Objeto["5"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 5) ? arr.Respuesta : "";;
                            Objeto["6"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 6) ? arr.Respuesta : "";;
                            Objeto["7"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 7) ? arr.Respuesta : "";;
                            Objeto["8"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 8) ? arr.Respuesta : "";;
                            Objeto["9"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 9) ? arr.Respuesta : "";;
                            Objeto["10"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 10) ? arr.Respuesta : "";;
                            Objeto["11"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 11) ? arr.Respuesta : "";;
                            Objeto["12"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 12) ? arr.Respuesta : "";;
                            Objeto["13"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 13) ? arr.Respuesta : "";;
                            Objeto["14"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 14) ? arr.Respuesta : "";;
                            Objeto["15"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 15) ? arr.Respuesta : "";;
                            Objeto["16"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 16) ? arr.Respuesta : "";;
                            Objeto["17"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 17) ? arr.Respuesta : "";;
                            Objeto["18"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 18) ? arr.Respuesta : "";;
                            Objeto["19"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 19) ? arr.Respuesta : "";;
                            Objeto["20"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 20) ? arr.Respuesta : "";;
                            Objeto["21"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 21) ? arr.Respuesta : "";;
                            Objeto["22"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 22) ? arr.Respuesta : "";;
                            Objeto["23"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 23) ? arr.Respuesta : "";;
                            Objeto["24"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 24) ? arr.Respuesta : "";;
                            Objeto["25"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 25) ? arr.Respuesta : "";;
                            Objeto["26"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 26) ? arr.Respuesta : "";;
                            Objeto["27"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 27) ? arr.Respuesta : "";;
                            Objeto["28"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 28) ? arr.Respuesta : "";;
                            Objeto["29"] = (item.EncabezadoId == arr.EncabezadoId && arr.Secuencia == 29) ? arr.Respuesta : "";;
                            Objeto["Estado"] = item.Estado == 0 ? "Aprobado" : "No Aprobado";    
                            console.log('a ver',Objeto)
                            return Objeto;

                        }) 
                        return todo;        
                    })
                    console.log('se supone',finaldata);
                    // const ws = XLSX.utils.json_to_sheet(finaldata);
                    // const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
                    // const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
                    // const data = new Blob([excelBuffer],{type: fileType});
                    // FileSaver(data,`${NombreArchivo}${fileExtension}`);
                }else{
                    errorDialog("No hay datos que exportar","");
                }
            }
            else{
                if((vehiculosSinPreoperacional as sinPreoperacional[]).length >0){
                    let finaldata = (vehiculosSinPreoperacional as sinPreoperacional[]).map((item) =>{
                        let Objeto = {};
                        Objeto["Conductor"] = item.Conductor;
                        Objeto["Vehículo"] = item.Vehiculo;
                        Objeto["Descripción"] =  item.RegistrationNumber;
                        Objeto["Fecha Primer Viaje"] = moment(item.FechaViaje).format("DD-MM-YYYY HH:mm");
                        Objeto["Kms Recorrido"] =item.DistanciaRecorrida;
                        Objeto["Nro Viajes"] = item.CantViajes;
                        return Objeto;
                    })
                    const ws = XLSX.utils.json_to_sheet(finaldata);
                    const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
                    const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
                    const data = new Blob([excelBuffer],{type: fileType});
                    FileSaver(data,`${NombreArchivo}${fileExtension}`);
                }else{
                    errorDialog("No hay datos que exportar","");
                }
            }
                 
        }
           
    
    return(
        <div className="mt-5 justify-content-end" style={{ textAlign: 'right' }}>
        <Button type="button" variant="primary" onClick={() => { exportarExcel(); }}>
            Descargar Reportes
        </Button>
        </div>
    )
} 