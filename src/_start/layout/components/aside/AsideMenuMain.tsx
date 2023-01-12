import { useDispatch, useSelector } from "react-redux";
import { Opciones, UserModelSyscaf } from "../../../../app/modules/auth/models/UserModel";
import { RootState } from "../../../../setup";
import { AsideMenuItem } from "./AsideMenuItem";
import { useEffect, useState } from "react"
import store from "../../../../setup/redux/Store";
import { getMenuByUser } from "../../../../app/modules/auth/redux/AuthCRUD";
import { errorDialog } from "../../../helpers/components/ConfirmDialog";
import * as auth from "../../../../app/modules/auth/redux/AuthRedux";
import { put } from "redux-saga/effects";
export function AsideMenuMain() {
  // informacion del usuario almacenado en el sistema
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  const menu = useSelector<RootState>(
    ({ auth }) => auth.menu
  );
  const model = (isAuthorized as UserModelSyscaf);
 
  const [opcionesPadres, setOpciones] = useState<Opciones[]>([]);
  const [opcionesFiltradas, setopcionesFiltradas] = useState<Opciones[]>([]);

  useEffect(()=> {


      const lstOpciones = (menu as Opciones[]);
    
      if(lstOpciones != undefined){
      
  
        setopcionesFiltradas(lstOpciones.filter((element) => element.esVisible));
        // opciones que son padres para poder restructurar el meniu
      
        setOpciones(lstOpciones.filter((element) => element.opcionPadreId == null));

      }


  

  }, [menu]);

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos




  function ImprimirHijos( padreId : number) {


      let filterHijos = opcionesFiltradas.filter((element) => element.opcionPadreId == padreId);
      return filterHijos.map((element) => {

        return (<AsideMenuItem key={`menu-hijo-${element.opcionId}`} to={element.controlador} title={element.nombreOpcion} hasBullet={true} iconClass={element.logo} />)
      });
  }

  return (
    <>

      {  opcionesPadres.map((element) => {

        return (
          <div key={`menu-padre${element.opcionId}`}className="menu-item ">
            <h4 className="menu-content text-syscaf-amarillo mb-0 fs-6 fw-bold text-uppercase">
              {element.nombreOpcion}
            </h4>

            {/* IMPRIMIMOS LOS HIJOS DE LA SEGUNDA LINEA */}
             { ImprimirHijos(element.opcionId)}
          </div>
        )

      })}

    </>
  );
}


