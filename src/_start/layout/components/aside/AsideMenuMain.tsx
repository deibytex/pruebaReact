import { useSelector } from "react-redux";
import { Opciones } from "../../../../app/modules/auth/models/UserModel";
import { RootState } from "../../../../setup";
import { AsideMenuItem } from "./AsideMenuItem";
import { useEffect, useState } from "react"
import { Button, Collapse } from "react-bootstrap-v5";
import {  ArrowDropDown,  ArrowRight } from "@mui/icons-material";
import { useLocation } from "react-router";
export function AsideMenuMain() {
  // informacion del usuario almacenado en el sistema
 
  const menu = useSelector<RootState>(
    ({ auth }) => auth.menu
  );
  
  const [menuSelected, setmenuSelected] = useState<number>(0);
  //const [expandAll, setexpandAll] = useState<boolean>();
  const [opcionesPadres, setOpciones] = useState<Opciones[]>([]);
  const [opcionesFiltradas, setopcionesFiltradas] = useState<Opciones[]>([]);
  const { pathname } = useLocation();
 // checkIsActive(pathname, to)
  useEffect(() => {
    const lstOpciones = (menu as Opciones[]);
    if (lstOpciones !== undefined) {
      setopcionesFiltradas(lstOpciones.filter((element) => element.esVisible));
      // opciones que son padres para poder restructurar el meniu    
      let opcionesPadre = lstOpciones.filter((element) => element.opcionPadreId == null);
      setOpciones(opcionesPadre);


      let esSeleccionado  = lstOpciones.filter( f=> f.controlador === pathname);
      
      setmenuSelected(((esSeleccionado.length > 0) ? esSeleccionado[0].opcionPadreId :  opcionesPadre[0].opcionId))
    }

  }, [menu]);

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos




  function ImprimirHijos(padreId: number) {


    let filterHijos = opcionesFiltradas.filter((element) => element.opcionPadreId === padreId);
    filterHijos =filterHijos.sort(  function (a, b) { return a.orden - b.orden});
    return filterHijos.map((element) => {

      return (<AsideMenuItem key={`menu-hijo-${element.opcionId}`} to={element.controlador} title={element.nombreOpcion} hasBullet={true} iconClass={element.logo} />)
    });
  }

  return (
    <>
           {opcionesPadres.map((element) => {

        return (
          <div key={`row menu-padre${element.opcionId}`} className="menu-item  flex px-2 ">
            <Button className="flex btn btn-sm "
              onClick={() => setmenuSelected((menuSelected === element.opcionId) ? 0 : element.opcionId)}
              aria-controls={`collapse-${element.opcionId}`}
              aria-expanded={(menuSelected === element.opcionId)}
              
            >
              {((menuSelected === element.opcionId)) ? (<ArrowDropDown className="ms-auto" />) : (<ArrowRight />)}
                  <span className="menu-title text-muted text-syscaf-amarillo fs-5">
                    {element.nombreOpcion}
                  </span>     
            </Button>
            <Collapse className="ms-5" in={(menuSelected === element.opcionId)} >
              {/* IMPRIMIMOS LOS HIJOS DE LA SEGUNDA LINEA */}
              <div id={`collapse-${element.opcionId}`}>
                {ImprimirHijos(element.opcionId)}
              </div>
            </Collapse>

          </div>
        )

      })}

    </>
  );
}


