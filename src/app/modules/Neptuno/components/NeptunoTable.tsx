import { Delete, Download, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap-v5";
import InputGroupButton from "rsuite/esm/InputGroup/InputGroupButton";
import { NEP_ConsutlaListado, NEP_EditarArchivo, NEP_InsertaArchivo } from "../../../../apiurlstore";
import IndiceEntidad from "../../../../_start/helpers/components/IndiceGeneral";
import { GetInformacionCuenta, GetArchivosPorCuenta, DescargarArchivo } from "../data/dataNeptuno";
import { AreaDTO, configCampoDTO } from "../models/ConfigCampoDTO";
import { ArchivoDTO } from "../models/neptunoDirectory";
import Moment from 'moment';
import { CreateFileModal } from "./CreateModalTable";


type Params = {
    contenedor: string;
}

const NeptunoTable: React.FC<Params> = ({ contenedor }) => {
    // contiene la informacion de la cuenta, con los campos a utilziar  
    const [configArea, SetConfigArea] = useState<AreaDTO[]>([]);
    const [camposHeader, SetcamposHeader] = useState<configCampoDTO[]>([]);

    useEffect(() => {
        (async () => {

            // traemos la informacion de la cuenta, que campos se van a mostrar
            GetInformacionCuenta(contenedor).then(({ data }) => {
                console.log(data)
                SetConfigArea(data);
                if (data[0].CamposCapturar != null) {
                    // deserializamos el objeto para poder saber los campos que estan en la cabecera    
                    let campos = JSON.parse(data[0].CamposCapturar) as configCampoDTO[];
                    SetcamposHeader(campos);
                }

            }).catch((error) => {
                console.log(error);

            });

        })()
    }, []);

    // react hook para mostar o model de carga de archivos
    const [showFileLoad, handleshowFileLoad] = useState(false);



    return (
        <>

            {/*Verificamos que la cabecera de los campos tenga datos*/}
            {(camposHeader.length > 0) && (

                <>
                    <CreateFileModal show={showFileLoad}
                        handleClose={() => handleshowFileLoad(false)} camposAdicionales={camposHeader} AreaId={configArea[0].AreaId} />

                    <IndiceEntidad<ArchivoDTO>
                        url={NEP_ConsutlaListado} urlCrear="nuevo" titulo="Nuevo"
                        nombreEntidad="Archivo" customRequest={GetArchivosPorCuenta(contenedor)} custonAddButton={handleshowFileLoad} >
                        {(archivos, botones) => <>
                            <thead>
                                <tr>

                                    <th></th>
                                    <th>Archivo</th>
                                    {
                                        camposHeader?.map(item => {

                                            return (<th>{item.label}</th>)
                                        })

                                    }
                                    <th>Usuario Creación</th>
                                    <th>Fecha Creación</th>
                                    <th>Usuario Act</th>
                                    <th>Fecha Act</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archivos?.map(archivo =>

                                    <tr key={`row_${archivo.Archivoid}`}>

                                        <td>
                                        <InputGroupButton key={`inputgroup_${archivo.Archivoid}`} className="boder-0">
                                                <Button className="btn btn-secondary btn-icon btn-sm fw-bolder"> <Edit /></Button>
                                                <Button className="btn btn-danger btn-icon btn-sm fw-bolder"> <Delete /></Button>
                                            </InputGroupButton>
                                        </td>
                                        <td className="text-truncate">
                                            <Button key={`btndescargar${archivo.Archivoid}`} className="btn btn-primary btn-sm fw-bolder" onClick={() => {

                                                DescargarArchivo(archivo.Src, contenedor);
                                            }}  > <Download />{archivo.Nombre}</Button>

                                        </td>
                                        {
                                            camposHeader?.map(item => {
                                                return (<td>{JSON.parse(archivo.DatosAdicionales)[item.campo]}</td>)
                                            })

                                        }
                                        <td>
                                            {archivo.UsuarioActualizacion}
                                        </td>
                                        <td>
                                        {Moment(archivo.FechaSistema).format('DD/MM/YYYY HH:mm:ss')}
                                           
                                        </td>
                                        <td>
                                            {archivo.UsuarioActualizacion}
                                        </td>
                                        <td>
                                            {archivo.UltFechaActualizacion}
                                        </td>
                                    </tr>)}
                            </tbody>
                        </>}

                    </IndiceEntidad>
                </>
            )}
        </>
    )

}

export { NeptunoTable }

