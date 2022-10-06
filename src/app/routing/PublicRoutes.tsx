import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AuthPage } from "../modules/auth";
import PoliticaPrivacidad from "../pages/Politica/politicaprivacidad";

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/politicaprivacidad" component={PoliticaPrivacidad} />   
      <Redirect from="/"  to="/auth" />
    
    </Switch>
  );
}
