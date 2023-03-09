import BlockUi from "@availity/block-ui";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5"
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetGetListadoClientesUsuario } from "../../data/Configuracion";
import { TablaClienteDTO, TablaUsuariosDTO } from "../../models/ConfiguracionModels";

type Props = {
    show:boolean;
    handleClose : () => void;
    ClienteId:string;
}
const ModalListadousuarioTabla : React.FC<Props> = ({show,handleClose , ClienteId}) =>{
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
     
    const [data, setData] = useState<[]>([])
    const [EsVisible, setEsVisible] = useState<boolean>(true);
    let listadoCampos: MRT_ColumnDef<TablaClienteDTO>[] =
    [
        {
            accessorKey: 'UsuarioNombre',
            header: 'Nombre',
            size: 5
        },
        {
            accessorKey: 'Documento',
            header: 'Documento',
            size: 5
        },
        {
            accessorKey: 'EsActivo',
            header: 'Estado',
            Cell({ cell, column, row, table, }) {
                return (row.original.EsActivo ? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>);
            },
            size: 5
        }
    ];


    useEffect(() =>{
        setEsVisible(true)
        GetGetListadoClientesUsuario(ClienteId).then((response:AxiosResponse<any>) =>{
            setData(response.data.data);
            setRowCount(response.data.data.length);
            setEsVisible(false);
        }).catch(() =>{
            errorDialog("Ha ocurrido un error al consulta el listado de usuarios del cliente", "");
            setEsVisible(false);
        });
    },[])

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose} 
                size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{"Listados de usuarios"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xs-12">
                    <BlockUi tag="span" className="bg-primary"  keepInView blocking={EsVisible}>
                    <MaterialReactTable 
                        localization={MRT_Localization_ES}
                        columns={listadoCampos}
                        data={data}
                        enableColumnOrdering
                        onColumnFiltersChange={setColumnFilters}
                        onGlobalFilterChange={setGlobalFilter}
                        onPaginationChange={setPagination}
                        onSortingChange={setSorting}
                        rowCount={rowCount}
                        state={{
                            columnFilters,
                            globalFilter,
                            isLoading,
                            pagination,
                            showAlertBanner: isError,
                            showProgressBars: isRefetching,
                            sorting,
                            }}
                        initialState={{ density: 'compact'}}
                    />
                        </BlockUi>
                    </div>
                </div>
            </Modal.Body>
                <Modal.Footer>
                    <div className="">
                        <button type="button" className="btn btn-sm btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </Modal.Footer>
            </Modal>
            
        </>
    )
}
export {ModalListadousuarioTabla}