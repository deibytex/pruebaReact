
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { Topbar } from "./Topbar";
import { UserModelSyscaf } from "../../../../app/modules/auth/models/UserModel";
import { Link } from "react-router-dom";
import { usePageData } from "../../core";
import { Home, KeyboardDoubleArrowRight } from "@mui/icons-material";
export function Header() {
 // const [showMegaMenuModal, setShowMegaMenuModal] = useState(false);
 // const { config, classes, attributes } = useTheme();
 const user  = useSelector<RootState>(
  ({ auth }) => auth.user
);  
 const vUser = user as UserModelSyscaf;
 const {pageTitle,moduleName} = usePageData();
  return (
    <>
      <div
        className='bg-white shadow-sm d-flex align-items-stretch justify-content-between'
       style={ { width: '100%'}}
      
      >
         <div className="d-flex align-items-center mt-2 ">
         { 
      (moduleName || pageTitle) && (
     

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
     
      )
      }
         </div>
        
        {/* begin::Right */}
        <div className="d-flex align-items-cente m-2">
          <Topbar />
        </div>
        {/* end::Right */}
      </div>
     
    {/*   <MenuModal
        show={showMegaMenuModal}
        handleClose={() => setShowMegaMenuModal(false)}
      >
        <MenuInner />
      </MenuModal> */}
    </>
  );
}
