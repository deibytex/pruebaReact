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

  const [menuSelected, setmenuSelected] = useState<number>(0);
  //const [expandAll, setexpandAll] = useState<boolean>();
  const [opcionesPadres, setOpciones] = useState<Opciones[]>([]);
  const [opcionesFiltradas, setopcionesFiltradas] = useState<Opciones[]>([]);
  const { pathname } = useLocation();
  // checkIsActive(pathname, to)
  useEffect(() => {
    const lstOpciones = (menu as any[]);
    const opciones : any [] = [];

    // primero sacamos las categorizaciones

     const categorizaciones = lstOpciones.reduce((p, c) => {

      const cat = c.categorizacion ?? "NO CATEGORIZADO"; // si no hay categoria se asigna no categorizado

      const currCount = Object.hasOwn(p, cat) ? p[cat] : [];
      console.log('currC ', currCount, cat)

       opciones.push(...c.opciones)
       return  {
        ...p, 
        [cat]: [...currCount, c]};
        
     }, {});

      console.log(categorizaciones )

    if (opciones !== undefined) {
      setopcionesFiltradas(opciones.filter((element) => element.EsVisible));
      // opciones que son padres para poder restructurar el meniu    
      let opcionesPadre = lstOpciones.filter((element) => element.OpcionPadreId == null);
      setOpciones(opcionesPadre);


      let esSeleccionado = lstOpciones.filter(f => f.Controlador === pathname);

      setmenuSelected(((esSeleccionado.length > 0) ? esSeleccionado[0].OpcionPadreId : opcionesPadre[0].OpcionId))
    }

  }, [menu]);

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos




  function ImprimirHijos(padreId: number) {


    let filterHijos = opcionesFiltradas.filter((element) => element.OpcionPadreId === padreId);
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

  return (
    <>
      {opcionesPadres.map((element) => {

        return (
          <div key={`row menu-padre${element.OpcionId}`} className="menu-item  flex px-2">
            <Button className="flex btn btn-sm bg-transparent "
              onClick={() => setmenuSelected((menuSelected === element.OpcionId) ? 0 : element.OpcionId)}
              aria-controls={`collapse-${element.OpcionId}`}
              aria-expanded={(menuSelected === element.OpcionId)}

            >
              {((menuSelected === element.OpcionId)) ? (<ArrowDropDown className="ms-auto" />) : (<ArrowRight />)}
              <span className="menu-title  text-syscaf-amarillo fs-5">
                {element.NombreOpcion}
              </span>
            </Button>
            <Collapse className="ms-5" in={(menuSelected === element.OpcionId)} >
              {/* IMPRIMIMOS LOS HIJOS DE LA SEGUNDA LINEA */}
              <div id={`collapse-${element.OpcionId}`}>
                {ImprimirHijos(element.OpcionId)}
              </div>
            </Collapse>

          </div>
        )

      })}

    </>
  );
}


