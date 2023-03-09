import React, { useEffect } from "react";
import { Redirect, Route, Switch, Link } from "react-router-dom";
import { Registration } from "./components/Registration";
import { ForgotPassword } from "./components/ForgotPassword";
import { Login } from "./components/Login";
import { toAbsoluteUrl } from "../../../_start/helpers";


export function AuthPage() {
  useEffect(() => {
    document.body.classList.add("bg-white");
    return () => {
      document.body.classList.remove("bg-white");
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-root bg-primary"
    style={{ 
      backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/Syscafimg/Fondo1.jpg")})` 
      ,backgroundRepeat:"no-repeat" ,
      backgroundSize:"contain"
    }}
    >
      <div
        className="d-flex flex-column flex-lg-row flex-column-fluid"
        id="kt_login"
      >
       
      
        {/* Content */}
        <div className="bg-white border border-white login-content flex-lg-row-fluid d-flex flex-column  justify-content-center 
         position-relative overflow-hidden   py-20 px-10 p-lg-7  mw-450px w-100 mh-450px mt-20 mx-auto" >
          <div className="bg-white d-flex flex-column-fluid flex-center py-10">
            <Switch>
              <Route path="/auth/login" component={Login} />
              <Route path="/auth/registration" component={Registration} />
              <Route path="/auth/forgot-password" component={ForgotPassword} />
              <Redirect from="/auth" exact={true} to="/auth/login" />
              <Redirect to="/auth/login" />
            </Switch>
          </div>
         {/*  <div className="d-flex justify-content-lg-start justify-content-center align-items-center py-7 py-lg-0">
            <span className="text-primary fw-bolder fs-4 cursor-pointer">
              Terms
            </span>
           
            <span className="text-primary ms-10 fw-bolder fs-4">
              Contact Us
            </span>
          </div>*/}
        </div> 
      </div>
    </div>
  );
}
