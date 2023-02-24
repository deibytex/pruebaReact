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
    CLienteIds:number | null;
    RetornarValor?:() =>void;
    Saved:any;
};
const Vehiculos : React.FC<Props> =  ({show,handleClose,title,CLienteIds, RetornarValor,Saved}) => {
const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);
const [selected, setSelected] = useState([]);
const {setVehiculosFiltrados, dataTable} = Saved();
  

  
useEffect(() =>{
    GetVehiculos((CLienteIds != null ? CLienteIds.toString(): null)).then((response:AxiosResponse<any>) =>{
        let dual = response.data.map((item:AssetsDTO)=>{
            return {"value":item.description, "label":item.description};
        })
        setvehiculos(dual);
    }).catch((error) =>{
        errorDialog("<i>Error al consultar los vehiculos</i>","");
    });
},[CLienteIds])

useEffect(() =>{
    setVehiculosFiltrados(selected);
    let a = filterObjeto(dataTable, selected);
},[selected]);

const filterObjeto = (list:any, compare:any)=> {
    var ArrayNew = [];
    var countProp = compare.length;
    var countMatch = 0;
    var valComp;
    var valList;
    for (var iList in list) {
        if (list[iList].locationId == compare)
        ArrayNew.push(list[iList]);
    }
    return ArrayNew;
}

function Widget () {
    return (
        <DualListBox
            options={vehiculos}
            selected={selected}
            onChange={(selected:any) => setSelected(selected)}
        />
    );
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
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={RetornarValor}>
                Filtrar
            </Button>
          </Modal.Footer>
        </Modal>
    )
}

export {Vehiculos}