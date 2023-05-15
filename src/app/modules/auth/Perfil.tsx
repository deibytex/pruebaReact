import { Modal, Button } from "react-bootstrap-v5";
import React, { useEffect, useState } from 'react';
import { GetDataUser, ModificarPerfil } from "./data/datPerfil";
import  confirmarDialog, { errorDialog, successDialog } from "../../../_start/helpers/components/ConfirmDialog";
import { PerfilDTO } from "./models/PerfilModel";
import { RootState } from '../../../setup';
import { useSelector } from 'react-redux';
import {UserModel, UserModelSyscaf } from '../auth/models/UserModel';

type Props={
    show:boolean;
    handleClose: () => void;
    title?:string;
 }
const  Perfil: React.FC <Props>= ({show, handleClose,title }) =>{
const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
);

// convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
const model = (isAuthorized as UserModelSyscaf);
 const [Imgaen, setImagen] = useState<string|undefined>("")
 const [data, setData] = useState<UserModel>()
 const [path, setPath] = useState<string|undefined>("/media/svg/avatars/001-boy.svg")
 const [valueNombre, setvalueNombre] = useState<string|undefined>(model.Nombres)
 const [valueTelefono, setvalueTelefono] = useState<string|undefined>("")

 useEffect(() =>{
    GetDataUser().then((response) =>{
        setData(response.data[0]);
        setvalueNombre(response.data[0].fullname);
        setvalueTelefono(response.data[0].phone);
        setImagen((response.data[0].pic == "")?null: response.data[0].pic)
        setPath((response.data[0].pic == "")?"/media/svg/avatars/001-boy.svg": response.data[0].pic);
    }).catch((error) =>{
        errorDialog("<i>Error comuniquese con el adminisrador<i/>","");
    })
},[]);
 const  DataGuardado = () =>{
    var params: PerfilDTO = {
        Nombre: "",
        Imagen: "",
        Telefono: ""
    };
    params.Nombre = (valueNombre == undefined ? "":valueNombre);
    params.Imagen = (Imgaen == undefined ? "":Imgaen);
    params.Telefono =  (valueTelefono == undefined ? "":valueTelefono);
    CargarDatos(params);
 }
const CargarDatos = (Data:PerfilDTO) =>{
    confirmarDialog(() => {
        ModificarPerfil(Data).then((response) => {
            successDialog("Operación Éxitosa.","");
            handleClose();
        }).catch((error) =>{
        errorDialog("<i>Error comuniquese con el adminisrador<i/>","");
        });
      }, `Esta seguro que desea editar el perfil`,"Guardar");
}

 const onchangeImagen = (e: any) =>{
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        const objectURL = URL.createObjectURL(file);
      setPath(objectURL);
        setImagen((e.target  != undefined ? e.target.result?.toString():""));
    }
 }

 const OnclickNombre = (e:any) =>{
    setvalueNombre(e.target.value)
 };

 const OnclickTelefono = (e:any) =>{
    setvalueTelefono(e.target.value)
 };

  return (
    <>
      <Modal 
      show={show} 
      onHide={handleClose} 
       size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                    <div className="form-control" style={{textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                        <img   className="svg-icon-3x me-n1" src={path} alt="logo" height={"80"} width={"100"}></img>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                    <div className="">
                        <label className="control-label label-sm font-weight-bold" htmlFor="Imagen" style={{fontWeight:'bold'}}>Seleccione imagen</label>
                        <input className="form-control input input-sm " id={"Imagen"} type="file" onChange={onchangeImagen} accept="image/*"></input>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                    <div className="">
                        <label className="control-label label-sm font-weight-bold" htmlFor="Nombre" style={{fontWeight:'bold'}}>Nombre</label>
                        <input className="form-control  input input-sm " id={"Nombre"} type="text" placeholder="Ingrese su nombre" value={valueNombre} onChange={OnclickNombre}></input>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                    <div className="">
                        <label className="control-label label-sm font-weight-bold" htmlFor="Telefono" style={{fontWeight:'bold'}}>Telefono</label>
                        <input className="form-control  input input-sm " id={"Telefono"} type="text" placeholder="Numero de telefono" value={valueTelefono} onChange={OnclickTelefono}></input>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button type="button" variant="primary" onClick={DataGuardado}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export {Perfil}