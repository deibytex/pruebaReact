import  { Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../modules/Neptuno/index"
import FatigueDashboard from "../modules/Fatigue/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { Opciones, UserModelSyscaf } from "../modules/auth/models/UserModel";
import PoliticaPrivacidad from "../pages/Politica/politicaprivacidad";
import  Registration  from "../modules/auth/components/Registration";
import { ForgotPassword}  from "../modules/auth/components/ForgotPassword";
import IndiceUsuarios from "../modules/auth/components/ListadoUsuarios";
import  NoCargas  from "../modules/Ebus/components/Diagnostico/NoCargas";
import Logs from "../modules/Neptuno/log"
import Usuarios from "../modules/auth/components/ListadoUsuarios";
import  NivelCarga  from "../modules/Ebus/NivelCarga";
import  ParqueoInteligente  from "../modules/Ebus/ParqueoInteligente";
import  EventoCarga  from "../modules/Ebus/EventoCarga";
import Preoperacional from "../modules/Mobile/preoperacional";
import  Configuracion  from "../modules/Ebus/Configuracion";
import Reportes from "../modules/Sotramac/reporteExcelencia";
import ReporteOdometro from "../modules/Ebus/components/Reportes/Odometro";
import ReporteAlarmas from "../modules/Ebus/components/Reportes/Alarmas";
import  {Dashboard}  from "../modules/Tx/Dashboard";
import ReportesIFrame from "../../_start/helpers/components/RenderIframe";
import ReporteConductorNoId from "../modules/Ebus/components/Reportes/ConductorNoId";
import { default as ZPOperadorMovil} from "../modules/Ebus/components/Reportes/ZPOperadorMovil";
import React from "react";



export function PrivateRoutes() {
   // informacion del usuario almacenado en el sistema

  const menu = useSelector<RootState>(
    ({ auth }) => auth.menu
  );  
  
  const [importedModules, setimportedModules] = useState<any[]>([]);

   useEffect(() => {
    const lstOpciones = (menu as Opciones[]);
    if (lstOpciones != undefined) {
   /*     try {
      // opciones que son padres para poder restructurar el meniu    
     
      let modulos : any[]= [];
        // importamos lo modulos dinamicamente
        const importPromises =   opcionesHijo.map( f=> {
          import(f.controlador).then(module => {
            modulos.push({ ...f, Component: module.default });
          })

        });

        Promise.all(importPromises).then(() =>
        setimportedModules(modulos)
        );
       
      } catch (err) {
        console.error(err);
      }
    
    }*/
    let opcionesHijo = lstOpciones.filter((element) => element.opcionPadreId != null);

    let lstrpoutes = modules.filter( f=> lstOpciones.filter( ff=> ff.controlador=== f.path)  )
    setimportedModules(lstrpoutes)

  }

}, [menu]);

               


  const modules = [{
    path: '/neptuno/archivos',   
    component: Neptuno
  },{
    path: '/neptuno/log',
    component: Logs
  },{
    path: '/fatigue/dashboard',
    component: FatigueDashboard
  },{
    path: '/auth/registration', 
    component: Registration
  },{
    path: '/auth/forgot', 
    component: ForgotPassword
  },{
    path: '/auth/listado',
    component: IndiceUsuarios
  },{
    path: '/auth/Usuario',
    component: Usuarios
  },{
    path: '/ebus/diagnostico', 
    component: NoCargas
  },{
    path: '/ebus/NivelCarga',
    component: NivelCarga
  },{
    path: '/ebus/ParqueoInteligente',
    component: ParqueoInteligente
  },{
    path: '/ebus/EventoCarga', 
    component: EventoCarga
  },{
    path: '/mobile/preoperacional',
    component: Preoperacional
  },{
    path: '/ebus/Configuracion',
    component: Configuracion
  },{
    path: '/sotramac/Reportes', 
    component: Reportes
  }, {
    path: '/soporte/dashboard',
    component: Dashboard
  },
  {
    path: '/ebus/reportes/ZPOperadorMovil', 
    component: ZPOperadorMovil
  }
  

];
const url ="https://app.powerbi.com/view?r=eyJrIjoiMjkzODk0YmItZDQwZC00NTg3LThiMjYtMmY2NmRhNjZlOGY5IiwidCI6ImU0ZWZjMTcxLTRjM2EtNDFhYS04NGUzLTViZTYyMzEyNTdjYiJ9"
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
      <Redirect exact from="/" to="/bienvenido" />     
       <Route path="/bienvenido" component={Bienvenidos} />  
       <Route path="/politicaprivacidad" component={PoliticaPrivacidad} />      
       {importedModules.map( m=>  <Route exact key={`${m.path}`} path={`${m.path}`} component={m.component} />  )}
       <Route path="/ebus/reporteodometro" component={ReporteOdometro} />  
       <Route path="/ebus/reportes/alarmas" component={ReporteAlarmas} />  
       <Route path="/ebus/reportes/noconductor" component={ReporteConductorNoId} />  
       <Route path="/ebus/reportes/ZPOperadorMovil" component={ZPOperadorMovil} />  
       <Route path="/reportes/bat/viajes" render={ ()=> ReportesIFrame("Viajes",url )    }/>
      </Switch>
    </Suspense>
  );
}
