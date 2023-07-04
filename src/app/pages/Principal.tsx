import { Stack } from "@mui/material";

import { FechaMomentUtc } from "../../_start/helpers/Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { UserModelSyscaf } from "../modules/auth/models/UserModel";
import HomePostVenta from "../modules/SYSCAF/PostVenta/DashBoard/Dashboard";
import { toAbsoluteUrl } from "../../_start/helpers";



export function Bienvenidos() {
    const user = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const vUser = user as UserModelSyscaf;
    return <div 
        style={{ width: "100%", height: "100%" }}
    >
        <Stack>

            <div className=" d-flex align-items-center justify-content-center text-center m-10"
               style={{ width: "100%", height: "100%" }}
            >
                <Stack  style={{ width: "100%", height: "100%" }}>
                    <span className="fs-5 text-muted">{FechaMomentUtc.format("dddd, DD [de] MMMM")}</span>
                    <h1 className=" mx-4 fs-3 text-muted"> Hola! {vUser.Nombres} </h1>
                    {/* <HomePostVenta/> */}
                </Stack>


            </div>
            
            <div className=" d-flex d-flex-column align-items-center justify-content-center text-center m-15"
            >
                <img
                 alt="Logo"
                 src={toAbsoluteUrl("/media/syscaf/Bienvenida2.png")}
                 height="100%"
                 width="100%"
                
               
              />
               

            </div>
        </Stack>


    </div>;
}