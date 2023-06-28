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
    const lstOpciones = (menu as any[]);
    let opciones: any[] = [];
    
    if (lstOpciones != undefined && lstOpciones != null) {
      lstOpciones.map((m: any) => opciones.push(...m.opciones));
      setloader(true)
      if (opciones !== undefined) {
        let opcionesHijo = opciones.filter((element) => element.Controlador != null);
        const componentPromises =
          opcionesHijo.filter(f => !f.Controlador.includes('/reportes/pbi')).map(f => {
            let modulo = f.Accion.slice(3);
            // importamos los compontes que el usuario necesita
            // los demas componentes quedan dormidos
            return import(`../${modulo}`).then(module => {
              return <Route exact key={`${f.Controlador}`} path={`${f.Controlador}`} component={module.default} />
            }).catch((e) => {
              console.log(modulo, e) // importar pagina por defecto
            }
            )
          });

        Promise.all(componentPromises).then(
          (values) => {
            setloader(false);
            setimportedModules(values)

          }
        ).catch(
          (error) => { setloader(false); console.log(error) }
        );
      }
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

          <Route path="/reportes/pbi/mttobusetones/:titulo/:url" component={ReportesIFrame} />
        </Switch>
      </Suspense>
    </BlockUi>

  );
}


