import React, { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { CambiarPasword } from "../redux/AuthCRUD";
import { Notification, useToaster } from "rsuite";
const initialValues = {
    password: "",
    changepassword: "",
};

const ChangePasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Mínimo 6 Símbolos")
        .max(12, "Máximo 12 Símbolos")
        .required("Contraseña es requerida"),
    changepassword: Yup.string()
        .required("Confirmación Contraseña es requierida")
        .when("password", {
            is: (val: string) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Contraseña y Confirmación Contraseña no coinciden"
            ),
        }),
});

export function CambiarPassword() {

    const message = (type: any, titulo: string, mensaje: React.ReactNode) => {
        return (<Notification className="bg-light-danger" type={type} header={titulo} 
        closable duration={10000}>
            {mensaje}
        </Notification>)
    }
    const toaster = useToaster();
    const params: any = useParams();
    let history = useHistory();

    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues,
        validationSchema: ChangePasswordSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            setLoading(true);
         
            setTimeout(() => {
                CambiarPasword(params.token, values.password, params.username)
                    .then(({ data }) => {

                       
                        if (!data.exitoso) {
                            toaster.push(message('error', "Cambiar Contraseña", data.mensaje), {
                                placement: 'topCenter'
                            });
                            
                        }
                        else 
                        toaster.push(message('info', "Cambiar Contraseña", "Cambiada Satisfatoriamente, en unos segundo será redireccionado a la página principal"), {
                            placement: 'topCenter'
                        });


                        if (!data.exitoso && data.mensaje?.includes("Token"))
                            setTimeout(() => {
                                history.push("/auth/forgot-password");
                            }, 3000)

                        if (data.exitoso)
                            setTimeout(() => {
                                history.push("/auth/login");
                            }, 3000)
                        setLoading(false);
                    })
                    .catch(() => {
                       
                        setLoading(false);
                        setSubmitting(false);
                        toaster.push(message('error', "Cambiar Contraseña", "Favor, contacte a su administrador."), {
                            placement: 'topCenter'
                        });
                    });
            }, 1000);
        },
    });

    return (
        <>
            <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="kt_login_password_reset_form"
                onSubmit={formik.handleSubmit}
            >
                <div className="pb-5 pb-lg-10">
                    <h3 className="fw-bolder text-dark display-6">
                        Cambiar Constraseña
                    </h3>
                    <p className="text-muted fw-bold fs-3">
                        Ingrese su nueva contraseña
                    </p>
                </div>

    

                {/* begin::Form group Password */}
                <div className="fv-row mb-5">
                    <label className="form-label fs-6 fw-bolder text-dark pt-5">
                        Constraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="off"
                        {...formik.getFieldProps("password")}
                        className={clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                                "is-invalid": formik.touched.password && formik.errors.password,
                            },
                            {
                                "is-valid": formik.touched.password && !formik.errors.password,
                            }
                        )}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.password}</div>
                        </div>
                    )}
                </div>
                {/* end::Form group */}
                {/* begin::Form group Confirm password */}
                <div className="fv-row mb-10">
                    <label className="form-label fs-6 fw-bolder text-dark pt-5">
                        Confirmar Constraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Confirmar Constraseña"
                        autoComplete="off"
                        {...formik.getFieldProps("changepassword")}
                        className={clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                                "is-invalid":
                                    formik.touched.changepassword && formik.errors.changepassword,
                            },
                            {
                                "is-valid":
                                    formik.touched.changepassword && !formik.errors.changepassword,
                            }
                        )}
                    />
                    {formik.touched.changepassword && formik.errors.changepassword && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.changepassword}</div>
                        </div>
                    )}
                </div>
                {/* end::Form group */}

                {/* begin::Form group */}
                <div className="d-flex flex-wrap pb-lg-0">
                    <button
                        type="submit"
                        id="kt_login_password_reset_form_submit_button"
                        className="btn btn-primary fw-bolder fs-6 px-8 py-4 my-3 me-4"
                    >
                        Cambiar
                    </button>
                    <Link to="/auth/login">
                        <button
                            type="button"
                            id="kt_login_password_reset_form_cancel_button"
                            className="btn btn-light-primary fw-bolder fs-6 px-8 py-4 my-3"
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            Cancelar
                        </button>
                    </Link>{" "}
                    {loading && (
                        <span
                            className="spinner-border text-primary ms-3 mt-6"
                            role="status"
                        >
                            <span className="visually-hidden">enviando...</span>
                        </span>
                    )}
                </div>
                {/* end::Form group */}
            </form>
        </>
    );
}
