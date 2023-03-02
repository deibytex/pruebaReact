import  { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../modules/Neptuno/index"
import FatigueDashboard from "../modules/Fatigue/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { UserModelSyscaf } from "../modules/auth/models/UserModel";
import PoliticaPrivacidad from "../pages/Politica/politicaprivacidad";
import { Registration } from "../modules/auth/components/Registration";
import { ForgotPassword } from "../modules/auth/components/ForgotPassword";
import IndiceUsuarios from "../modules/auth/components/ListadoUsuarios";
import { NoCargas } from "../modules/Ebus/components/Diagnostico/NoCargas";
import Logs from "../modules/Neptuno/log"
import Usuarios from "../modules/auth/components/ListadoUsuarios";
import { NivelCarga } from "../modules/Ebus/NivelCarga";
import { ParqueoInteligente } from "../modules/Ebus/ParqueoInteligente";
import { EventoCarga } from "../modules/Ebus/EventoCarga";
import preoperacional from "../modules/Mobile/preoperacional";



import React from "react";
import Reportes from "../modules/Sotramac/reporteExcelencia";


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
        <Route path="/neptuno/log" component={Logs} />   
        <Redirect exact from="/" to="/bienvenido" />     
       <Route path="/fatigue/dashboard" component={FatigueDashboard} /> 
       <Route path="/politicaprivacidad" component={PoliticaPrivacidad} /> 
       <Route path="/auth/registration" component={Registration} /> 
       <Route path="/auth/forgot" component={ForgotPassword} /> 
       <Route path="/auth/listado" component={IndiceUsuarios} /> 
       <Route path="/auth/Usuario" component={Usuarios} /> 
       <Route path="/ebus/diagnostico" component={NoCargas} />       
       <Route path="/ebus/nivelcarga" component={NivelCarga} />    
       <Route path="/ebus/ParqueoInteligente" component={ParqueoInteligente} />    
       <Route path="/ebus/EventoCarga" component={EventoCarga} />    
       <Route path="/mobile/preoperacional" component={preoperacional} />          
       <Route path="/sotramac/Reportes" component={Reportes} />    
      </Switch>
    </Suspense>
  );
}
