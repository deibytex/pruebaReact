//import { useState } from "react";

import { KTSVG } from "../../../helpers";

import {  
  HeaderUserMenu
} from "../../../partials";
import { useTheme } from "../../core";

export function Topbar() {
  const { config } = useTheme();
 // const [showSearchModal, setShowSearchModal] = useState(false);
 // const [showInboxComposeModal, setShowInboxComposeModal] = useState(false);
 
  return (
    <>
     

      {/* begin::User */}
      <div className="ms-1 ms-lg-6">
        {/* begin::Toggle */}
        <div
          className="btn btn-icon btn-sm btn-active-bg-accent"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        
        >
          <KTSVG 
            path="/media/icons/duotone/General/User.svg"
            className="svg-icon-1 svg-icon-dark"
          />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      
     
      {/* begin::Aside Toggler */}
      {config.aside.display && (
        <button
          className="btn btn-icon btn-sm btn-active-bg-accent d-lg-none ms-1 ms-lg-6"
          id="kt_aside_toggler"
        
        >
          <KTSVG
            path="/media/icons/duotone/Text/Menu.svg"
            className="svg-icon-1 svg-icon-dark"
          />
        </button>
      )}
      {/* end::Aside Toggler */}

      {/* begin::Sidebar Toggler */}
      {config.sidebar.display && (
        <button
          className="btn btn-icon btn-sm btn-active-bg-accent d-lg-none ms-1 ms-lg-6"
          id="kt_sidebar_toggler"
        >
          <KTSVG
            path="/media/icons/duotone/Text/Menu.svg"
            className="svg-icon-1 svg-icon-dark"
          />
        </button>
      )}
      {/* end::Sidebar Toggler */}
    </>
  );
}
