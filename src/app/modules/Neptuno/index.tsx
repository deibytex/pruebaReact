import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import { Folder, Archive } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Col, Container, Row, Modal } from 'react-bootstrap-v5';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { cargarArchivo, DescargarDirectorio } from "./data/dataNeptuno"
import { PageTitle, } from "../../../_start/layout/core";
import { KTSVG, } from '../../../_start/helpers';
import { useEffect, useState } from 'react';
import FormGroupImagen from '../../../_start/helpers/components/FormGroupFileUpload';
import { RootState } from '../../../setup';
import { useSelector } from 'react-redux';
import { UserModelSyscaf } from '../auth/models/UserModel';
import { neptunoDirectory } from './models/neptunoDirectory';
import { StyledTreeItem } from './components/StyledTreeItemProps';


// definimos los campos a recibir de las propiedades
type dataprops = {
    archivoId: number;
    tipo: string;
    nombre: string;
    src: string;
    hijos: Array<dataprops> | null;

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
    const [expanded, setExpanded] = React.useState<string[]>([]);
    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);

    useEffect(() => {
        (async () => {
            let data = await DescargarDirectorio(model.containerneptuno, "");
            handlesdatosNeptuno(data);
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
                            className="bg-transparent "
                            id="kt_mega_menu_modal"
                            aria-hidden="true"
                            tabIndex="-1"
                            //  dialogClassName="modal-fullscreen"
                            contentClassName="shadow-none"
                            show={showFileLoad}
                        >
                            <div className="container rounded-2">
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
                                            carpeta: ''
                                        }}
                                        onSubmit={
                                            values => {

                                                let src = (values.carpeta != "") ? `${srcFileLoad}/` : "";
                                                cargarArchivo(values.upload, handleshowFileLoad, `${src}${values.carpeta}`, model.containerneptuno, handlesdatosNeptuno);
                                            }
                                        }
                                    >
                                        <Form>
                                            <Container>
                                                <div className="form-group">
                                                    <label>Nueva Carpeta: </label>
                                                    <Field
                                                        className="ml-4"
                                                        placeholder=""
                                                        name="carpeta"
                                                        autoComplete="off" type='text'
                                                    />
                                                </div>
                                            </Container>
                                            <Container className="mt-2">
                                                <FormGroupImagen label={'Cargar Archivo:'} campo={'upload'} />
                                                <ErrorMessage name="upload">
                                                    {mensaje =>
                                                        <div className='text-danger' >{mensaje}</div>
                                                    }
                                                </ErrorMessage>
                                                <button type='submit'
                                                    id="nept_search_upload_button"
                                                    className="btn btn-primary -12 mt-2 mb-4">
                                                    <span className="indicator-label">Cargar</span> </button>
                                            </Container>
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
                                                    // descarga el directorio
                                                    let data = await DescargarDirectorio(model.containerneptuno, values.Buscar);
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
                                                    handlessetSrc={handlessrcFileLoad} container={model.containerneptuno}
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
                                                                }, handleshowFileLoad, handlessrcFileLoad, model.containerneptuno)
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


