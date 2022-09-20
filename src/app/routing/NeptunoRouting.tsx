import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../pages/Neptuno/index"

export function NeptunoRoutes() {
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path="/bienvenido" component={Bienvenidos} />       
        <Route path="/neptuno/archivos" component={Neptuno} />
        <Route path="/neptuno/logs" component={Bienvenidos} />
        <Redirect from="/auth" to="/bienvenido" />
        <Redirect exact from="/" to="/bienvenido" />      
      </Switch>
    </Suspense>
  );
}
