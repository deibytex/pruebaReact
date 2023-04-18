import moment from "moment";
import { TituloReporteZP } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core";
import { ZPOperadorMovilPrincipal } from "./components/Zp/ZPOperadorMovilPrincipal";
import { ZpOperadorMovilProvider } from "./core/ZpOperadorMovilProvider";

export default function  ZPOperadorMovil (){
return (
        <>
            <ZpOperadorMovilProvider>
                <PageTitle >{TituloReporteZP}</PageTitle>
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
                    <ZPOperadorMovilPrincipal></ZPOperadorMovilPrincipal>
                </div> 
            </ZpOperadorMovilProvider>
        </>
    )
}