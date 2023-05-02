import React, { useEffect} from "react";
import { useLocation } from "react-router";
//import { useTheme } from "../core";
import { DrawerComponent } from "../../assets/ts/components";
import { Home, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { usePageData } from "../core";
import { Link } from "react-router-dom";


const Content: React.FC = ({ children }) => {
 // const { config } = useTheme();
  const location = useLocation();
  const {pageTitle,moduleName} = usePageData();
  useEffect(() => {
    DrawerComponent.hideAll();
  }, [location])

 /**style={{ 
      backgroundImage: `url(${toAbsoluteUrl("/media/syscaf/Syscafimg/MarcaAgua1.png")})` 
      ,backgroundRepeat:"no-repeat" ,
      backgroundSize:"contain"
    }} */
  return (
    <div className='container-fluid card card-rounded px-10 mt-3 rounded '  >
      { 
      (moduleName || pageTitle) && (
        <div
        className='card shadow-sm bg-white d-flex align-items-stretch justify-content-between mt-2 mb-1'
       style={ { width: '100%'}} >

        <div className="d-flex align-items-center">
          <Link className="btn btn-md text-primary" to="/bienvenido">  <Home/></Link>
            { (moduleName) && (
              <>
              <KeyboardDoubleArrowRight/>

            <Link className="btn btn-sm text-primary fw-bolder  fs-6" to="">  {moduleName}</Link>
              </>
            ) }
            { (pageTitle) && (
              <>
              <KeyboardDoubleArrowRight/>

            <Link className="btn btn-sm text-primary fw-bolder  fs-6" to="">  {pageTitle}</Link>
              </>
            ) }
       
        </div>
      </div>
      )
      }
       
      {children}
    </div>
  );
};

export { Content };
