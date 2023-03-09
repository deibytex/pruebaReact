import BlockUi from "@availity/block-ui";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetTiposParametros, SetVariablesCliente } from "../../data/Configuracion";

type Props = {
    show:boolean;
    handleClose:() =>void;
    title:string;
    ClienteIds:string;
    UsuarioIds:string;
    Consultar : () => void;
}

const ModalConfiguracionVariableAdd: React.FC<Props> = ({show, handleClose, title, ClienteIds, UsuarioIds, Consultar}) =>{
    const [TipoParametroSeleccionado,setTipoParametroSeleccionado ] = useState<any>({});
    const [TipoParametros,setTipoParametros ] = useState<[]>([]);
    const [Tiempo,setTiempo ] = useState<string>("");
    const [EsVisible, setEsVisible] = useState<boolean>(false);
    useEffect(() =>{
        setEsVisible(true);
        GetTiposParametros("TIMEUPDATE").then((response:AxiosResponse<any>) =>{
            setTipoParametroSeleccionado(response.data[0]);
            setTipoParametros(response.data)
            setEsVisible(false);
        }).catch((error:AxiosError<any>) =>{
            errorDialog(error.message.toString(),"");
            setEsVisible(false);
        });
    },[]);
 
    const GuardarVariable = () =>{
        confirmarDialog(() => {
            setEsVisible(true);
            SetVariablesCliente(
               ClienteIds,
               TipoParametroSeleccionado.TipoParametroId.toString(),
               UsuarioIds,
               Tiempo, 
               null
            )
            .then((response: AxiosResponse<any>) =>{
                successDialog(`Variable ingresada éxitosamente`,"");
                handleClose();
                Consultar();
                setEsVisible(false);
            })
            .catch(() =>{
                errorDialog("Ha ocurrido un error, al asociar la variable con el cliente","");
                setEsVisible(false);
            });
        }, `¿Esta seguro que desea asociar la variable al cliente?`, 'Guardar');
    }

    const onclickTiempo = (e:any) =>{
        setTiempo(e.target.value);
    }
    return(
        <>
            <Modal 
                    show={show} 
                    onHide={handleClose} 
                    size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="span" className="bg-primary"  keepInView blocking={EsVisible}>
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                        <div className="form-group">
                            <label className="control-label label-sm font-weight-bold">Tiempo configuración</label>
                            <input className="form-control input-sm" type="text"  onChange={onclickTiempo} value={Tiempo} placeholder="Ingrese el tiempo para el cliente" />
                        </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6">
                        <div className="form-group">
                            <label className="control-label label-sm font-weight-bold">Tipo parametro</label>
                            <Form.Select   className=" mb-3 " onChange={(e) => {
                                setEsVisible(true);
                                    // buscamos el objeto completo para tenerlo en el sistema
                                    let Parametros =  TipoParametros?.filter((value:any, index:any) => {
                                        return value.TipoParametroId === Number.parseInt(e.currentTarget.value)
                                    })  
                                    if(Parametros)
                                        setTipoParametroSeleccionado(Parametros[0]);
                                    setEsVisible(false);
                                }} aria-label="Default select example">
                                    <option value={0} >Seleccione un tipo</option>
                                    {                        
                                        TipoParametros?.map((element:any,i:any) => {
                                                let flag = (element.TipoParametroId === TipoParametroSeleccionado)
                                            return (<option key={element.TipoParametroId} selected={flag}  value={(element.TipoParametroId != null ? element.TipoParametroId:0)}>{element.Nombre}</option>)
                                        })
                                    }
                             </Form.Select> 
                        </div>
                    </div>
                </div>
                </BlockUi>
            </Modal.Body>
            <Modal.Footer>
                    <div className="">
                        <button type="button" className="btn btn-sm btn-secondary"  onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                            <>&nbsp;</>
                        <button type="button" className="btn btn-sm btn-primary" onClick={GuardarVariable}>Guardar</button>
                    </div>
            </Modal.Footer>
            </Modal>
        
        </>
    )
}
export {ModalConfiguracionVariableAdd}