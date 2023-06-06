import {   useDataNivelCarga } from "../../core/NivelCargaProvider";
import { SocFiltro, VehiculosFiltros } from "./commonComponents";
import { Mapa } from "./mapa";
import { TablaNivelCarga } from "./TablaNivelCarga";

type Props = {
    ExpandirContraerTabla: () =>void;
    tamaTabla: string;
    tamaMapa:boolean;
    ResetearDatos: boolean;

};
const  Principal: React.FC<Props> = ({ tamaTabla, tamaMapa}) => {
    const {setisExpandido} = useDataNivelCarga()
  tamaMapa = (tamaTabla === '6');
  setisExpandido ((tamaTabla === '12'));    

  //para retornar los datos de la tabla por componentes.
    return(
        <>
         
                <div  className={`row  col-sm-${tamaTabla} col-md-${tamaTabla} col-xs-${tamaTabla} `} ><TablaNivelCarga tamanio={tamaTabla}  /></div>
                {<>&nbsp;</>}   {<>&nbsp;</>}   
                <div style={{display : (tamaMapa) ?  'block' : 'none'  , height: 600}}  className={`row  col-sm-6 col-md-6 col-xs-6`}> 
                <Mapa /></div>

                <SocFiltro />
                <VehiculosFiltros >{}</VehiculosFiltros>
          
        </>
       
          
         
          
        
    )
}
export {Principal};