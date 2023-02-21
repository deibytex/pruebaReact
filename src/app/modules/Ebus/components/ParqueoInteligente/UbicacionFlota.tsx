import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useEffect, useState } from "react";
import { TablaDTO, TablaUbicacionDTO } from "../../models/ParqueoModels";

type Props = {
   Data: TablaDTO[];
};
const  UbicacionFlota: React.FC<Props> = ({Data}) => {
    const [DatosTablaUno, setDatosTablaUno] = useState<TablaDTO[]>([]);
    const [DatosTablaDos, setDatosTablaDos] = useState<TablaDTO[]>([]);
    const [DatosTablatres, setDatosTablaTres] = useState<TablaDTO[]>([]);
   // fin table state
    const _LocDefault = 'En circulacion';
    let listadoCamposTablas: MRT_ColumnDef<TablaUbicacionDTO>[] =
    [
        {
            accessorKey: 'placa',
            header: 'Movil',
            Header: () => (<div style={{textAlign:"center" }}>Movil</div>),
            size: 5
        },
        {
            accessorKey: 'localizacion',
            header: 'Localización',
            Header: () => (<div style={{textAlign:"center" }}>Localización</div>),
            Cell({ cell, column, row, table, }) {
                return (row.original.localizacion == ''? <span title={_LocDefault} style={{fontSize:'10px'}}>{_LocDefault}</span>: <span title={row.original.localizacion} style={{fontSize:'10px'}}>{row.original.localizacion}</span>) ;
                },
            size: 5
        },
    ];

    useEffect(() =>{
        pintarTablaLocaciones(Data);
    },[Data])

    const pintarTablaLocaciones = (Data:any) => {
        //ordeno el array inicial
        Data.sort((a:any, b:any) => a.localizacion > b.localizacion ? 1 : -1);
        //Si es divisible por 3, divide el array en tres partes iguales
        if (Data.length % 3 == 0) {
            let cantidad = Math.floor(Data.length / 3);
            let inicio = Data.slice(0, cantidad);
            let medio = Data.slice(cantidad + 1, cantidad * 2 + 1)
            let final = Data.slice(cantidad * 2);
            setDatosTablaUno(inicio);
            setDatosTablaDos(medio);
            setDatosTablaTres(final);
        }
        //Sino siemplemente divide igual los dos array y por ultimo los sobrantes.
        else {
            let cantidad = Math.floor(Data.length / 2);
            let inicio = Data.slice(0, cantidad);
            let medio = Data.slice(cantidad + 1, cantidad * 2 + 1);
            let final = Data.slice(cantidad * 2);
            setDatosTablaUno(inicio);
            setDatosTablaDos(medio);
            setDatosTablaTres(final);
        }
    };

    return(
        <>
            <div className="row">
                <div className="col-xs-4 col-sm-4 col-md-4">
                    <MaterialReactTable
                        localization={MRT_Localization_ES}
                        columns={listadoCamposTablas}
                        data={DatosTablaUno}
                        enableTopToolbar={false}
                        enableBottomToolbar={false}
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enablePagination={false}
                        enableSorting={false}
                        muiTableBodyRowProps={{ hover: false }}
                        initialState={{ density: 'compact' }}
                    /> 
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4">
                    <MaterialReactTable
                            localization={MRT_Localization_ES}
                            columns={listadoCamposTablas}
                            data={DatosTablaDos}
                            enableTopToolbar={false}
                            enableBottomToolbar={false}
                            enableColumnActions={false}
                            enableColumnFilters={false}
                            enablePagination={false}
                            enableSorting={false}
                            muiTableBodyRowProps={{ hover: false }}
                            initialState={{ density: 'compact' }}
                        /> 
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4">
                    <MaterialReactTable
                            localization={MRT_Localization_ES}
                            columns={listadoCamposTablas}
                            data={DatosTablatres}
                            enableTopToolbar={false}
                            enableBottomToolbar={false}
                            enableColumnActions={false}
                            enableColumnFilters={false}
                            enablePagination={false}
                            enableSorting={false}
                            muiTableBodyRowProps={{ hover: false }}
                            initialState={{ density: 'compact' }}
                        /> 
                </div>
            </div>
        </>
    )
}
export {UbicacionFlota}