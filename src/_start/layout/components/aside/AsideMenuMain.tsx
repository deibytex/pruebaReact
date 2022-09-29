import React from "react";
import { AsideMenuItem } from "./AsideMenuItem";

export function AsideMenuMain() {
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
        <>
          <div className="menu-item">
            <h4 className="menu-content text-muted mb-0 fs-6 fw-bold text-uppercase">
              Fatigue
            </h4>
          </div>
          <AsideMenuItem to="/fatigue/dashboard" title="DashBoard" />
        </>

      </>
    </>
  );
}
