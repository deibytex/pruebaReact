import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetTiempoActualizacion, SetVariablesCliente } from "../../data/Configuracion";
import { TiposParametro } from "../../models/ConfiguracionModels";

type Props = {
   show:boolean;
   handleClose:() =>void;
   ClienteIds: string;
   Title:string;
}
const ModalConfiguracionTiempo : React.FC<Props> = ({show,handleClose, ClienteIds, Title}) =>{
   const [Tiempo, setTiempo] = useState<string>("");
   const GuardarTiempo = () =>{
   //    confirmarDialog(() => {
   //       SetVariablesCliente(ClienteIds,TiposParametro.Tiempos_Actualizacion.toString(),null,Tiempo,null,null).then((response: AxiosResponse<any>) =>{
   //           successDialog(`Locaciones ${(selected.length != 0 ? "asociadas " :"desvinculadas " )}  éxitosamente`,"");
   //           handleClose();
   //       }).catch(() =>{
   //           errorDialog("Ha ocurrido un error, al asociar las locaciones del cliente","");
   //       });
   //   }, `¿Esta seguro que desea ${(selected.length != 0 ? "asociar las locaciones seleccionadas?" :"desvincular las locaciones?" )}`, 'Guardar');
      
   }

   const onChangeTiempo = (e:any) =>{
      setTiempo(e.target.value);
   };

   useEffect(() =>{
      GetTiempoActualizacion(ClienteIds).then((response:AxiosResponse<any>) =>{
         (response.data.length != 0) ? setTiempo(response.data[0].valor.toString()):setTiempo("0");
     }).catch((error) =>{
         errorDialog("<i>Eror al el tiempo de actualización</i>","")
     })
   },[ClienteIds])
 return(
    <>
      <Modal 
            show={show} 
            onHide={handleClose} 
            size="sm">
         <Modal.Header closeButton>
               <Modal.Title>{Title}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className="row">
               <div className="col-sm-12 col-md-12 col-xs-12">
                  <div className="input-group mb-3">
                     <span className="input-group-text" id="basic-addon1"><i className="bi-alarm"></i></span>
                     <input value={Tiempo} onChange={onChangeTiempo} className="form-control input-sm" type="text" placeholder="Tiempo cliente" aria-label="TiempoCliente" aria-describedby="basic-addon1"/>
                  </div>
               </div>
            </div>
         </Modal.Body>
         <Modal.Footer>
            <div className="">
               <button type="button" className="btn btn-sm btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                  <>&nbsp;</>
               <button type="button" className="btn btn-sm btn-primary" onClick={GuardarTiempo}>Guardar</button>
            </div>
         </Modal.Footer>
      </Modal>
   </>
 )
}

export {ModalConfiguracionTiempo}