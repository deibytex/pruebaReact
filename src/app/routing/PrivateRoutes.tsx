import { Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { FallbackView } from "../../_start/partials";
import { Bienvenidos } from "../pages/Principal"
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { Opciones } from "../modules/auth/models/UserModel";
import PoliticaPrivacidad from "../pages/Politica/politicaprivacidad";
import ReportesIFrame from "../../_start/helpers/components/RenderIframe";
import BlockUi from "react-block-ui";


export function PrivateRoutes() {
  // informacion del usuario almacenado en el sistema
  const [loader, setloader] = useState<boolean>(false);
  const menu = useSelector<RootState>(
    ({ auth }) => auth.menu
  );

  const [importedModules, setimportedModules] = useState<any[]>([]);
  useEffect(() => {
    const lstOpciones = (menu as Opciones[]);
    setloader(true)
    if (lstOpciones !== undefined) {
      let opcionesHijo = lstOpciones.filter((element) => element.controlador != null);

      const componentPromises =
        opcionesHijo.map(f => {
          let modulo = f.accion.slice(3);
          // importamos los compontes que el usuario necesita
          // los demas componentes quedan dormidos
          return import(`../${modulo}`).then(module => {
            return <Route exact key={`${f.controlador}`} path={`${f.controlador}`} component={module.default} />
          }).catch(() => {
            
            console.log(modulo) // importar pagina por defecto
          }
          )
        });

      Promise.all(componentPromises).then(
        (values) => {
          setloader(false);
          setimportedModules(values)

        }
      ).catch(
        (error) => {setloader(false) ; console.log(error)}
      );
    }


    return () => {
      setimportedModules([])
    }
  }, [menu]);



  const url = "https://app.powerbi.com/view?r=eyJrIjoiMjkzODk0YmItZDQwZC00NTg3LThiMjYtMmY2NmRhNjZlOGY5IiwidCI6ImU0ZWZjMTcxLTRjM2EtNDFhYS04NGUzLTViZTYyMzEyNTdjYiJ9"
  return (
    <BlockUi tag="div" keepInView blocking={loader ?? false} >
      <Suspense fallback={<FallbackView />}>
        <Switch>
          <Redirect exact from="/" to="/bienvenido" />
          <Redirect exact from="/auth/login" to="/bienvenido" />
          <Route path="/bienvenido" component={Bienvenidos} />
          <Route path="/politicaprivacidad" component={PoliticaPrivacidad} />
          {(importedModules.length > 0) && (
            <>     {importedModules}</>
          )
          }
          <Route path="/reportes/bat/viajes" render={() => ReportesIFrame("Viajes", url)} />
        </Switch>
      </Suspense>
    </BlockUi>

  );
}
