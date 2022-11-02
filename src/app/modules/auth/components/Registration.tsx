/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import * as auth from "../redux/AuthRedux";
import { register } from "../redux/AuthCRUD";
import { Link, Redirect } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap-v5";
import {  CommonAlertProvider, useCommonAlert } from "../../../../_start/helpers/components/Alert";

import { AlertModal } from "../../../../_start/helpers/Models/AlertModel";
import { PageTitle } from "../../../../_start/layout/core";

const options = [
  { tipoid: "1", label: 'EMPLEADO' },
  { tipoid: "2", label: 'CLIENTE' },
  { tipoid: "3", label: 'ADMIN FLOTA' },
  { tipoid: "4", label: 'SUPER ADMIN' }
];


const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
  tipoclienteid: -1
};

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, "Mínimo 3 Símbolos")
    .max(50, "Máximo 50 Símbolos")
    .required("Primer Nombre es requerido"),
  email: Yup.string()
    .email("Error formato email")
    .min(3, "Mínimo 3 Símbolos")
    .max(50, "Máximo 50 Símbolos")
    .required("Email es requerido"),
  lastname: Yup.string()
    .min(3, "Mínimo 3 Símbolos")
    .max(50, "Máximo 50 Símbolos")
    .required("Last name es requerido"),
  password: Yup.string()
    .min(3, "Mínimo 3 Símbolos")
    .max(50, "Máximo 50 Símbolos")
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
  acceptTerms: Yup.bool().required("Debes Aceptar los terminos y condiciones"),
});

export function Registration() {
  return <CommonAlertProvider>
    <RegistrationComponent />
  </CommonAlertProvider>
}



const RegistrationComponent: React.FC = () => {
  const handleClose = () => { console.log("evento a manejar cuando se use"); } 
  const [loading, setLoading] = useState(false);
  const { setError } = useCommonAlert();
  //AlertModel
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setTimeout(() => {       
        register(
          values.email,
          values.firstname,
          values.lastname,
          values.password,
           values.tipoclienteid
        )
          .then(({ data }) => {
            setLoading(false);
            if(data.Exitoso){
              setError({ variant: "success", showDefault: true, Title: "Registro Usuario", Text: "Usuario Registrado Exitosamente." })
              resetForm();
            }
           
          })
          .catch(() => {
            setLoading(false);
            setSubmitting(false);
            setStatus("Error al registrar usuario");
             setError({ variant: "danger", showDefault: true, Title: "Registro Usuario", Text: "Error al registrar usuario." })
          });
      }, 1000);
    },
  });


  return (
    <>
      <PageTitle >Nuevo Usuario</PageTitle>
    
   
    <Container style={{ border: '2px solid gray' }}>
     
      <form
        className="form w-100"
        noValidate
        id="kt_login_signup_form"
        onSubmit={formik.handleSubmit}
      >
        {/* begin::Title */}
        <div className="pb-5 pb-lg-15">         
          <p className="text-muted fw-bold fs-3">
            Creación de usuarios principales con asignación de contraseña
          </p>
        </div>
        {/* end::Title */}

        {formik.status && (
          <div className="mb-lg-15 alert alert-danger">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}


        <Row>
          <Col xs={12} lg={6} md={6}>
            {/* begin::Form group Firstname */}
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark pt-5">
                Nombres
              </label>
              <input
                placeholder="Nombres"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("firstname")}
                className={clsx(
                  "form-control form-control-lg form-control-solid",
                  {
                    "is-invalid": formik.touched.firstname && formik.errors.firstname,
                  },
                  {
                    "is-valid": formik.touched.firstname && !formik.errors.firstname,
                  }
                )}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.firstname}</div>
                </div>
              )}
            </div>
            {/* end::Form group */}
          </Col>
          <Col xs={12} lg={6} md={6}>
            {/* begin::Form group Lastname */}
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark pt-5">
                Apellidos
              </label>
              <input
                placeholder="Apellidos"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("lastname")}
                className={clsx(
                  "form-control form-control-lg form-control-solid",
                  {
                    "is-invalid": formik.touched.lastname && formik.errors.lastname,
                  },
                  {
                    "is-valid": formik.touched.lastname && !formik.errors.lastname,
                  }
                )}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.lastname}</div>
                </div>
              )}
            </div>
            {/* end::Form group */}
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6} md={6}>
            {/* begin::Form group Email */}
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark pt-5">
                Correo
              </label>
              <input
                placeholder="Correo"
                type="email"
                autoComplete="off"
                {...formik.getFieldProps("email")}
                className={clsx(
                  "form-control form-control-lg form-control-solid",
                  { "is-invalid": formik.touched.email && formik.errors.email },
                  {
                    "is-valid": formik.touched.email && !formik.errors.email,
                  }
                )}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              )}
            </div>
            {/* end::Form group */}
          </Col>
          <Col xs={12} lg={6} md={6}>
            {/* begin::Form group Email */}
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark pt-5">
                Perfil
              </label>
              <Form.Select  {...formik.getFieldProps("tipoclienteid")} className="form-control form-control-lg form-control-solid">
                <option>Seleccione una opción</option>
                <option value="1">EMPLEADO</option>
                <option value="2">CLIENTE</option>
                <option value="3">ADMIN FLOTA</option>
                <option value="4">SUPER ADMIN</option>
              </Form.Select>

              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              )}
            </div>
            {/* end::Form group */}
          </Col>
        </Row>
        {/* begin::Form group */}
        <div className="fv-row mb-10">
          <div className="form-check form-check-custom form-check-solid mb-5">
            <input
              className="form-check-input"
              type="checkbox"
              id="kt_login_toc_agree"
              {...formik.getFieldProps("acceptTerms")}
            />
            <label
              className="form-check-label fw-bold text-gray-600"
              htmlFor="kt_login_toc_agree"
            >
              Asignar Contraseña
            </label>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.acceptTerms}</div>
              </div>
            )}
          </div>
        </div>
        {/* end::Form group */}
        <Row>
          <Col xs={12} lg={6} md={6}>
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
          </Col>
          <Col xs={12} lg={6} md={6}>
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
          </Col>
        </Row>


        {/* begin::Form group */}
        <div className="d-flex flex-wrap pb-lg-0 pb-5">
          <button
            type="submit"
            id="kt_login_signup_form_submit_button"
            className="btn btn-primary fw-bolder fs-6 px-8 py-4 my-3 me-4"
            disabled={
              formik.isSubmitting || !formik.isValid
            }
          >
            {!loading && <span className="indicator-label">Registrar</span>}
            {loading && (
              <span className="indicator-progress" style={{ display: "block" }}>
                Cargando...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
          <Link to="/bienvenido">
            <button
              type="button"
              id="kt_login_signup_form_cancel_button"
              className="btn btn-light-primary fw-bolder fs-6 px-8 py-4 my-3"
            >
              Cancel
            </button>
          </Link>
        </div>
        {/* end::Form group */}
      </form>
    </Container>
    </>
  );
}
