import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import { TablaDTO } from "../../models/ParqueoModels";

type Props = {
    show: boolean;
    title:string;
    handleClose:() =>void;
    Data: TablaDTO[];
};

const  ModalParqueo: React.FC<Props> = ({show, title, handleClose, Data}) => {

 //table state
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [globalFilter, setGlobalFilter] = useState('');
       const [sorting, setSorting] = useState<SortingState>([]);
       const [pagination, setPagination] = useState<PaginationState>({
         pageIndex: 0,
         pageSize: 10,
       });
       const [rowCount, setRowCount] = useState(0);
       const [isLoading, setIsLoading] = useState(false);
       const [isRefetching, setIsRefetching] = useState(false);
       const [isError, setIsError] = useState(false);
       const _LocDefault = 'En circulacion';
       useEffect(() =>{
            setRowCount(Data.length);
       },[Data])
  
      // fin table state
    let listadoCampos: MRT_ColumnDef<TablaDTO>[] =
    [
        {
        accessorKey: 'placa',
        header: 'Bus',
        size: 5
        
        },
        {
            accessorKey: 'localizacion',
            header: 'Localizacion',
            Cell({ cell, column, row, table, }) {
                return (row.original.localizacion == ''? _LocDefault: row.original.localizacion) ;
                },
            size: 5
        
        },
        {
            accessorKey: 'avl',
            header: 'Ultima posición',
            Cell({ cell, column, row, table, }) {
                return (moment(row.original.avl).format("DD/MM/YYYY")) ;
                },
            size: 5
        }
    ];

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
                        <MaterialReactTable
                    localization={MRT_Localization_ES}
                    displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                        align: 'center',
                        },
                        size: 3,
                    },
                  }
                  }
                    columns={listadoCampos}
                    data={Data}
                    enableTopToolbar={true}
                    enableDensityToggle
                    enableColumnOrdering
                    onColumnFiltersChange={setColumnFilters}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    rowCount={rowCount}
                    enableFilters
                    enableColumnFilters={false}
                    muiToolbarAlertBannerProps={
                      isError
                        ? {
                          color: 'error',
                          children: 'Error al cargar información',
                        }
                        : undefined
                    }
                    initialState={{ density: 'compact' }}
                    state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    sorting,
                    }}
                /> 
                        </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
            </Modal>
        </>
    )
}
 export {ModalParqueo}