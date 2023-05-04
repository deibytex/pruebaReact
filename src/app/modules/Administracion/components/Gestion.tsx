import moment from "moment";
import { formatSimple } from "../../../../_start/helpers/Helper";
import { PageTitle } from "../../../../_start/layout/core";
import { useHistory } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { ClienteProvider, useDataCliente } from "../Core/ClienteProvider";
import { ClienteDTO, InicioCliente } from "../../../../_start/helpers/Models/ClienteDTO";

export default function Gestion() {
 const {ClienteSeleccionado } =  useDataCliente();
    let history = useHistory();
    let Campos = {
        "Driver" : [{
            accessorKey: 'name',
            header: 'Operador',
            Cell(row: any) {
                return (row.row.original.clienteNombre)
            },
            size: 100
        },
        {
            accessorKey: 'employeeNumber',
            header: 'Numero',
            Cell(row: any) {
                return ((row.row.original.employeeNumber == null ? "-":row.row.original.employeeNumber))
            },
            size: 100
        }
    ],
    "Asset":[
        {
            accessorKey: 'Description',
            header: 'Asset',
            size: 100
        },
        {
            accessorKey: 'RegistrationNumber',
            header: 'Placa',
            size: 100
        },
        {
            accessorKey: 'AssetId',
            header: 'ID',
            size: 100
        },
        {
            accessorKey: 'UnitIMEI',
            header: 'Imei',
            size: 100
        },
        {
            accessorKey: 'UnitSCID',
            header: 'SimCard',
            size: 100
        },
        {
            accessorKey: 'SiteName',
            header: 'Sitio',
            size: 100
        },
        {
            accessorKey: 'vertical',
            header: 'Vertical',
            size: 100
        },
        {
            accessorKey: 'clasificacion',
            header: 'Clasificación',
            size: 100
        },
        {
            accessorKey: 'ingresoSalida',
            header: 'Ingreso/Salida',
            Header: 'Estado',
            size: 100
        },
        {
            accessorKey: 'createdDate',
            header: 'Fecha Creación',
            Cell(row: any) {
                return (moment(row.row.original.createdDate).format(formatSimple))
            },
            size: 100
        },
        {
            accessorKey: 'UserState',
            header: 'Estado',
            Cell(row: any) {
                let state = (
                    row.row.original.UserState == "Unverified" ? 
                    <span className='badge bg-warning'>{row.row.original.UserState} </span> :  
                    row.row.original.UserState == "New installation" ?  
                    <span className='badge  bg-info'>{row.row.original.UserState}</span> :
                     <span className='badge  bg-success'>{row.row.original.UserState}</span>
                )
                return (state)
            },
            size: 100
        },
        {
            accessorKey: 'estado',
            header: 'Estado TX',
            Cell(row: any) {
                let state = (
                    row.row.original.estado == "Sin Respuesta del Cliente" ? 
                    <span className='badge bg-warning'>{row.row.original.estado} </span> :  
                    row.row.original.estado == "En Mantenimiento" ?  
                    <span className='badge bg-info'>{row.row.original.estado}</span> :
                    row.row.original.estado == "Detenido" ? 
                    <span className='badge bg-danger'>{row.row.original.estado}</span> :
                    <span className='badge bg-success'>{row.row.original.estado}</span>
                )
                return (state)
            },
            size: 100
        },
        {
            accessorKey: 'VerticalId',
            header: 'VerticalId',
            size: 100
        },
        {
            accessorKey: 'ClasificacionId',
            header: 'ClasificacionId',
            size: 100
        },
        {
            accessorKey: 'ingresoSalidaId',
            header: 'ingresoSalidaId',
            size: 100
        },
        {
            accessorKey: 'EsManual',
            header: 'EsManual',
            size: 100
        }
    ],  "Sites" : [{
        accessorKey: 'siteName',
        header: 'Sitio',
        size: 100
    },
    {
        accessorKey: 'Padre',
        header: 'Pertenece',
        size: 100
    }
    ],"Administrador" : [{
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 100
    },
    {
        accessorKey: 'apellido',
        header: 'Apellidos',
        size: 100
    },
    {
        accessorKey: 'documento',
        header: 'Documento',
        size: 100
    }, {
        accessorKey: 'telefono',
        header: 'Telefono',
        size: 100
    }
    ]};
 const BackPage = () =>{
    history.push("./Clientes");
 }
 const [Cliente, SetCliente] = useState<any> ({})

    return(
        <>   
            <PageTitle>Gestion clientes</PageTitle>
            <div className="card">
                <div className="card-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 mt-5">
                                <button className="btn btn-sm bg-primary float-end" onClick={BackPage} title="Regresar a todos los clientes" id="backpage"><i className="bi-arrow-counterclockwise"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <div className="mx-auto">
                        <div className="ms-3 text-center">
                            <h3 className="mb-0">Gestion de cliente</h3>
                            <span className="text-muted m-3">{
                                (Cliente != undefined) && (Cliente.clienteNombre)
                            }</span>
                        </div>
                    </div>
                </div>
            </div>
           
        </>
    )
}
