import { useSelector } from "react-redux";
import { UserModelSyscaf } from "../../../../app/modules/auth/models/UserModel";
import { RootState } from "../../../../setup";
import { AsideMenuItem } from "./AsideMenuItem";


export function AsideMenuMain() {
  // informacion del usuario almacenado en el sistema
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );
  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);
  return (
    <>
      {" "}
      <>
        <>
          <div className="menu-item ">
            <h4 className="menu-content text-syscaf-amarillo mb-0 fs-6 fw-bold text-uppercase">
              Neptuno
            </h4>
          </div>
          <AsideMenuItem to="/neptuno/archivos" title="Archivos" hasBullet={true} iconClass="bi-grid" />
        </>
        {
          (model.fatigue != null) && (<>
            <div className="menu-item">
              <h4 className="menu-content text-syscaf-amarillo mb-0 fs-6 fw-bold text-uppercase">
                Fatigue
              </h4>
            </div>
            <AsideMenuItem to="/fatigue/dashboard" title="DashBoard" hasBullet={true}  iconClass="bi-speedometer2"/>
            <AsideMenuItem to="/fatigue/suspendereventos" title="Suspension Eventos" hasBullet={true} iconClass="bi-speedometer2" />
            <AsideMenuItem to="/fatigue/event" title="Eventos Detallados" hasBullet={true}  iconClass="bi-speedometer2"/>
          </>)
        }
        <>
          <div className="menu-item">
            <h4 className="menu-content text-syscaf-amarillo mb-0 fs-6 fw-bold text-uppercase">
              Administración
            </h4>
            
          </div>
          <AsideMenuItem to="/auth/registration" title="Nuevo Usuario" hasBullet={true} iconClass="bi-people"/>
          <AsideMenuItem to="/auth/listado" title="Listado Usuario" hasBullet={true} exclusive={true} iconClass="bi-table" />
        

        </>

      

      </>
    </>
  );
}
