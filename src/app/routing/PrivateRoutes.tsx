import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../modules/Neptuno/index"
import fatigueDashboard from "../modules/Fatigue/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { UserModelSyscaf } from "../modules/auth/models/UserModel";
import PoliticaPrivacidad from "../pages/Politica/politicaprivacidad";
import { Registration } from "../modules/auth/components/Registration";
import { ForgotPassword } from "../modules/auth/components/ForgotPassword";
import IndiceUsuarios from "../modules/auth/components/ListadoUsuarios";


export function PrivateRoutes() {
   // informacion del usuario almacenado en el sistema
   const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );
  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
         <Route path="/bienvenido" component={Bienvenidos} />       
        <Route path="/neptuno/archivos" component={Neptuno} />      
        
        <Redirect exact from="/" to="/bienvenido" />     
        {
          (model.fatigue != null) && (  <Route path="/fatigue/dashboard" component={fatigueDashboard} />    )
        }
       <Route path="/politicaprivacidad" component={PoliticaPrivacidad} /> 
       <Route path="/auth/registration" component={Registration} /> 
       <Route path="/auth/forgot" component={ForgotPassword} /> 
       <Route path="/auth/listado" component={IndiceUsuarios} /> 
       
      </Switch>
    </Suspense>
  );
}
