import { Stack } from "@mui/material";

import { FechaMomentUtc } from "../../_start/helpers/Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { UserModelSyscaf } from "../modules/auth/models/UserModel";

export function Bienvenidos() {
    const user  = useSelector<RootState>(
        ({ auth }) => auth.user
      );  
       const vUser = user as UserModelSyscaf;
    return <div className="container"
    style={{width : "100%", height: "100%"}}
    >
        <Stack>
        
        <div   className=" d-flex align-items-center justify-content-center text-center m-10"
        >
            <Stack>
            <span className="fs-5 text-muted">{FechaMomentUtc.format("dddd, DD [de] MMMM")}</span>
            <h1 className=" text-muted">Bienvenido a SYSCAF Analytics</h1>
            </Stack>
          
        </div>
        <div className="d-flex align-items-start mt-10 ">
          <h1 className=" mx-4 fs-3 text-muted"> Hola!, { vUser.Nombres} </h1>
         </div>
        </Stack>
       

    </div>;
}