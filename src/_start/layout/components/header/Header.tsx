import {  Home } from "@mui/icons-material";
import  { useState } from "react";

import { MenuModal } from "../../../partials";
import { usePageData } from "../../core";
import { MenuInner } from "./MenuInner";
import { Topbar } from "./Topbar";

export function Header() {
  const [showMegaMenuModal, setShowMegaMenuModal] = useState(false);
 // const { config, classes, attributes } = useTheme();
  const { pageTitle/*, moduleName */} = usePageData();

 
  return (
    <>
      <div
        className=' content bg-primary  shadow-sm d-flex align-items-stretch justify-content-between  px-10'
       style={ { width: '100%'}}
      
      >
        {/* begin::Left */}
        <div className="d-flex align-items-center mt-7 ">
         
            <a href="/bienvenido" className="btn btn-lg text-white"> <Home/> </a>
            <span className="text-white">/</span>
            <span className="btn btn-sm text-syscaf-amarillo fw-bolder my-1 fs-3">  {pageTitle}</span>
       
        </div>
        {/* end::Left */}

        {/* begin::Right */}
        <div className="d-flex align-items-cente mt-7">
          <Topbar />
        </div>
        {/* end::Right */}
      </div>
      <MenuModal
        show={showMegaMenuModal}
        handleClose={() => setShowMegaMenuModal(false)}
      >
        <MenuInner />
      </MenuModal>
    </>
  );
}
