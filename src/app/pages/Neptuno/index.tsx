import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { AddCircle, Download, Edit, Folder, Archive } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Col, Container, Row, ButtonGroup, Button, ButtonToolbar, Modal } from 'react-bootstrap-v5';
import { ErrorMessage, Form, Formik, FormikHelpers, FormikValues } from "formik";
import { dataArchivos } from "./dataNeptuno"
import {
    PageTitle,
} from "../../../_start/layout/core";
import { KTSVG, toAbsoluteUrl } from '../../../_start/helpers';
import { useEffect, useRef, useState } from 'react';
import { ImageInputComponent, defaultImageInputOptions } from '../../../_start/assets/ts/components/_ImageInputComponent';
import FormGroupImagen from '../../../_start/helpers/components/FormGroupFileUpload';
import axios from 'axios';
import * as Yup from 'yup'
import { filterTree, expandFilteredNodes } from "./filtresTreeNode.js";

import { RootState } from '../../../setup';
import { useSelector } from 'react-redux';
import { UserModelSyscaf } from '../../modules/auth/models/UserModel';
import { Console } from 'console';
import { v4 as uuid } from 'uuid';
import { urlNeptunoDownloadFile, urlNeptunoGetDirectory, urlNeptunoUploadFile } from '../../../apiurlstore';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}



type neptunoDirectory = {
    archivoId: number;
    nombre: string;
    descripcion: string | undefined | null;
    tipo: string;
    src: string;
    peso: number;
    hijos: Array<neptunoDirectory> | null;

};

// definimos los campos a recibir de las propiedades
type dataprops = {    
    tipo: string;
    nombre: string;
    src: string;
    hijos: Array<dataprops> | null;

};


type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
    tipoArchivo: string;
    src: string;
    handleshowFileLoad: ((arg0: boolean) => void);
    handlessetSrc: ((arg0: string) => void);
    container: string;
};



const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));



function StyledTreeItem(props: StyledTreeItemProps) {


    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText, tipoArchivo, src, handleshowFileLoad, handlessetSrc,container,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>

                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="sm-1 " aria-label="First group">
                            {(tipoArchivo == "archivo") && (
                                <Formik
                                    initialValues={{

                                    }}
                                    onSubmit={
                                        values => {
                                            DescargarArchivo(src,container);
                                        }
                                    } >
                                    <Form>
                                        <Button className="btn btn-icon btn-sm fw-bolder" type='submit'> <Download /></Button>
                                    </Form>

                                </Formik>)

                            }{
                                (tipoArchivo == "carpeta") && (<button className='btn btn-icon btn-sm  fw-bolder' onClick={() => { handleshowFileLoad(true); handlessetSrc(src); }}  > <AddCircle /></button>)
                            }
                        </ButtonGroup>
                    </ButtonToolbar>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />

    );
}



// renderiza segun los datos el arbol de información
// este método es recursivo, hay que tener cuidado con realizar cambios 
// para que no quede en un ciclo infinito
function getComponetsFromData(props: dataprops, handleshowFileLoad: ((arg0: boolean) => void), handlessetSrc: ((arg0: string) => void), container : string) {
    // se definen las constantes que vienen de las propiedades
    const {
       
        tipo,
        nombre,
        src,
        hijos
    } = props;

    // si el item que viene tiene hijo, se vuelve a llamar la misma función para imprimir el resto de información 
    // if (hijos != null && hijos.length > 0) {

    // retornamos el item a mostrar en el arbol, le asignamos un key ya que como se imprime dinamicamente
    // el sistema pide asignarle un key único que será tenido en cuenta en el aplicativo
    return (
        <StyledTreeItem key={`nept_tree_${uuid()}_${nombre}`} nodeId={uuid()} labelText={nombre} labelIcon={
            (tipo == "archivo") ? Archive : Folder
        }
            tipoArchivo={tipo} handleshowFileLoad={handleshowFileLoad} src={src} handlessetSrc={handlessetSrc} container = {container}
        >
            {(hijos != null && hijos.length > 0) &&
                hijos.map(
                    function (hijo, idx) {

                        return getComponetsFromData({
                           
                            tipo: hijo.tipo,
                            nombre: hijo.nombre,
                            src: hijo.src,
                            hijos: hijo.hijos
                        }, handleshowFileLoad, handlessetSrc, container)
                    }
                )

            }
        </StyledTreeItem>
    );
}

