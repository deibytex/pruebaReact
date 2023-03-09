import BlockUi from "@availity/block-ui";
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
   UsuarioIds:string;
}
const ModalConfiguracionTiempo : React.FC<Props> = ({show,handleClose, ClienteIds, Title, UsuarioIds}) =>{
   const [Tiempo, setTiempo] = useState<string>("");
   const [Campo, setCampo] = useState<any>({});
   const [EsVisible, setEsVisible] = useState<boolean>(true);
   const GuardarTiempo = () =>{
      confirmarDialog(() => {
         setEsVisible(true);
         SetVariablesCliente(
            ClienteIds,
            TiposParametro.Tiempos_Actualizacion.toString(),
            UsuarioIds,
            Tiempo, 
            (Campo.ParametrizacionId != undefined ? Campo.ParametrizacionId.toString():null)
         )
         .then((response: AxiosResponse<any>) =>{
             successDialog(`Tiempo actualizado éxitosamente`,"");
             setEsVisible(false);
             handleClose();
         })
         .catch(() =>{
             errorDialog("Ha ocurrido un error, al asociar el tiempo con el cliente","");
             setEsVisible(false);
         });
     }, `¿Esta seguro que desea asignar el tiempo al cliente?`, 'Guardar');
      
   }

   const onChangeTiempo = (e:any) =>{
      setTiempo(e.target.value);
   };

   useEffect(() =>{
      setEsVisible(true);
      GetTiempoActualizacion(ClienteIds).then((response:AxiosResponse<any>) =>{
         (response.data.length != 0) ? setCampo(response.data[0]):setCampo({});
         (response.data.length != 0) ? setTiempo(response.data[0].Valor):setTiempo("0");
         setEsVisible(false);
     }).catch((error) =>{
         errorDialog("<i>Eror al el tiempo de actualización</i>","")
         setEsVisible(false);
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
         <BlockUi tag="span" className="bg-primary"  keepInView blocking={EsVisible}>
            <div className="row">
               <div className="col-sm-12 col-md-12 col-xs-12">
                  <div className="input-group mb-3">
                     <span className="input-group-text" id="basic-addon1"><i className="bi-alarm"></i></span>
                     <input value={Tiempo} onChange={onChangeTiempo} className="form-control input-sm" type="text" placeholder="Tiempo cliente" aria-label="TiempoCliente" aria-describedby="basic-addon1"/>
                  </div>
               </div>
            </div>
            </BlockUi>
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