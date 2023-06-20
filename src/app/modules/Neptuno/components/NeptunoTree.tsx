import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import { Folder, Archive, FileOpenRounded } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Col, Container, Row, Modal, Button } from 'react-bootstrap-v5';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { DescargarDirectorio, DescargarFile, DescargarFileBase64 } from "../data/dataNeptuno"
import { PageTitle, } from "../../../../_start/layout/core";
import { useEffect, useState } from 'react';
import { neptunoDirectory } from '../models/neptunoDirectory';
import { StyledTreeItem } from './StyledTreeItemPropsTree';
import { ModalAddFile } from './AddFileModalTree';
import BlockUi from 'react-block-ui';
import { useDataNeptuno } from '../core/NeptunoProvider';


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
function getComponetsFromData(item: neptunoDirectory, handleshowFileLoad: ((arg0: boolean) => void), handlessetSrc: ((arg0: string) => void), container: string,
    ShowDocumentPdf: ((arg0: neptunoDirectory, arg1: string) => void),
    handlesdatosNeptuno : ((arg0: neptunoDirectory[]) => void)
) {


    // si el item que viene tiene hijo, se vuelve a llamar la misma función para imprimir el resto de información 
    // if (hijos != null && hijos.length > 0) {

    // retornamos el item a mostrar en el arbol, le asignamos un key ya que como se imprime dinamicamente
    // el sistema pide asignarle un key único que será tenido en cuenta en el aplicativo
    return (
        <StyledTreeItem className='ms-3' key={`nept_tree_${item.archivoId.toString()}`} nodeId={item.archivoId.toString()}
            labelIcon={(item.tipo == "archivo") ? FileOpenRounded : Folder}
            handleshowFileLoad={handleshowFileLoad} handlessetSrc={handlessetSrc} container={container}
            ShowDocumentPdf={ShowDocumentPdf} item={item} 
            handlesdatosNeptuno={handlesdatosNeptuno}       >
            {(item.hijos != null && item.hijos.length > 0) &&
                item.hijos.map(
                    function (hijo, idx) {
                        return getComponetsFromData(
                            hijo
                            , handleshowFileLoad, handlessetSrc, container, ShowDocumentPdf,handlesdatosNeptuno)
                    }
                )

            }
        </StyledTreeItem>
    );
}