async function cargarArchivo(archivo: any, handleshowFileLoad: ((arg0: boolean) => void), srcFileLoad: string, contenedor : string, handlesdatosNeptuno: React.Dispatch<React.SetStateAction<neptunoDirectory[]>>) {

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("src",`${srcFileLoad}`);
    formData.append("nombre", "desde el blob");
    formData.append("contenedor", contenedor);
    await axios({
        method: 'post',
        url: urlNeptunoUploadFile,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }

    }).then(

        t => {
            console.log(t);
            handleshowFileLoad(false);
            (async () => {
                handlesdatosNeptuno( await DescargarDirectorio(contenedor));             
    
            })()
         
            // actualizar la data tree
            // colocar un mensaje de ok
        }
    );
}

// descarga la informacion del nodo del tree view
// debe pasarle la ruta tal cual como se encuentra en el blog storgare no es caseSensitive
async function DescargarArchivo(nombrearchivo: string, container : string ) {

    const FileDownload = require('js-file-download');
    await axios({
        method: 'get',
        url: urlNeptunoDownloadFile,
        params: { nombrearchivo, container },
        responseType: 'blob'
    }).then(

        t => {

            const archivo = nombrearchivo?.split("/");

            FileDownload(t.data, archivo[archivo.length - 1]);
            console.log(t);

        }
    );



}
async function DescargarDirectorio(container: string) {

   
    const response = await axios.get(urlNeptunoGetDirectory, { params: { container } });

    return (response.data as Array<neptunoDirectory>);
   
}


