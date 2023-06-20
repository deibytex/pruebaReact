import { Container, Modal } from "react-bootstrap-v5";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { KTSVG } from "../../../../_start/helpers";
import { cargarArchivo } from "../data/dataNeptuno";
import FormGroupImagen from "../../../../_start/helpers/components/FormGroupFileUpload";
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { UserModelSyscaf } from "../../auth/models/UserModel";
type modalProps = {
 handleshowFileLoad: ((arg0: boolean) => void);
 showFileLoad : boolean;
 srcFileLoad : string;
 contenedor: string;
 handlesdatosNeptuno: React.Dispatch<React.SetStateAction<any[]>>;
}
export const  ModalAddFile: React.FC<modalProps> = ({showFileLoad, handleshowFileLoad, srcFileLoad, contenedor, handlesdatosNeptuno}) =>{

   // informacion del usuario almacenado en el sistema
   const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
);

// convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
const model = (isAuthorized as UserModelSyscaf);
return (<> <Modal
    className="bg-transparent "
    id="kt_mega_menu_modal"
    aria-hidden="true"
    tabIndex="-1"
    //  dialogClassName="modal-fullscreen"
    contentClassName="shadow-none"
    show={showFileLoad}
>
    <div className="container rounded">
        <div className=" d-flex align-items-center justify-content-between border-0 text-primary mt-4 mb-4 rounded  bg-secondary">
            <div className="d-flex align-items-center ">
                {/* begin::Logo */}
                <h3 className="m-4">Cargar Archivo</h3>
                {/* end::Logo */}
            </div>

            {/* begin::Close */}
            <div
                className="btn btn-icon btn-sm btn-primary ms-2"
                onClick={() => handleshowFileLoad(false)}
            >
                <KTSVG
                    path="/media/icons/duotone/Navigation/Close.svg"
                    className="svg-icon-2"
                />
            </div>
            {/* end::Close */}
        </div>
        <div className="bg-secondary rounded">
            <Formik
                initialValues={{
                    upload: '',
                    carpeta: '', Extension : '', Tipo : '', Peso :0, NombreArchivo: ''
                }}
                onSubmit={
                    values => {

                        let src =  `${srcFileLoad}${(values.carpeta != "") ? `/${values.carpeta}` : ""}/${values.NombreArchivo}`;                     
                        cargarArchivo(values.upload, handleshowFileLoad, src, contenedor, handlesdatosNeptuno, model.Id, 
                            values.Extension, values.Tipo, `${values.Peso }`);
                    }
                }
            >
                <Form>
                    <div className=" m-4 mt-0 row text-primary ">
                        
                        <div className="row col-xs-12 col-md-12 col-lg-12 mt-2">
                            <label className="col-xs-4 col-sm-4 col-lg-4">Nueva Carpeta: </label>
                            <Field
                                className="col-xs-8 col-sm-8 col-lg-8 border-0 shadow-sm "
                                placeholder=""
                                name="carpeta"
                                autoComplete="off" type='text'
                            />
                        </div>

                        <div className="row col-xs-12 col-md-12 col-lg-12 mt-2">
                        <FormGroupImagen label={'Archivo:'} campo={'upload'}  />
                        </div>
                        <div className="row col-xs-12 col-md-12 col-lg-12 mt-2">
                        <ErrorMessage name="upload">
                            {mensaje =>
                                <div className='text-danger' >{mensaje}</div>
                            }
                        </ErrorMessage>
                        </div>
                        <div className="row col-xs-12 col-md-12 col-lg-12 align-right mt-2 mb-2 d-flex flex-row-reverse">
                        <button type='submit'
                            id="nept_search_upload_button"
                            className="btn btn-primary col-md-4 ">
                            <span className="indicator-label">Cargar</span> </button>
                        </div>
                    </div>
                    </Form>
                
                                                    </Formik>

        </div>
    </div>
</Modal></>)
    
}

