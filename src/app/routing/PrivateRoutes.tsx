import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import { LightDashboardWrapper } from "../pages/dashboards/light-dashboard/LightDashboardWrapper";
import { StartDashboardWrapper } from "../pages/dashboards/start-dashboard/StartDashboardWrapper";
import { MenuTestPage } from "../pages/MenuTestPage";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../pages/Neptuno/index"

export function PrivateRoutes() {
  const ProfilePageWrapper = lazy(
    () => import("../modules/profile/ProfilePageWrapper")
  );
  const GeneralPageWrapper = lazy(
    () => import("../modules/general/GeneralPageWrapper")
  );
  const DocsPageWrapper = lazy(() => import("../modules/docs/DocsPageWrapper"));

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
         <Route path="/bienvenido" component={Bienvenidos} />       
        <Route path="/neptuno/archivos" component={Neptuno} />      
        <Redirect from="/auth" to="/bienvenido" />
        <Redirect exact from="/" to="/bienvenido" />     
        
      </Switch>
    </Suspense>
  );
}
