
import { useSelector } from "react-redux";
import { RootState } from "../../../../setup";
import { Topbar } from "./Topbar";
import { UserModelSyscaf } from "../../../../app/modules/auth/models/UserModel";
import { FechaServidor } from "../../../helpers/Helper";

export function Header() {
 // const [showMegaMenuModal, setShowMegaMenuModal] = useState(false);
 // const { config, classes, attributes } = useTheme();
 const user  = useSelector<RootState>(
  ({ auth }) => auth.user
);  
 const vUser = user as UserModelSyscaf;
 
  return (
    <>
      <div
        className='bg-white shadow-sm d-flex align-items-stretch justify-content-between'
       style={ { width: '100%'}}
      
      >
         <div className="d-flex align-items-center mt-2 ">
          <span className=" mx-4 fs-3 text-muted">  </span>
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
