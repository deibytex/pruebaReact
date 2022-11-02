/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { useState, useRef, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap-v5";
import { useSelector } from "react-redux";
import internal from "stream";
import { NEP_InsertaArchivo, NEP_UploadFile } from "../../../../apiurlstore";
import { RootState } from "../../../../setup";
import { StepperComponent } from "../../../../_start/assets/ts/components";
import { KTSVG } from "../../../../_start/helpers";
import { UserModelSyscaf } from "../../auth/models/UserModel";
import { configCampoDTO } from "../models/ConfigCampoDTO";
import { defaultNuevoArchivoDTO, NuevoArchivoDTO } from "../models/neptunoDirectory";


type Props = {
    show: boolean;
    handleClose: () => void;
    camposAdicionales: configCampoDTO[];
    AreaId : number;
};

export const CreateFileModal: React.FC<Props> = ({ show, handleClose, camposAdicionales, AreaId }) => {

     // informacion del usuario almacenado en el sistema
     const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);
    
    const stepperRef = useRef<HTMLDivElement | null>(null);
    const stepper = useRef<StepperComponent | null>(null);
    const [data, setData] = useState<NuevoArchivoDTO>(defaultNuevoArchivoDTO);
    const [hasError, setHasError] = useState(false);

    const loadStepper = () => {
        stepper.current = StepperComponent.createInsance(
            stepperRef.current as HTMLDivElement
        );
    };

    const updateData = (fieldsToUpdate: Partial<NuevoArchivoDTO>) => {
        const updatedData = { ...data, ...fieldsToUpdate };     
        setData(updatedData);
    };

    const checkAppBasic = (): boolean => {
        if (!data.NombreArchivo || !data.archivo) {
            return false;
        }
        return true;
    };

    const checkDatosComplementarios = (): boolean => {
        if (!data.DatosAdicionales) {
            return false;
        }

        let flag = true;
        camposAdicionales.forEach((item)=> {
                if(!data.DatosAdicionales[item.campo])
                flag = false;
        } );
        return flag;
    };


    const prevStep = () => {
        if (!stepper.current) {
            return;
        }

        stepper.current.goPrev();
    };

    const nextStep = () => {
        setHasError(false);


        if (!stepper.current) {
            return;
        }
        if (stepper.current.getCurrentStepIndex() === 1) {
            if (!checkAppBasic()) {
                setHasError(true);
                return;
            }
        }
        if (stepper.current.getCurrentStepIndex() === 2) {
            if (!checkDatosComplementarios()) {
                setHasError(true);
                return;
            }
        }

        stepper.current.goNext();
    };

    const navigate = useHistory();

const refreshPage = () => {
    navigate.go(0);
}
    // funcion que consulta y finaliza el trabajo
    const submit = () => {
        // se necesita esta forma para ser pasado al servidor los archivos cargados
        const formData = new FormData();      
        // transformamos el objeto a los parametros que se necesitan pasar al servidor
        data.Orden = 0;
        Object.entries(data).map((element) => {
            formData.append(element[0], (element[0] === "DatosAdicionales") ? JSON.stringify(element[1]) :  element[1]);           
        });  
        
        formData.append('UsuarioId', model.Id);    
        formData.append('AreaId', `${AreaId}`);     
        
         axios({
            method: 'post',
            url: NEP_InsertaArchivo,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            params: {contenedor: model.containerneptuno}
        }).then(
            t => {            
                refreshPage();
            }
        );
     
       
    };

    return (
        <Modal
            id="kt_modal_create_app"
            tabIndex={-1}
            aria-hidden="true"
            dialogClassName="modal-dialog-centered mw-1000px h-auto"
            show={show}
            onHide={handleClose}
            onEntered={loadStepper}
        >
            <div className="container px-10 py-10">
                <div className="modal-header py-2 d-flex justify-content-end border-0">
                    {/* begin::Close */}
                    <div
                        className="btn btn-icon btn-sm btn-light-primary"
                        onClick={handleClose}
                    >
                        <KTSVG
                            className="svg-icon-2"
                            path="/media/icons/duotone/Navigation/Close.svg"
                        />
                    </div>
                    {/* end::Close */}
                </div>

                <div className="modal-body">
                    {/*begin::Stepper */}
                    <div
                        ref={stepperRef}
                        className="stepper stepper-1 d-flex flex-column flex-xl-row flex-row-fluid"
                        id="kt_modal_create_app_stepper"
                    >
                        {/*begin::Aside */}
                        <div className="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
                            {/*begin::Nav */}
                            <div className="stepper-nav d-flex flex-column pt-5">
                                {/*begin::Step 1 */}
                                <div
                                    className="stepper-item current"
                                    data-kt-stepper-element="nav"
                                >
                                    <div className="stepper-wrapper">
                                        <div className="stepper-icon">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">1</span>
                                        </div>
                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Datos Básicos</h3>
                                            <div className="stepper-desc">Escoja su archivo</div>
                                        </div>
                                    </div>
                                </div>
                                {/*end::Step 1 */}

                                {/*begin::Step 2 */}
                                <div className="stepper-item" data-kt-stepper-element="nav">
                                    <div className="stepper-wrapper">
                                        <div className="stepper-icon">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">2</span>
                                        </div>
                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Datos Complementarios</h3>
                                            <div className="stepper-desc">
                                                Propiedades extendidas del archivo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*end::Step 2 */}


                                {/*begin::Step 3 */}
                                <div className="stepper-item" data-kt-stepper-element="nav">
                                    <div className="stepper-wrapper">
                                        <div className="stepper-icon">
                                            <i className="stepper-check fas fa-check"></i>
                                            <span className="stepper-number">3</span>
                                        </div>
                                        <div className="stepper-label">
                                            <h3 className="stepper-title">Completar!</h3>
                                            <div className="stepper-desc">Revisión y envío</div>
                                        </div>
                                    </div>
                                </div>
                                {/*end::Step 3 */}
                            </div>
                            {/*end::Nav */}
                        </div>
                        {/*begin::Aside */}

                        {/*begin::Content */}
                        <div className="d-flex flex-row-fluid justify-content-center">
                            {/*begin::Form */}
                            <form
                                className="pb-5 w-100 w-md-400px w-xl-500px"
                                noValidate
                                id="kt_modal_create_app_form"
                            >
                                {/*begin::Step 1 */}
                                <div className="pb-5 current" data-kt-stepper-element="content">
                                    <div className="w-100">
                                        {/*begin::Heading */}
                                        <div className="pb-5 pb-lg-10">
                                            <h3 className="fw-bolder text-dark display-6">
                                                Datos Básicos
                                            </h3>
                                        </div>
                                        {/*begin::Heading */}

                                           {/*begin::Form Group */}
                                           <div className="fv-row mb-12">
                                            <label className="fs-6 fw-bolder text-dark form-label">
                                                Archivo
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control form-control-lg form-control-solid"
                                                name="file"
                                                placeholder=""                                               
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if( (e.target.files != null))
                                                    updateData({
                                                        archivo:  e.target.files[0] ,
                                                        Src:  e.target.files[0].name ,
                                                        Peso:  e.target.files[0].size ,
                                                        NombreArchivo :  e.target.files[0].name,
                                                        Tipo : e.target.files[0].type,
                                                    });
                                                }
                                                }
                                            />

                                            {!data.archivo && hasError && (
                                                <div className="fv-plugins-message-container">
                                                    <div
                                                        data-field="appname"
                                                        data-validator="notEmpty"
                                                        className="fv-help-block"
                                                    >
                                                        Debe seleccionar un archivo
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/*end::Form Group */}

                                        {/*begin::Form Group */}
                                        <div className="fv-row mb-12">
                                            <label className="fs-6 fw-bolder text-dark form-label">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg form-control-solid"
                                                name="appname"
                                                placeholder=""
                                                value={data.NombreArchivo}
                                                onChange={(e) =>
                                                    updateData({
                                                        NombreArchivo: e.target.value
                                                    })
                                                }
                                            />
                                            {!data.NombreArchivo && hasError && (
                                                <div className="fv-plugins-message-container">
                                                    <div
                                                        data-field="appname"
                                                        data-validator="notEmpty"
                                                        className="fv-help-block"
                                                    >
                                                        Nombre es requerido
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/*end::Form Group */}
                                        {/*begin::Form Group */}
                                        <div className="fv-row mb-12">
                                            <label className="fs-6 fw-bolder text-dark form-label">
                                                Descripción
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg form-control-solid"
                                                name="appname"
                                                placeholder=""
                                                value={data.Descripcion}
                                                onChange={(e) =>
                                                    updateData({
                                                        Descripcion: e.target.value
                                                    })
                                                }
                                            />


                                        </div>
                                        {/*end::Form Group */}

                                     


                                    </div>
                                </div>
                                {/*end::Step 1 */}

                                {/*begin::Step 2 */}
                                <div className="pb-5" data-kt-stepper-element="content">
                                    <div className="w-100">
                                        {/*begin::Heading */}
                                        <div className="pb-10 pb-lg-15">
                                            <h4 className="fw-bolder text-dark display-6">
                                                Datos Adicionales
                                            </h4>
                                        </div>
                                        {/*end::Heading */}

                                        {

                                            camposAdicionales.map((campos) => {
                                                return (<div className="fv-row mb-12">
                                                    <label className="fs-6 fw-bolder text-dark form-label">
                                                        {campos.label}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg form-control-solid"
                                                        name={`camposadicionales_${campos.campo}`}
                                                        placeholder=""
                                                        value={data.DatosAdicionales[campos.campo]}
                                                        onChange={(e) => {
                                                            let datosAdicionales  = data.DatosAdicionales;
                                                            datosAdicionales[campos.campo] = e.target.value;
                                                            updateData({
                                                                DatosAdicionales: datosAdicionales
                                                            });
                                                        }
                                                        }
                                                    />

                                                {!data.DatosAdicionales[campos.campo] && hasError && (
                                                <div className="fv-plugins-message-container">
                                                    <div
                                                        data-field="appname"
                                                        data-validator="notEmpty"
                                                        className="fv-help-block"
                                                    >
                                                         {campos.label} es requerido
                                                    </div>
                                                </div>
                                            )}
                                                </div>)

                                            })
                                        }


                                    </div>
                                </div>
                                {/*end::Step 2 */}





                                {/*begin::Step 5 */}
                                <div className="pb-5" data-kt-stepper-element="content">
                                    <div className="w-100">
                                        {/* begin::Heading */}
                                        <div className="pb-10 pb-lg-15">
                                            <h3 className="fw-bolder text-dark display-6">
                                                Completado
                                            </h3>
                                            <div className="text-muted fw-bold fs-3">
                                                Revise sus datos antes de guardar.
                                            </div>
                                        </div>
                                        {/* end::Heading */}

                                        {/* begin::Section */}
                                        <h4 className="fw-bolder mb-3">Nombre</h4>
                                        <div className="text-gray-600 fw-bold lh-lg mb-8">
                                            <div>{data.NombreArchivo}</div>
                                        </div>
                                        {/* end::Section */}

                                        {/* begin::Section */}
                                        <h4 className="fw-bolder mb-3">Descripcion</h4>
                                        <div className="text-gray-600 fw-bold lh-lg mb-8">
                                            <div>{data.Descripcion}</div>
                                        </div>
                                        {/* end::Section */}
                                        {
                                                 camposAdicionales.map((campos) => {
                                                    return (
                                                    <>
                                                    <div  key={`complete_${campos.campo}`}>
                                                        <h4 className="fw-bolder mb-3">{campos.label}</h4>
                                                        <div className="text-gray-600 fw-bold lh-lg mb-8">
                                                            <div>{data.DatosAdicionales[campos.campo]}</div>
                                                        </div>
                                                        </div>
                                                        </>
                                                  )
    
                                                })
                                        }
                                    </div>
                                </div>
                                {/*end::Step 5 */}

                                {/*begin::Actions */}
                                <div className="d-flex justify-content-between pt-10">
                                    <div className="mr-2">
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-light-primary fw-bolder py-4 pe-8 me-3"
                                            data-kt-stepper-action="previous"
                                            onClick={prevStep}
                                        >
                                            <KTSVG
                                                path="/media/icons/duotone/Navigation/Left-2.svg"
                                                className="svg-icon-3 me-1"
                                            />{" "}
                                            Anterior
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-primary fw-bolder py-4 ps-8 me-3"
                                            data-kt-stepper-action="submit"
                                            onClick={submit}
                                        >
                                            Submit{" "}
                                            <KTSVG
                                                path="/media/icons/duotone/Navigation/Right-2.svg"
                                                className="svg-icon-3 ms-2"
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-lg btn-primary fw-bolder py-4 ps-8 me-3"
                                            data-kt-stepper-action="next"
                                            onClick={nextStep}
                                        >
                                            Siguiente{" "}
                                            <KTSVG
                                                path="/media/icons/duotone/Navigation/Right-2.svg"
                                                className="svg-icon-3 ms-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                                {/*end::Actions */}
                            </form>
                            {/*end::Form */}
                        </div>
                        {/*end::Content */}
                    </div>
                    {/* end::Stepper */}
                </div>
            </div>
        </Modal>
    );
};

