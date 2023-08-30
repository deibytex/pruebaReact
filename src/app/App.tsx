import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { UserModelSyscaf } from "./modules/auth/models/UserModel";
import { FechaServidor } from "../_start/helpers/Helper";
import moment from "moment";
import axios from "axios";
import { Auth_RefreshToken } from "../apiurlstore";
import jwt_decode from "jwt-decode";
import { setInterval } from "timers";
import * as _redux from "../setup";
// "rsuite": "^5.34.0",
type Props = {
  basename: string;
};

const App: React.FC<Props> = ({ basename }) => {

  const dispatch = useDispatch();


  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user,
    shallowEqual
  );

  const auth = (useSelector<RootState>(
    ({ auth }) => auth
  )) as any;


  const tableTheme = useMemo(
    () =>
      createTheme({

        typography: {
          fontFamily: "Montserrat"
        }
      }),
    [],
  );

  // useEffect(() => {
  //   if (isAuthorized) {
  //     let model = (auth.user) as UserModelSyscaf;
  //     let intervalid = setInterval(async () => {
  //       const FechaActual = FechaServidor();
  //       const FechaExp = new Date(2023, 7, 18, 15, 0)

  //       console.log('model EXP', FechaExp, FechaActual)
  //       if (moment(FechaActual) > moment(FechaExp)) {
  //         console.log('Token Expirado', localStorage.getItem("refresh"))
  //         axios.post(Auth_RefreshToken, { AccessToken: auth.accessToken, RefreshToken: auth.refreshToken }).then(

  //           (data) => {
  //             console.log('data', data)
  //             // adiciona una nuevas credenciales de refresco

  //             const newTokens = data.data;
  //             var decoded = jwt_decode<UserModelSyscaf>(newTokens.token);
  //             // fecha de expiracion  

  //             decoded.exp = newTokens.Expiracion;


  //             localStorage.removeItem("token");
  //             localStorage.removeItem("refresh");
  //             localStorage.setItem("token", newTokens.token);
  //             localStorage.setItem("refresh", newTokens.refreshToken);


  //               _redux.setupAxios(axios, null,  newTokens.token);


  //           }
  //         ).catch((error) => {
  //           // si hay algun error debe desloguearse y reiniciar la aplicacion

  //           //  document.location.replace('/logout');
  //         })

  //       }


  //     }, 10000);


  //     return () => {
  //       clearInterval(intervalid); // limpiamos cuando se desmonte la app 
  //     }
  //   }
  // }, [])



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