const NeptunoTree: React.FC<parametros> = ({ contenedor }) => {


     const {loader, setLoader, EsModificado} = useDataNeptuno();
   
    // react hook para mostar o model de carga de archivos
    const [showFileLoad, handleshowFileLoad] = useState(false);
    // para guardar el src de los archivos a mandar al serviodr
    // se debe mandar contenedor asociado al usuario
    const [srcFileLoad, handlessrcFileLoad] = useState("");
    const [datosNeptuno, handlesdatosNeptuno] = useState<neptunoDirectory[]>([]);



    useEffect(() => {

        (async () => {
            console.log(EsModificado)
            setLoader(true)
            handlesdatosNeptuno(await DescargarDirectorio(contenedor, ""));
            setLoader(false);

        })()
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [dataFile, setdataFile] = useState<any>(null);
    const [documento, setDocumento] = useState<any>(null);
    const [tipodocumento, setTipoDocumento] = useState<any>(null);



    function ShowDocumentPdf(item: neptunoDirectory, container: string) {
        setLoader(true)
        DescargarFileBase64(item.src, container).then(
            t => {
                setTipoDocumento(item.contentType)
                setShowModal(true)
                setDocumento(item.nombre)
                setdataFile(t.data.toString())
                setLoader(false)
            }
        ).catch((c) => {

        });;


    }

    if (contenedor) {

        return (
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div className="card card-rounded bg-transparent " style={{ width: '100%' }}  >

                    <div className="d-flex justify-content-between mb-2">
                        <div className="mx-auto">
                            <div className="ms-3 text-center">
                                <h3 className="mb-0">Neptuno App</h3>

                            </div>
                        </div>
                    </div>
                    <ModalAddFile handleshowFileLoad={handleshowFileLoad}
                        showFileLoad={showFileLoad}
                        srcFileLoad={srcFileLoad}
                        contenedor={contenedor} handlesdatosNeptuno={handlesdatosNeptuno} />
                    <PageTitle>Neptuno App</PageTitle>
                    <Row className="rounded shadow-sm mt-2 bg-secondary  text-primary">
                        <Col className='mt-2'>

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
                                {() => (<Form>

                                    <div className="row">
                                        <ErrorMessage name="upload" className='col-sm-12 col-md-12 col-xs-12'>
                                            {mensaje =>
                                                <div className='text-danger' >{mensaje}</div>
                                            }
                                        </ErrorMessage>
                                        <div className="row col-sm-4 col-md-4 col-xs-4" >
                                            <Field
                                                className="ms-4 mb-2 col-sm-8 col-md-8 col-xs-8 border-0 rounded"
                                                placeholder="Buscar archivo"
                                                name="Buscar"
                                                autoComplete="off" type='text'
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            id="nept_search_submit_button"
                                            className="btn btn-primary mb-2 col-sm-2 col-md-2 col-xs-2">
                                            <span className="indicator-label">Buscar</span>
                                        </button>


                                    </div>

                                </Form>
                                )}
                            </Formik>

                        </Col>
                    </Row>
                    <Row className="rounded shadow-sm mt-2 bg-secondary  text-primary">
                        <Col >
                            {
                                datosNeptuno.length > 0 && (
                                    <TreeView
                                        aria-label="gmail"
                                        defaultExpanded={[datosNeptuno[0].archivoId.toString() ]}
                                        defaultCollapseIcon={<ArrowDropDownIcon />}
                                        defaultExpandIcon={<ArrowRightIcon />}
                                        defaultEndIcon={<div style={{ width: 24 }} />}
                                    >
                                        {
                                            datosNeptuno.map(function (item) {
                                                return (
                                                    <StyledTreeItem
                                                        bgColor={(item.tipo == "archivo") ? "bg-primary" : "bg-secondary"}
                                                        key={`${item.nombre}_${item.archivoId.toString()}`}
                                                        nodeId={item.archivoId.toString()}
                                                        item={item}
                                                        labelIcon={(item.tipo == "archivo") ? FileOpenRounded : Folder}
                                                        handleshowFileLoad={handleshowFileLoad}
                                                        handlessetSrc={handlessrcFileLoad} container={contenedor}
                                                        ShowDocumentPdf={ShowDocumentPdf} 
                                                        handlesdatosNeptuno={handlesdatosNeptuno}                                            >
                                                        {
                                                            (item.hijos != null) && item.hijos.map(
                                                                function (hijito) {
                                                                    return getComponetsFromData(hijito, handleshowFileLoad, handlessrcFileLoad, contenedor, ShowDocumentPdf,handlesdatosNeptuno)
                                                                }
                                                            )
                                                        }

                                                    </StyledTreeItem>
                                                )
                                            })
                                        }
                                    </TreeView>
                                )
                            }

                        </Col>                        </Row>



                </div>

                {
                    showModal && (

                        <Modal show={showModal} onHide={setShowModal} size="xl">
                            <Modal.Header closeButton>
                                <Modal.Title> {documento}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <embed src={`data:${tipodocumento};base64,${dataFile}`} type={tipodocumento} width="100%" height={700}></embed>

                            </Modal.Body>
                            <Modal.Footer>

                                <Button type="button" variant="primary" onClick={() => { setShowModal(false); }}>
                                    Cerrar
                                </Button>
                            </Modal.Footer>
                        </Modal>)}
            </BlockUi>
        );
    } else
        return <>USTED NO TIENE CONFIGURADO CONTENEDOR PARA MOSTRAR INFORMACIÓN, FAVOR CONSULTE CON SU ADMINISTRADOR</>;





}


export { NeptunoTree }