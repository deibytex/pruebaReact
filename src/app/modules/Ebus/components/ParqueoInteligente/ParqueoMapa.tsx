import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { Icon } from "leaflet";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import { useState, useEffect } from "react";
import { useDataParqueo } from "../../core/ParqueoProvider";
import {  TablaDTO } from "../../models/ParqueoModels";
import { Mapa } from "./mapa";
 

type Props = {
    Datos: TablaDTO[];
};

 const  ParqueoMapa: React.FC<Props> = ({Datos}) => {
    //table state
 const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
 const [globalFilter, setGlobalFilter] = useState('');
 const [sorting, setSorting] = useState<SortingState>([]);
 const [pagination, setPagination] = useState<PaginationState>({
   pageIndex: 0,
   pageSize: 17,
 });
 const [rowCount, setRowCount] = useState(0);
 const [isLoading, setIsLoading] = useState(false);
 const [isRefetching, setIsRefetching] = useState(false);
 const [isError, setIsError] = useState(false);

 const { DatosMapa, setDatosMapa , setmarkerSeleccionado} = useDataParqueo();

const [EsMapaIndiviual, setEsMapaIndividual] = useState<boolean>(false);
    const _LocDefault = 'En circulacion';
    let listadoCamposTablas: MRT_ColumnDef<TablaDTO>[] =
    [
        {
            accessorKey: 'placa',
            header: 'Movil',
            Header: () => (<div style={{textAlign:"center" }}>Movil <a className="bi-map" style={{color:'red', cursor: 'pointer'}} title='Resetear datos' onClick={resetearCampos}></a></div>),
            Cell({ cell, column, row, table, }) {
                return (row.original.placa != null ?  <a style={{cursor: 'pointer'}}  data-rel={row.original} href="#" id="MapaIndividual" onClick={ ()=> FiltrarMapa(row.original)} className="MapaIndividual"> {(row.original.placa == null ? "" : row.original.placa)}</a>:'');
            },
            size: 5
        },
        {
            accessorKey: 'localizacion',
            header: 'Localización',
            Header: () => (<div style={{textAlign:"center" }}>Localización</div>),
            Cell({ cell, column, row, table, }) {
                return (row.original.localizacion == ''? <span title={_LocDefault} style={{fontSize:'10px'}}>{_LocDefault}</span>: <span title={row.original.localizacion} style={{fontSize:'10px'}}>{(row.original.localizacion.length > 35 ? row.original.localizacion.substring(34,0): row.original.localizacion)}</span>) ;
                },
            size: 5
        },
        {
            accessorKey: 'avl',
            header: 'Ultima posición',
            Header: () => (<div style={{textAlign:"center" }}>Ultima posición</div>),
            Cell({ cell, column, row, table, }) {
                return (row.original.avl != null? <span title={moment(row.original.avl).format("DD/MM/YYYY HH:MM")} style={{fontSize:'10px'}}>{moment(row.original.avl).format("DD/MM/YYYY HH:MM")}</span>:"") ;
                },
            size: 5
        },
    ];

    useEffect(() =>{
        setRowCount(DatosMapa.length);

        setDatosMapa(DatosMapa);
    },[Datos])

    const resetearCampos = (e:any) =>{
        setEsMapaIndividual(false)
    };

    const FiltrarMapa = (row:TablaDTO) =>
    {
     /*   setEsMapaIndividual(true)
        let MapaIndividual = Datos.filter((item:any) =>{
          return (item.placa ==  e.target.dataset.rel);
        })
        setDatosMapa(MapaIndividual);*/
        console.log(row)
        setmarkerSeleccionado(row);
    }
    return(
        <div style={{display: 'flex', flexWrap: 'wrap', width:'100%'}}>
            <div style={{width:'47%'}}>
                 <MaterialReactTable
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                          fontSize : 14,
                          fontStyle: 'bold',  
                        color: 'rgb(27, 66, 94)'
                        
                      }),
                    }}
                            localization={MRT_Localization_ES}
                            columns={listadoCamposTablas}
                            data={Datos}
                            enableTopToolbar={true}
                            enableBottomToolbar={true}
                            enableColumnActions={true}
                            enableColumnFilters={true}
                            enablePagination={true}
                            enableSorting={true}
                            enableColumnOrdering
                            onColumnFiltersChange={setColumnFilters}
                            onGlobalFilterChange={setGlobalFilter}
                            onPaginationChange={setPagination}
                            onSortingChange={setSorting}
                            rowCount={rowCount}
                            enableFilters
                            muiTableBodyRowProps={{ hover: true }}
                            muiToolbarAlertBannerProps={
                                isError
                                  ? {
                                    color: 'error',
                                    children: 'Error al cargar información',
                                  }
                                  : undefined
                              }
                              state={{
                              columnFilters,
                              globalFilter,
                              isLoading,
                              pagination,
                              showAlertBanner: isError,
                              showProgressBars: isRefetching,
                              sorting,
                              }}
                            initialState={{ density: 'compact' }}
                        /> 
            </div>
            <div style={{width:'10px'}}>
            </div>
            <div style={{width:'47%'}}>
              <Mapa/>
            </div>
        </div>
    )
}
 export {ParqueoMapa}