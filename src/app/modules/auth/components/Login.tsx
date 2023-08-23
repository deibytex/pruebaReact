import  { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as auth from "../redux/AuthRedux";
import { login } from "../redux/AuthCRUD";
import jwt_decode from "jwt-decode"
import { UserModelSyscaf } from "../models/UserModel";
import { toAbsoluteUrl } from "../../../../_start/helpers";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    /*.email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")*/
    .required("Usuario es requerido"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password es requerido"),
});

const initialValues = {
  email: "",
  password: "",
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false);
  const [errorLogin, seterrorLogin] = useState("");
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setTimeout(() => {

       // llamdo al servidor de cor para validar el login
        login(values.email, values.password)
          .then(( data) => {   
            
            var decoded = jwt_decode<UserModelSyscaf>(data.data.token);   
            // fecha de expiracion  
            decoded.exp = data.data.expiracion;             
         
            setLoading(false);
            dispatch(auth.actions.login(data.data.token, data.data.refreshToken));
            dispatch(auth.actions.setUser(decoded));

            localStorage.setItem("token", data.data.token);
            localStorage.setItem("refresh", data.data.refreshToken)
          })
          .catch((e) => {          
            setLoading(false);
            setSubmitting(false);
            setStatus("Los detalles del login son incorrecto");
          
              seterrorLogin(  "Error al iniciar ingresar.")
               
          });
      }, 1000);
    },
  });

  return (
    <form
      className="rounded shadow form w-100 bg-white px-10 "
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form" 
    >  <div className="pb-lg-5">
      
      {/* begin::Title */}    
      
      <img
               alt="Logo"
               src={toAbsoluteUrl("/media/syscaf/LogoColor.png")}
               className="w-300px h-150px"
             
            />
     
        <h4 className="fw-bolder text-danger">{errorLogin}</h4>        
      </div>

     

      {/* begin::Form group */}
      <div className="v-row mb-10 fv-plugins-icon-container">
        <label className="form-label fs-6 fw-bolder text-dark">Usuario</label>
        <input
          placeholder="Usuario"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{formik.errors.email}</div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-10 fv-plugins-icon-container">
        <div className="d-flex justify-content-between mt-n5">
          <label className="form-label fs-6 fw-bolder text-dark pt-5">
            Constraseña
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-primary fs-6 fw-bolder text-hover-primary pt-5"
            id="kt_login_signin_form_password_reset_button"
          >
            Olvidó Contraseña ?
          </Link>
        </div>
        <input
          type="password"
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

      {/* begin::Action */}
      <div className="pb-lg-0 pb-5">
        <button
          type="submit"
          id="kt_login_signin_form_submit_button"
          className="btn btn-primary fw-bolder fs-6 px-8 py-4 my-3 me-3 mb-10"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Ingresar</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Por favor espere...{" "}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
       {/*   <button
          type="button"
          className="btn btn-light-primary fw-bolder px-8 py-4 my-3 fs-6 mr-3"
        >
          <img
            src={toAbsoluteUrl("/media/svg/brand-logos/google-icon.svg")}
            className="w-20px h-20px me-3"
            alt=""
          />
          Sign in with Google
        </button> */}
      </div>
     {/*  end::Action */}
    </form>
  );
}
