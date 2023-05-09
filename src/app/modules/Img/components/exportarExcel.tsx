import FileSaver from "file-saver";
import { errorDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataImg } from "../core/provider";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap-v5";
import moment from "moment";
import { AxiosResponse } from "axios";
import { getErroresViajesyUso, setPreferenciasClientes } from "../data/dataImg";
import { FormatoColombiaDD_MM_YYY, FormatoSerializacionYYYY_MM_DD_HHmmss } from "../../../../_start/helpers/Constants";
import { ErroresViajesyUso } from "../models/dataModels";
type Props = {
}

export const ExportarExcel: React.FC<Props> = () => {

    const { clientesSelected, fechaInicial, fechaFinal, usuarioId, setloader, setclientesSelected } = useDataImg();

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';

    const [selectedClientes, setselectedClientes] = useState("");
    const [clienteid, setclienteid] = useState("");

    useEffect(() => {
        setclienteid(clientesSelected[0]);
        setselectedClientes(clientesSelected.join());

    }, [clientesSelected]);

    const exportarExcel = async () => {

        setloader(true);
        //Cambiamos el cliente elegido por el usurio para la descarga de información
        setPreferenciasClientes(usuarioId, selectedClientes).then((respuesta: AxiosResponse<any[]>) => {
            setclientesSelected((respuesta.data as any[]).map(a => a.clienteIdS.toString()));
        });

        //Traemos la información del reporte
        getErroresViajesyUso(moment(fechaInicial).format(FormatoSerializacionYYYY_MM_DD_HHmmss)
            , moment(fechaFinal).endOf('day').format(FormatoSerializacionYYYY_MM_DD_HHmmss)
            , clienteid).then((respuesta: AxiosResponse<any[]>) => {

                crearExcel(respuesta.data);
            })

        const crearExcel = (respuestas: ErroresViajesyUso[]) => {
            if(respuestas.length > 0){
                let finaldata = respuestas.map((item) => {
                    if (item != null) {
                        let Objeto = {};
                        Objeto["Consecutivo"] = item.Consecutivo;
                        Objeto["Cliente"] = item.Cliente;
                        Objeto["US/UK"] = item.US;
                        Objeto["VehicleID"] = item.VehicleID;
                        Objeto["Placa"] = item.Placa;
                        Objeto["VehicleSiteID"] = item.VehicleSiteID;
                        Objeto["VehicleSiteName"] = item.VehicleSiteName;
                        Objeto["TripNo"] = item.TripNo;
                        Objeto["DriverID"] = item.DriverID;
                        Objeto["DriverName"] = item.DriverName;
                        Objeto["DriverSiteID"] = item.DriverSiteID;
                        Objeto["DriverSiteName"] = item.DriverSiteName;
                        Objeto["OriginalDriverID"] = item.OriginalDriverID;
                        Objeto["OriginalDriverName"] = item.OriginalDriverName;
                        Objeto["TripStart"] = item.TripStart;
                        Objeto["TripEnd"] = item.TripEnd;
                        Objeto["CategoryID"] = item.CategoryID;
                        Objeto["Notes"] = item.Notes;
                        Objeto["StartSubTripSeq"] = item.StartSubTripSeq;
                        Objeto["EndSubTripSeq"] = item.EndSubTripSeq;
                        Objeto["TripDistance"] = item.TripDistance;
                        Objeto["Odometer"] = item.Odometer;
                        Objeto["MaxSpeed"] = item.MaxSpeed;
                        Objeto["SpeedTime"] = item.SpeedTime;
                        Objeto["SpeedOccurs"] = item.SpeedOccurs;
                        Objeto["MaxBrake"] = item.MaxBrake;
                        Objeto["BrakeTime"] = item.BrakeTime;
                        Objeto["BrakeOccurs"] = item.BrakeOccurs;
                        Objeto["MaxAccel"] = item.MaxAccel;
                        Objeto["AccelTime"] = item.AccelTime;
                        Objeto["AccelOccurs"] = item.AccelOccurs;
                        Objeto["MaxRPM"] = item.MaxRPM;
                        Objeto["RPMTime"] = item.RPMTime;
                        Objeto["RPMOccurs"] = item.RPMOccurs;
                        Objeto["GBTime"] = item.GBTime;
                        Objeto["ExIdleTime"] = item.ExIdleTime;
                        Objeto["ExIdleOccurs"] = item.ExIdleOccurs;
                        Objeto["NIdleTime"] = item.NIdleTime;
                        Objeto["NIdleOccurs"] = item.NIdleOccurs;
                        Objeto["StandingTime"] = item.StandingTime;
                        Objeto["Litres"] = item.Litres;
                        Objeto["StartGPSID"] = item.StartGPSID;
                        Objeto["EndGPSID"] = item.EndGPSID;
                        Objeto["StartEngineSeconds"] = item.StartEngineSeconds;
                        Objeto["EndEngineSeconds"] = item.EndEngineSeconds;
                        return Objeto;
                    }
                })
                const ws = XLSX.utils.json_to_sheet(finaldata);
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: fileType });
                FileSaver(data, `Errores Viajes y Uso ${moment(fechaInicial).format(FormatoColombiaDD_MM_YYY)} ${moment(fechaFinal).format(FormatoColombiaDD_MM_YYY)}${fileExtension}`);
                setloader(false);
            }else{
                setloader(false);
                errorDialog("No hay datos que exportar","");
            }            
        }
    }

    return (
        <div className="col-sm-4 col-md-4 col-xs-4 col-lg-4" style={{ textAlign: 'right' }}>
            <Button type="button" variant="primary" onClick={() => { exportarExcel(); }}>
                Generar Reporte
            </Button>
        </div>
    )
} 