import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import { Folder, Archive } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Col, Container, Row, Modal } from 'react-bootstrap-v5';
import { ErrorMessage, Field, Form, Formik } from "formik";
import {  DescargarDirectorio } from "../data/dataNeptuno"
import { PageTitle, } from "../../../../_start/layout/core";
import { useEffect, useState } from 'react';
import { neptunoDirectory } from '../models/neptunoDirectory';
import { StyledTreeItem } from './StyledTreeItemPropsTree';
import { ModalAddFile } from './AddFileModalTree';


// definimos los campos a recibir de las propiedades
type dataprops = {
    archivoId: number;
    tipo: string;
    nombre: string;
    src: string;
    hijos: Array<dataprops> | null;

};

type parametros = {
    contenedor: string;
};

// renderiza segun los datos el arbol de información
// este método es recursivo, hay que tener cuidado con realizar cambios 
// para que no quede en un ciclo infinito
function getComponetsFromData(props: dataprops, handleshowFileLoad: ((arg0: boolean) => void), handlessetSrc: ((arg0: string) => void), container: string) {
    // se definen las constantes que vienen de las propiedades
    const {
        archivoId,
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
        <StyledTreeItem key={`nept_tree_${archivoId.toString()}`} nodeId={archivoId.toString()} labelText={nombre} labelIcon={
            (tipo == "archivo") ? Archive : Folder
        }
            tipoArchivo={tipo} handleshowFileLoad={handleshowFileLoad} src={src} handlessetSrc={handlessetSrc} container={container}
        >
            {(hijos != null && hijos.length > 0) &&
                hijos.map(
                    function (hijo, idx) {

                        return getComponetsFromData({
                            archivoId: hijo.archivoId,
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


 const NeptunoTree : React.FC<parametros> = ({contenedor}) => {
   
    const [isLoaded, setIsLoaded] = useState(false);
    // react hook para mostar o model de carga de archivos
    const [showFileLoad, handleshowFileLoad] = useState(false);
    // para guardar el src de los archivos a mandar al serviodr
    // se debe mandar contenedor asociado al usuario
    const [srcFileLoad, handlessrcFileLoad] = useState("");
    const [datosNeptuno, handlesdatosNeptuno] = useState<neptunoDirectory[]>([]);
 


    useEffect(() => {
        (async () => {        
            let data = await DescargarDirectorio(contenedor, "");
            handlesdatosNeptuno(data);
            setIsLoaded(true);
            
        })()
    }, []);

    if (contenedor) {
     
        return (
            <>
                {isLoaded ? (
                    <>
                        <ModalAddFile handleshowFileLoad={handleshowFileLoad} 
                        showFileLoad={showFileLoad} 
                        srcFileLoad={srcFileLoad} 
                        contenedor={contenedor} handlesdatosNeptuno={handlesdatosNeptuno}/>
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
                                                    // descarga el directorio
                                                    let data = await DescargarDirectorio(contenedor, values.Buscar);
                                                    handlesdatosNeptuno(data);
                                                })()
                                            }
                                        }
                                    >
                                        {() => (                                            <Form>

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
                                                    <Field
                                                        placeholder="Buscar"
                                                        name="Buscar"
                                                        autoComplete="off" type='text'
                                                    />

                                                </div>

                                            </Form>
                                        )}
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
                                >
                                    {
                                        datosNeptuno.map(function (item) {
                                            return (
                                                <StyledTreeItem
                                                    key={`${item.nombre}_${item.archivoId.toString()}`}
                                                    nodeId={item.archivoId.toString()}
                                                    labelText={item.nombre}
                                                    labelIcon={
                                                        (item.tipo == "archivo") ? Archive : Folder
                                                    }
                                                    tipoArchivo={item.tipo}
                                                    handleshowFileLoad={handleshowFileLoad}
                                                    src={item.src}
                                                    handlessetSrc={handlessrcFileLoad} container={contenedor}
                                                >
                                                    {
                                                        (item.hijos != null) && item.hijos.map(
                                                            function (hijito) {

                                                                return getComponetsFromData({
                                                                    archivoId: hijito.archivoId,
                                                                    tipo: hijito.tipo,
                                                                    nombre: hijito.nombre,
                                                                    src: hijito.src ?? "",
                                                                    hijos: hijito.hijos
                                                                }, handleshowFileLoad, handlessrcFileLoad, contenedor)
                                                            }
                                                        )
                                                    }

                                                </StyledTreeItem>
                                            )
                                        })
                                    }
                                </TreeView>
                            </Col>                        </Row>

                    </>
                ) : (
                    <> </>
                )}
            </>
        );
    } else
        return <>USTED NO TIENE CONFIGURADO CONTENEDOR PARA MOSTRAR INFORMACION, FAVOR CONSULTE CON SU ADMINISTRADOR</>;
}


export {NeptunoTree }