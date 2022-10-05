import React from "react";
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
          <div className="menu-item">
            <h4 className="menu-content text-muted mb-0 fs-6 fw-bold text-uppercase">
              Neptuno
            </h4>
          </div>
          <AsideMenuItem to="/neptuno/archivos" title="Archivos" />
        </>
        {
          (model.fatigue != null) && (<>
            <div className="menu-item">
              <h4 className="menu-content text-muted mb-0 fs-6 fw-bold text-uppercase">
                Fatigue
              </h4>
            </div>
            <AsideMenuItem to="/fatigue/dashboard" title="DashBoard" />
          </>)
        }


      </>
    </>
  );
}
