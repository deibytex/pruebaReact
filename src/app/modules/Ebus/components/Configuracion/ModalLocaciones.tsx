import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5"
import DualListBox from "react-dual-listbox";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetLocations, SetLocations } from "../../data/Configuracion";
type props = {
    show:boolean;
    handleClose : () => void;
    ClienteId:string;
    ClienteIds:string;
}

const ModalLocaciones : React.FC<props> = ({show, handleClose,ClienteId, ClienteIds}) =>{
    const [locaciones, setLocaciones] = useState<any>([]);
    const [selected, setSelected] = useState([]);
    const [EsVisible, setEsVisible] = useState<boolean>(true);
    useEffect(() =>{
        GetLocations(ClienteId,true).then((response:AxiosResponse<any>) =>{
            let Locaciones = response.data.data.map((item:any,index:any) =>{
                return {"value":item.LocationId, "label":item.Name};
            });
            setLocaciones(Locaciones);
            let seleccionados = response.data.data.map((item:any,index:any) =>{
                return (item.EsSeleccionado == true) ? item.LocationId:undefined;
            }).filter((value:any, index:any) =>{
                return value != undefined
            });
            setSelected(seleccionados);
        }).catch((error) =>{
                errorDialog("Ha ocurrido un error en la consulta de locaciones","")
        });
    },[])

    function DualLisBox () {
        return (
            <DualListBox
                options={locaciones}
                selected={selected}
                onChange={(selected:any) => setSelected(selected)}
            />
        );
    }
    const GuardarLocaciones = () =>{
        confirmarDialog(() => {
            SetLocations(ClienteIds,"true",selected.join()).then((response: AxiosResponse<any>) =>{
                successDialog(`Locaciones ${(selected.length != 0 ? "asociadas " :"desvinculadas " )}  éxitosamente`,"");
                handleClose();
            }).catch(() =>{
                errorDialog("Ha ocurrido un error, al asociar las locaciones del cliente","");
            });
        }, `¿Esta seguro que desea ${(selected.length != 0 ? "asociar las locaciones seleccionadas?" :"desvincular las locaciones?" )}`, 'Guardar');
      
    };
    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose} 
                size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{"Locación cliente"}</Modal.Title>
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
                    <button type="button" className="btn btn-sm btn-primary" onClick={GuardarLocaciones}>Guardar</button>
                </div>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export {ModalLocaciones}