export default function Neptuno() {



    // informacion del usuario almacenado en el sistema
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const [isLoaded, setIsLoaded] = useState(false);
    // react hook para mostar o model de carga de archivos
    const [showFileLoad, handleshowFileLoad] = useState(false);

    // para guardar el src de los archivos a mandar al serviodr
    // se debe mandar contenedor asociado al usuario
    const [srcFileLoad, handlessrcFileLoad] = useState("");
    const [datosNeptuno, handlesdatosNeptuno] = useState<neptunoDirectory[]>([]);

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);
   
    useEffect(() => {
        (async () => {
            handlesdatosNeptuno( await DescargarDirectorio(model.containerneptuno));
            setIsLoaded(true);

        })()
    }, []);

    if (model.containerneptuno) {


    
        // constantes para filtrar el arbol
        /*const [expanded, setExpanded] = React.useState(["root"]);
        const [selected, setSelected] = React.useState([]);
        const [subjectData, setSubjectData] = React.useState<object>();
        const [selectedSingleItem, setSelectedSingleItem] = React.useState("");*/




        /* INICIO FUNCIONES PARA FILTRAR */
        /*  const onFilterMouseUp = (e: { target: { value: any; }; }) => {
              const value = e.target.value;
              const filter = value.trim();
              let expandedTemp = expanded;
              if (!filter) {
                setSubjectData(data);
                setExpanded(['root']);
                return;
              }
          
              let filtered = filterTree(data, filter);
              filtered = expandFilteredNodes(filtered, filter);
              if (filtered && filtered.children) {
                expandedTemp = [];
                expandedTemp.push(...getIDsExpandFilter(filtered));
              }
              setExpanded(uniq(expandedTemp));
              setSubjectData(filtered);
            };
          
            const handleToggle = (event: any, nodeIds: string[]) => {
              let expandedTemp = expanded;
              expandedTemp = nodeIds;
              setExpanded(expandedTemp);
            };
          
            const handleSelect = (event: any, nodeIds: React.SetStateAction<never[]> | React.SetStateAction<string>) => {
              setSelected(nodeIds);
              // When false (default) is a string this takes single string.
              if (!Array.isArray(nodeIds)) {
                setSelectedSingleItem(nodeIds);
              }
              // TODO: When `multiSelect` is true this takes an array of strings
            };*/







        return (
            <>
                {isLoaded ? (
                    <>
                        <Modal
                            className="bg-white"
                            id="kt_mega_menu_modal"
                            aria-hidden="true"
                            tabIndex="-1"
                            //  dialogClassName="modal-fullscreen"
                            contentClassName="shadow-none"
                            show={showFileLoad}
                        >


                            <div className="container">
                                <div className="modal-header d-flex align-items-center justify-content-between border-0">
                                    <div className="d-flex align-items-center">
                                        {/* begin::Logo */}
                                        <h3>CARGAR ARCHIVO</h3>
                                        {/* end::Logo */}
                                    </div>

                                    {/* begin::Close */}
                                    <div
                                        className="btn btn-icon btn-sm btn-light-primary ms-2"
                                        onClick={() => handleshowFileLoad(false)}
                                    >
                                        <KTSVG
                                            path="/media/icons/duotone/Navigation/Close.svg"
                                            className="svg-icon-2"
                                        />
                                    </div>
                                    {/* end::Close */}
                                </div>
                                <div>
                                    <Formik
                                        initialValues={{
                                            upload: ''
                                        }}
                                        onSubmit={
                                            values => {
                                                cargarArchivo(values.upload, handleshowFileLoad, srcFileLoad, model.containerneptuno, handlesdatosNeptuno);
                                            }
                                        }
                                    >
                                        <Form>
                                            <FormGroupImagen label={'Cargar Archivo:'} campo={'upload'} />
                                            <ErrorMessage name="upload">
                                                {mensaje =>
                                                    <div className='text-danger' >{mensaje}</div>

                                                }
                                            </ErrorMessage>
                                            <button type='submit'
                                                id="nept_search_upload_button"
                                                className="btn btn-primary -12">
                                                <span className="indicator-label">Cargar</span> </button>

                                        </Form>

                                    </Formik>

                                </div>

                            </div>

                        </Modal>


                        <PageTitle>Neptuno App</PageTitle>
                        

                            <Row>
                                <Col>
                                    <Container className='d-flex'>

                                        {/* begin::Form group */}

                                        <Formik
                                        initialValues={{
                                            Buscar: ''
                                        }}
                                        onSubmit={
                                            values => {
                                                (async () => {
                                                   
                                                  
                                                    
                                        
                                                })()
                                            }
                                        }
                                    >
                                        <Form>
                                                                                       
                                            <div className="v-row mb-10 fv-plugins-icon-container d-flex flex-row-reverse">
                                            <ErrorMessage name="upload">
                                                {mensaje =>
                                                    <div className='text-danger' >{mensaje}</div>

                                                }
                                            </ErrorMessage>
                                            <button
                                                type="submit"
                                                id="nept_search_submit_button"
                                                className="btn btn-primary -12">
                                                <span className="indicator-label">Buscar</span>


                                            </button>
                                            {' '}
                                            <input
                                                placeholder="Buscar"
                                                name="Buscar"
                                                autoComplete="off"
                                            />

                                        </div>

                                        </Form>

                                    </Formik>

                                       



                                    </Container>
                                </Col>


                            </Row>
                            <Row>
                                <Col >

                                    <TreeView
                                        aria-label="gmail"
                                        defaultExpanded={['3']}
                                        defaultCollapseIcon={<ArrowDropDownIcon />}
                                        defaultExpandIcon={<ArrowRightIcon />}
                                        defaultEndIcon={<div style={{ width: 24 }} />}
                                        sx={{ height: 264, flexGrow: 1, overflowY: 'auto' }}
                                    >



                                        {


                        datosNeptuno.map(function (item, indx) {
                                                let nodeid = indx + 25;
                                                return (
                                                    <StyledTreeItem
                                                        key={uuid()}
                                                        nodeId={uuid()}
                                                        labelText={item.nombre}
                                                        labelIcon={
                                                            (item.tipo == "archivo") ? Archive : Folder
                                                        }
                                                        tipoArchivo={item.tipo}
                                                        handleshowFileLoad={handleshowFileLoad}
                                                        src={item.src}
                                                        handlessetSrc={handlessrcFileLoad} container = {model.containerneptuno}
                                                    >


                                                        {
                                                            (item.hijos != null) && item.hijos.map(
                                                                function (hijito, idx) {
                                                                    
                                                                    return getComponetsFromData({                                                                      
                                                                        tipo: hijito.tipo,
                                                                        nombre: hijito.nombre,
                                                                        src: hijito.src ?? "",
                                                                        hijos: hijito.hijos
                                                                    }, handleshowFileLoad, handlessrcFileLoad,model.containerneptuno)


                                                                }
                                                            )
                                                        }

                                                    </StyledTreeItem>
                                                )
                                            })

                                        }


                                    </TreeView>
                                </Col>

                            </Row>
                      
                    </>
                ) : (
                    <> </>
                )}

   {console.log(datosNeptuno,  "data neptuno")}

            </>
        );
    } else
        return <>USTED NO TIENE CONFIGURADO CONTENEDOR PARA MOSTRAR INFORMACION, FAVOR CONSULTE CON SU ADMINISTRADOR</>;
}


