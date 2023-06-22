import React, { useEffect } from "react";
import { Redirect, Route, Switch, Link } from "react-router-dom";
import  Registration  from "./components/Registration";
import { ForgotPassword } from "./components/ForgotPassword";
import { Login } from "./components/Login";
import { CambiarPassword } from "./components/CambiarPassword";
/*** style={{ 
      backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/FondoAmarilloSyscaf.jpeg")})` 
      ,backgroundRepeat:"no-repeat" ,
      backgroundSize:"contain"
    }} */

export function AuthPage() {
  useEffect(() => {
    document.body.classList.add("bg-white");
    return () => {
      document.body.classList.remove("bg-white");
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-root" >
     
    <div   className="d-flex flex-column flex-lg-row flex-column-fluid"  id="kt_login"      >
     
      <div className="d-flex flex-column text-center items-aling-center justify-content-center  w-lg-600px pt-0"
       style={{backgroundImage:`linear-gradient(to right, #1B4256 , #007675)`}}
      >

     
      </div>

    
      <div className=" login-content flex-lg-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden py-20 px-10 p-lg-7 mx-auto mw-450px w-100"
      
      >
        <div className="d-flex flex-column-fluid flex-center py-10">
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/registration" component={Registration} />
            <Route exact={true} path="/auth/forgot-password" component={ForgotPassword} />
            <Route  exact={true} path="/auth/CambiarPassword/:token/:username" component={CambiarPassword} />
            <Redirect from="/auth" exact={true} to="/auth/login" />
            <Redirect to="/auth/login" />
          </Switch>
        </div>
        <div className="d-flex justify-content-lg-start justify-content-center align-items-center py-7 py-lg-0">
          <span className="text-primary fw-bolder fs-4 cursor-pointer">
            
          </span>
          <span className="text-primary ms-10 fw-bolder fs-4"></span>
          <span className="text-primary ms-10 fw-bolder fs-4">
        
          </span>
        </div>
      </div>
    </div>
  </div>
  );
}

/**
 * 
 *  <div className="d-flex flex-column flex-root bg-primary"
    style={{ 
      backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/FondoVerde.jpeg")})` 
      ,backgroundRepeat:"no-repeat" ,
      backgroundSize:"cover"
    }}
    >
     
      <div
        className="d-flex flex-column flex-column-fluid"
        id="kt_login"
       
      >
       

      
        <div className=" login-content flex-lg-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden py-20 px-10 p-lg-7 mx-auto mw-450px w-100">
          <div className="d-flex flex-column-fluid flex-center py-10">
            <Switch>
              <Route path="/auth/login" component={Login} />
            
              <Route path="/auth/forgot-password" component={ForgotPassword} />
              <Redirect from="/auth" exact={true} to="/auth/login" />
              <Redirect to="/auth/login" />
            </Switch>
          </div>
        
        </div>
      </div>
    </div>
 */
/*
 <div className="d-flex flex-column flex-root" >
     
      <div   className="d-flex flex-column flex-lg-row flex-column-fluid"  id="kt_login"      >
       
        <div className="d-flex flex-column text-center items-aling-center justify-content-center bg-primary w-lg-600px pt-15 pt-lg-0"
          style={{ 
            backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/FondoVerde.jpeg")})` 
            ,backgroundRepeat:"no-repeat" ,
            backgroundSize:"cover"
          }}
        >
          
    
            <Link to="/" className="mb-6">
              <img
                 alt="Logo"
                 src={toAbsoluteUrl("/media/syscaf/LogoBlanco.png")}
                 className="h-90px  h-75px"
               
              />
            </Link>
       

       
        </div>

      
        <div className=" login-content flex-lg-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden py-20 px-10 p-lg-7 mx-auto mw-450px w-100"
        
        >
          <div className="d-flex flex-column-fluid flex-center py-10">
            <Switch>
              <Route path="/auth/login" component={Login} />
              <Route path="/auth/registration" component={Registration} />
              <Route path="/auth/forgot-password" component={ForgotPassword} />
              <Redirect from="/auth" exact={true} to="/auth/login" />
              <Redirect to="/auth/login" />
            </Switch>
          </div>
          <div className="d-flex justify-content-lg-start justify-content-center align-items-center py-7 py-lg-0">
            <span className="text-primary fw-bolder fs-4 cursor-pointer">
              
            </span>
            <span className="text-primary ms-10 fw-bolder fs-4"></span>
            <span className="text-primary ms-10 fw-bolder fs-4">
          
            </span>
          </div>
        </div>
      </div>
    </div>
*/