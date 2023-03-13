import { useEffect, useState } from "react";
import FileSaver from "file-saver";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import XLSX from 'sheetjs-style';
import { useDataEventoCarga } from "../../core/EventoCargaProvider";
import { TablaDTO } from "../../models/NivelcargaModels";
type Props ={
    NombreArchivo: string;
}
export const ExportarExcel : React.FC<Props>= ({NombreArchivo}) =>{
    const {  dataTable, IsFiltrado, dataTableFiltrada,   VehiculosFiltrados, MinSocCarga, MaxSocCarga} = useDataEventoCarga()
    const [Datos, setDatos] = useState<TablaDTO[]>([]);


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    const exportarExcel = async() =>{
        if(dataTable!= undefined && dataTable.length > 0){
           console.log(dataTable)
                let finaldata = dataTable.map((item) =>{
                    if(item != null) {
                    let Objeto = {};
                    Objeto["Estado"] = (item.isDisconected == 1 ? 'Desconectado' : 'Conectado y Cargando');
                    Objeto["Móvil"] = item.placa;
                    Objeto["Inicio ini [%]"] =  item.socInicial;
                    Objeto["Inicio carga"] = item.fechaString;
                    Objeto["Soc act [%]"] =item.soc;
                    Objeto["Tiempo carga"] = item.totalTime;
                    Objeto["Energia"] =item.energia?.toLocaleString('es-CO');
                    Objeto["Potencia Inst [kW]"] = item.potencia?.toLocaleString('es-CO');
                    Objeto["Potencia Prom [kW]"] = item.potenciaProm?.toLocaleString('es-CO')
                    return Objeto;
                    }
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
    return(
            <button title='Exportar datos a excel' className='btn btn-sm btn-warning' onClick={(e) =>{exportarExcel()}}>
                <i className='bi-bar-chart-line'></i>
            </button>
    )
} 