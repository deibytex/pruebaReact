import { useSelector } from "react-redux";
import { Opciones } from "../../../../app/modules/auth/models/UserModel";
import { RootState } from "../../../../setup";
import { AsideMenuItem } from "./AsideMenuItem";
import { useEffect, useState } from "react"
import { Button, Collapse } from "react-bootstrap-v5";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { useLocation } from "react-router";
export function AsideMenuMain() {
  // informacion del usuario almacenado en el sistema

  const menu = useSelector<RootState>(
    ({ auth }) => auth.menu
  );
 
  const [menuSelected, setmenuSelected] = useState<any[]>([]);
  //const [expandAll, setexpandAll] = useState<boolean>();
  const [opcionesPadres, setOpciones] = useState<Opciones[]>([]);
  const [opcionesFiltradas, setopcionesFiltradas] = useState<Opciones[]>([]);
  const [categorizaciones, setcategorizaciones] = useState<any>({});
  const { pathname } = useLocation();
  // checkIsActive(pathname, to)
  useEffect(() => {
    const lstOpciones : any[] = (menu as any[]);
    const opciones: any[] = [];

    // primero sacamos las categorizaciones
    if (lstOpciones != undefined && lstOpciones != null ) {
    const categorizaciones = lstOpciones.reduce((p, c) => {

      const cat = c.categorizacion ?? "SYSCAF"; // si no hay categoria se asigna no categorizado

      const currCount = Object.hasOwn(p, cat) ? p[cat] : [];
      opciones.push(...c.opciones)
      return {
        ...p,
        [cat]: [...currCount, c]
      };

    }, {});

    setcategorizaciones(categorizaciones);
  }
  }, [menu]);

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos


  function AddsetSeleccionado(opcion: any) {
    menuSelected.includes(opcion) ? setmenuSelected(menuSelected.filter((element) => element !== opcion)) :
      setmenuSelected([...menuSelected, opcion]);
  }

  function isMenuSelected(opcion: any) {
    return menuSelected.includes(opcion);
  }


  function ImprimirHijos(padreId: number, opciones: any[]) {


    let filterHijos = opciones.filter((element) => element.OpcionPadreId === padreId);
    filterHijos = filterHijos.sort(function (a, b) { return a.Orden - b.Orden });
    return filterHijos.map((element) => {
      let toUrl = element.Controlador;
      if (element.ParametrosAdicionales) {
        try {
          const pa: any = JSON.parse(element.ParametrosAdicionales);
          const url: string = pa.url ? btoa(pa.url) : '';
          toUrl = toUrl + `/${element.NombreOpcion}/${url}`;
        } catch (e) {

        }
      }

      return (<AsideMenuItem key={`menu-hijo-${element.OpcionId}`}
        to={toUrl} title={element.NombreOpcion} hasBullet={true} iconClass={element.Logo} />)
    });
  }
  function ImprimirMenuPadre(key: string, opcionesPadre: any[], opciones: any[]) {

    return opcionesPadre.map((element: any) => {

      return (
        <div key={`row menu-${key}${element.OpcionId}`} className="menu-item  flex ">
          <Button className="flex btn btn-sm bg-transparent "
            onClick={() => AddsetSeleccionado(element.OpcionId)}
            aria-controls={`collapse-${element.OpcionId}`}
            aria-expanded={isMenuSelected(element.OpcionId)}
          >
            {(isMenuSelected(element.OpcionId)) ? (<ArrowDropDown className="ms-auto" />) : (<ArrowRight />)}
            <span className="menu-title  text-syscaf-amarillo fs-5">
              {element.NombreOpcion}
            </span>
          </Button>
          <Collapse className="ms-5" in={isMenuSelected(element.OpcionId)}  >
            {/* IMPRIMIMOS LOS HIJOS DE LA SEGUNDA LINEA */}
            <div id={`collapse-${element.OpcionId}`}>
              {ImprimirHijos(element.OpcionId, opciones)}
            </div>
          </Collapse>

        </div>
      );
    })
  }

  return (
    <>
      {(categorizaciones) && (
        Object.keys(categorizaciones).map((key) => {
          // traemos el nombre de la categoria
          const categorizacion = categorizaciones[key];
          // traemos las opciones de la categoria
          let opciones: any[] = [];
          categorizacion.map((m: any) => opciones.push(...m.opciones));
          const opcionesPadre = opciones.filter((element: any) => element.OpcionPadreId == null);

          return (
            <div key={`row menu-padre${key}`} className="menu-item  flex ">
              <Button className="flex btn btn-sm bg-transparent "
                onClick={() => AddsetSeleccionado(key)}
                aria-controls={`collapse-${key}`}
                aria-expanded={isMenuSelected(key)}

              >
                {(isMenuSelected(key)) ? (<ArrowDropDown className="ms-auto" />) : (<ArrowRight />)}
                <span className="menu-title  text-syscaf-amarillo fs-5">
                  {key}
                </span>
              </Button>
              <Collapse className="ms-5" in={isMenuSelected(key)} >
                {/* IMPRIMIMOS LOS HIJOS DE LA SEGUNDA LINEA */}
                <div id={`collapse-${key}`}>
                  {ImprimirMenuPadre(key, opcionesPadre, opciones)}
                </div>
              </Collapse>

            </div>
          )

        })
      )}

    </>
  );
}


