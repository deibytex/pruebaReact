import { Container, Modal } from "react-bootstrap-v5";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { KTSVG } from "../../../../_start/helpers";
import { cargarArchivo } from "../data/dataNeptuno";
import FormGroupImagen from "../../../../_start/helpers/components/FormGroupFileUpload";
type modalProps = {
 handleshowFileLoad: ((arg0: boolean) => void);
 showFileLoad : boolean;
 srcFileLoad : string;
 contenedor: string;
 handlesdatosNeptuno: React.Dispatch<React.SetStateAction<any[]>>;
}
export const  ModalAddFile: React.FC<modalProps> = ({showFileLoad, handleshowFileLoad, srcFileLoad, contenedor, handlesdatosNeptuno}) =>{


return (<> <Modal
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
                        cargarArchivo(values.upload, handleshowFileLoad, `${src}${values.carpeta}`, contenedor, handlesdatosNeptuno);
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
</Modal></>)
    
}

