import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5"
import DualListBox from "react-dual-listbox";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetClientesUsuarios, SetUsuariosCliente } from "../../data/Configuracion";

type Props = {
   show:boolean;
   handleClose : () => void;
   ClienteId:string;
}

const ModalUsuarios : React.FC<Props> = ({show, handleClose, ClienteId }) =>{
   const [Usuarios, setUsuarios] = useState<any>([]);
   const [selected, setSelected] = useState([]);
   const [EsVisible, setEsVisible] = useState<boolean>(true);
   function DualLisBox () {
      return (
          <DualListBox
              options={Usuarios}
              selected={selected}
              onChange={(selected:any) => setSelected(selected)}
          />
      );
  }
  useEffect(() =>{
   GetClientesUsuarios(null, null, ClienteId,).then((response:AxiosResponse<any>) =>{
       let Usuarios = response.data.data.map((item:any,index:any) =>{
           return {"value":item.UsuarioIds, "label":item.NombreUsuario};
       });
       setUsuarios(Usuarios);
       let seleccionados = response.data.data.map((item:any,index:any) =>{
           return (item.EsSeleccionado == true) ? item.UsuarioIds:undefined;
       }).filter((value:any, index:any) =>{
           return value != undefined
       });
       setSelected(seleccionados);
   }).catch((error) =>{
        errorDialog("Ha ocurrido un error en la consulta de usuarios","")
   });
},[])
 const GuardarUsuarios = () =>{
    confirmarDialog(() => {
        SetUsuariosCliente(ClienteId,selected.join()).then((response:AxiosResponse<any>) =>{
            successDialog(`Usuarios ${(selected.length != 0 ? "asociados " :"desvinculados " )}  éxitosamente`,"");
            handleClose();
        }).catch(() =>{
            errorDialog("Ha ocurrido un error, al asociar los usuarios del cliente","");
        });
    }, `¿Esta seguro que desea ${(selected.length != 0 ? "asociar los usuarios seleccionados?" :"desvincular los usuarios?" )}`, 'Guardar');
   
 };

 return (
    <>
       <Modal 
                show={show} 
                onHide={handleClose} 
                size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{"Asociación de clientes a usuarios"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xs-12">
                        <DualLisBox></DualLisBox>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="">
                    <button type="button" className="btn btn-sm btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                        <>&nbsp;</>
                    <button type="button" className="btn btn-sm btn-primary" onClick={GuardarUsuarios}>Guardar</button>
                </div>
            </Modal.Footer>
         </Modal>
    </>
 )
}
export {ModalUsuarios}