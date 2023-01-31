import  FileSaver from 'file-saver';
import { Tooltip } from 'react-bootstrap-v5';
import XLSX from 'sheetjs-style';
import { errorDialog } from '../../../../../_start/helpers/components/ConfirmDialog';
import { LogDTO } from '../../models/logModel';
type Props ={
    DatosExel: LogDTO[],
    NombreArchivo: string

}
export const ExportarExcel : React.FC<Props>= ({DatosExel,NombreArchivo}) =>{
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;carset=UTF-8';
    const fileExtension = '.XLSX';
    const exportarExcel = async() =>{
        if(DatosExel.length >0){
            let finaldata = DatosExel.map((item) =>{
                if(item.EstadoArchivo == false)
                    item.EstadoArchivo = "Inactivo"
                else
                    item.EstadoArchivo = "Activo"
                
                    return item;
            })
    
            const ws = XLSX.utils.json_to_sheet(finaldata);
            const wb = { Sheets: { 'data' :ws }, SheetNames:['data']};
            const excelBuffer = XLSX.write(wb,{ bookType:'xlsx', type: 'array'});
            const data = new Blob([excelBuffer],{type: fileType});
            FileSaver(data,NombreArchivo + fileExtension);
        }else{
            errorDialog("No hay datos que exportar","");
        }
    }
    return(
            <button title='Exportar datos a excel' className='btn btn-sm btn-success' onClick={(e) =>{exportarExcel()}}>
                <i className='bi-file-excel'></i>
            </button>
    )
} 