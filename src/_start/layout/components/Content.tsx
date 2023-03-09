import React, { useEffect} from "react";
import { useLocation } from "react-router";
import clsx from "clsx";
import { useTheme } from "../core";
import { DrawerComponent } from "../../assets/ts/components";
import { toAbsoluteUrl } from "../../helpers";

const Content: React.FC = ({ children }) => {
  const { config } = useTheme();
  const location = useLocation();
  useEffect(() => {
    DrawerComponent.hideAll();
  }, [location])

 /**style={{ 
      backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/Syscafimg/MarcaAgua1.png")})` 
      ,backgroundRepeat:"no-repeat" ,
      backgroundSize:"contain"
    }} */
  return (
    <div className='card card-rounded px-10 rounded bg-primary-active'  >
      {children}
    </div>
  );
};

export { Content };
