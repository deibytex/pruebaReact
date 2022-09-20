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
import { Link, useLocation } from 'react-router-dom';
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

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}
// definimos los campos a recibir de las propiedades
type dataprops = {
    id: number;
    tipo: string; nombre: string; src: string | null; hijos: Array<dataprops> | null;

};

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
    tipoArchivo: string;
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
        labelText, tipoArchivo,
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
                        

                        {(tipoArchivo == "archivo") && ( <Formik
                            initialValues={{
                                
                            }}
                            onSubmit={
                                values => {                                    
                                    DescargarArchivo("Raiz/otro/documentoequivalente.pdf");
                                }                              
                            }                       
                        >
                            <Form>                                
                            <Button size='sm' className="" type='submit'> <Download /></Button>  
                            </Form>                           

                        </Formik> )}
                            
                            

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
function getComponetsFromData(props: dataprops) {
    // se definen las constantes que vienen de las propiedades
    const {
        id,
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
        <StyledTreeItem key={`nept_tree_${id.toString()}_${nombre}`} nodeId={id.toString()} labelText={nombre} labelIcon={
            (tipo == "archivo") ? Archive : Folder
        }
            tipoArchivo={tipo}
        >
            {(hijos != null && hijos.length > 0) &&
                hijos.map(
                    function (hijo, idx) {

                        return getComponetsFromData({
                            id: hijo.id,
                            tipo: hijo.tipo,
                            nombre: hijo.nombre,
                            src: hijo.src,
                            hijos: hijo.hijos
                        })
                    }
                )

            }
        </StyledTreeItem>
    );
}

async function cargarArchivo(archivo : any, handleshowFileLoad: ((arg0: boolean) => void) ) {

    const formData = new FormData();
    formData.append("archivo", archivo); 
    formData.append("src", "Raiz/otro");    
    formData.append("nombre", "Yuli");    
    await axios({
        method: 'post',
        url: 'https://apicoretest.azurewebsites.net/api/movil/blobservice',
        data: formData,
        headers: { 'Content-Type' : 'multipart/form-data' }

    }).then( 

        t => {
            console.log(t);
            handleshowFileLoad(false);

            // actualizar la data tree
            // colocar un mensaje de ok
        }
    );
}

// descarga la informacion del nodo del tree view
// debe pasarle la ruta tal cual como se encuentra en el blog storgare no es caseSensitive
async function DescargarArchivo(nombrearchivo :string) {

    const FileDownload = require('js-file-download');
    await axios({
        method: 'get',
        url: 'https://localhost:7211/api/Movil/DownloadFileFromBlob',
        params: { nombrearchivo },
        responseType: 'blob'
    }).then( 

        t => {
            FileDownload(t.data, 'documentoequivalente.pdf');
            console.log(t);

        }
    );

    

}
const data = dataArchivos;
export default function Neptuno() {
    // constantes para filtrar el arbol
    /*const [expanded, setExpanded] = React.useState(["root"]);
    const [selected, setSelected] = React.useState([]);
    const [subjectData, setSubjectData] = React.useState<object>();
    const [selectedSingleItem, setSelectedSingleItem] = React.useState("");*/

    const [showFileLoad, handleshowFileLoad] = useState(true);

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
                                upload: '',
                                nombre: ''
                            }}
                            onSubmit={
                                values => {                                    
                                    cargarArchivo(values.upload, handleshowFileLoad);
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
            <Container>

                <Row>
                    <Col>
                        <Container className='d-flex'>





                            {/* begin::Form group */}
                            <div className="v-row mb-10 fv-plugins-icon-container d-flex flex-row-reverse">

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

                                dataArchivos.map(function (item, indx) {
                                    let nodeid = indx + 25;
                                    return (
                                        <StyledTreeItem key={item.id.toString()} nodeId={nodeid.toString()} labelText={item.nombre} labelIcon={
                                            (item.tipo == "archivo") ? Archive : Folder
                                        }
                                            tipoArchivo={item.tipo}
                                        >
                                            {

                                                item.hijos.map(
                                                    function (hijo, idx) {


                                                        return getComponetsFromData({
                                                            id: hijo.id,
                                                            tipo: hijo.tipo,
                                                            nombre: hijo.nombre,
                                                            src: hijo.src,
                                                            hijos: hijo.hijos
                                                        })


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
            </Container>
        </>
    );
}
function getIDsExpandFilter(filtered: any) {
    throw new Error('Function not implemented.');
}

function uniq(expandedTemp: string[]): React.SetStateAction<string[]> {
    throw new Error('Function not implemented.');
}

