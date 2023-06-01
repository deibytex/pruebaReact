import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RootState } from "../setup";
import { ThemeProvider as ThemeProviderGeneral } from "../_start/layout/core";
import { MasterLayout } from "../_start/layout/MasterLayout";
import { Logout } from "./modules/auth/Logout";
import { PrivateRoutes } from "./routing/PrivateRoutes";
import { PublicRoutes } from "./routing/PublicRoutes";
import { createTheme, ThemeProvider } from '@mui/material';
import { CustomProvider } from "rsuite"
import esEs from 'rsuite/locales/es_ES';
// "rsuite": "^5.34.0",
type Props = {
  basename: string;
};

const App: React.FC<Props> = ({ basename }) => {
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user,
    shallowEqual
  );

  const tableTheme = useMemo(
    () =>
      createTheme({
    
        typography: {
          fontFamily: "Montserrat"
        }
      }),
    [],
  );

  return (
    <BrowserRouter basename={basename}>

        <CustomProvider locale={esEs}>
          <ThemeProviderGeneral>
            <ThemeProvider theme={tableTheme}>
              <Switch>
                <Route path="/logout" component={Logout} />
                {!isAuthorized ? (
                  <Route>
                    <PublicRoutes />
                  </Route>
                ) : (
                  <>
                    <MasterLayout>
                      <PrivateRoutes />
                    </MasterLayout>
                  </>
                )}
              </Switch>
            </ThemeProvider>
          </ThemeProviderGeneral>
        </CustomProvider>

    </BrowserRouter>
  );
};

export { App };

