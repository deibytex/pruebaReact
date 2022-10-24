import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../modules/Neptuno/index"
import fatigueDashboard from "../modules/Fatigue/dashboard";




export function NeptunoRoutes() {
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path="/bienvenido" component={Bienvenidos} />       
        <Route path="/neptuno/archivos" component={Neptuno} />      
        <Redirect from="/auth" to="/bienvenido" />
        <Redirect exact from="/" to="/bienvenido" />      
        <Route path="/fatigue/dashboard" component={fatigueDashboard} />    
      </Switch>
    </Suspense>
  );
}
