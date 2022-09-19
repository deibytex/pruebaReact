import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import { LightDashboardWrapper } from "../pages/dashboards/light-dashboard/LightDashboardWrapper";
import { StartDashboardWrapper } from "../pages/dashboards/start-dashboard/StartDashboardWrapper";
import { MenuTestPage } from "../pages/MenuTestPage";
import {Bienvenidos} from "../pages/Principal"
import Neptuno from "../pages/Neptuno/index"
import GetFileFromLink  from "../pages/Neptuno/download"
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
        <Route path="/neptuno/logs" component={Bienvenidos} />


        <Route path="/dashboard" component={StartDashboardWrapper} />
        <Route path="/neptuno/download/:id(\\d+)" component={GetFileFromLink} />

        {/*/<Route path="/light" component={LightDashboardWrapper} />
        <Route path="/general" component={GeneralPageWrapper} />
        <Route path="/profile" component={ProfilePageWrapper} />
        <Route path="/menu-test" component={MenuTestPage} />
  <Route path="/docs" component={DocsPageWrapper} />*/}
        <Redirect from="/auth" to="/bienvenido" />
        <Redirect exact from="/" to="/bienvenido" />
      
      </Switch>
    </Suspense>
  );
}
