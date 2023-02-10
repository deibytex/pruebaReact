import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap-v5";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css'
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetVehiculos } from "../../data/NivelCarga";
import { AssetsDTO, dualListDTO } from "../../models/NivelcargaModels";
type Props = {
    show:boolean;
    handleClose: () => void;
    title?:string;
    CLienteIds:number;
};
const Vehiculos : React.FC<Props> =  ({show,handleClose,title,CLienteIds}) => {
const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);
const [selected, setSelected] = useState([]);
useEffect(() =>{
    GetVehiculos(CLienteIds.toString()).then((response:AxiosResponse<any>) =>{
        let dual = response.data.map((item:AssetsDTO)=>{
            return {"value":item.assetId, "label":item.registrationNumber};
        })
        setvehiculos(dual);
    }).catch((error) =>{
        errorDialog("<i>Error al consultar los vehiculos</i>","");
    });
},[CLienteIds])

function Widget () {
    return (
        <DualListBox
            options={vehiculos}
            selected={selected}
            onChange={(selected:any) => setSelected(selected)}
        />
    );
}

const RetornarValor =  (e:any) =>{
    console.log(selected.join().toString());
    handleClose();
    return selected.join().toString();
}
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
         size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{(title == null || title == undefined ?  `Filtro por vehiculos`:title)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="row">
                  <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                    <Widget/>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button type="button" variant="primary" onClick={RetornarValor}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
    )
}

export {Vehiculos}