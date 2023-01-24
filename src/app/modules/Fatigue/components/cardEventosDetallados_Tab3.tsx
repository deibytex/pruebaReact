import { Button, Card,  Tab, Tabs } from "react-bootstrap-v5";
import { eventos } from "../dataFatigue";
import { v4 as uuid } from 'uuid';
import Moment from 'moment';
import { useEffect, useState } from "react";
import moment from "moment";
import { EventoActivo } from "../models/EventosActivos";
import { useDataFatigue } from "../core/provider";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaterialReactTable, { MaterialReactTableProps, MRT_Cell, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { EsPermitido } from "../../../../_start/helpers/Axios/CoreService";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ManageSearch } from "@mui/icons-material";
import { msToTime } from "../../../../_start/helpers/Helper";
type Props ={
 
 isActive : boolean;
 isDetails : boolean;

}

const CardContainerEventos : React.FC<Props> = ({  isActive ,isDetails   }) => { 
   
  
    const {listadoEventosActivos} = useDataFatigue();
    const [dataAlertas, setDataAlertas] = useState<EventoActivo[]>(listadoEventosActivos ?? []);



    const [columnas, setColumnas] = useState<MRT_ColumnDef<any>[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);
  
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});
  


    // funcion para cambiar el estado
    // de ver detalles para que se renderice el tab de ver mas
    function setDetails(id: number) {
        
        let datafiltrada = dataAlertas.map((item) => {
            if (item.EventId == id)
                return { ...item, esVisibleTabs: !item["esVisibleTabs"] };
            return item;
        });
        setDataAlertas(datafiltrada);
      
    }

    // gestiona las alertas generadas en el sistyema
    function setGestionar(id: number) {
        
        // colocar su url axiox aqui
        let datafiltrada = dataAlertas.map((item) => {
            if (item.EventId == id)
                return { ...item, EsGestionado: 1 };
            return item;
        });
        setDataAlertas(datafiltrada);
    
    }
   
    const columnasTabla: MRT_ColumnDef<EventoActivo>[]
    =   [
        {
          accessorKey: 'description',
          header: 'Vehiculo',
          size: 250
        },
        {
          accessorKey: 'name',
          header: 'Operador',
        
          size: 250
        },        
        {
          accessorKey: 'descriptionevent',
          header: 'Evento',
          size: 100
        }, {
          accessorKey: 'EventDateTime',
          header: 'Fecha Evento',
          Cell({ cell, column, row, table, }) {
            
            return (
              <>
                {
                  Moment(row.original.EventDateTime).format('DD/MM/YYYY HH:mm:ss')
                }  
              </>

            )
          },
          size: 80
        }, {
            
            header: 'Edad',
            Cell({ cell, column, row, table, }) {
                let duration  = moment.duration(Moment().diff(row.original.EventDateTime))
              return (
                <>
                  {
                   `${msToTime(duration.asMilliseconds())}`
                  }  
                </>
  
              )
            },
            size: 80
          }

      ];;
  
    return (

        <>
 <MaterialReactTable
         localization={MRT_Localization_ES}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
          columns={columnasTabla}
          data={dataAlertas}
          //editingMode="modal" //default         
          enableTopToolbar
          enableColumnOrdering
          enableEditing
        //  onEditingRowSave={handleSaveRowEdits}
         // onEditingRowCancel={handleCancelRowEdits}
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
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowCount={rowCount}
          renderRowActions={({ row, table }) => (

            <Box sx={{ display: 'flex', gap: '1rem' }}>

             <Tooltip arrow placement="left" title="Editar">
                <IconButton >
                  <ManageSearch/>
                </IconButton>
              </Tooltip>

             
            </Box>
          )
          }

          renderDetailPanel={({ row }) => (
           
                <Tabs
                                            defaultActiveKey="gestion"
                                            className="mb-3 border"
                                            justify
                                        >
                                        <Tab eventKey="gestion" title={`Informacion Básica`}>

                                        <Box
              sx={{
                display: 'grid',
                margin: 'auto',
                gridTemplateColumns: '1fr 1fr',
                width: '100%',
              }}
            >
               <Card>

                                            
                                             <Card.Body>
                                            <Card.Title>Información Evento</Card.Title>
                                            <Card.Text>
                                            <span>Estado: <b>No Gestionado</b></span> <br/>
                                            </Card.Text>
                                            <Card.Text>
                                            <span>Velocidad: <b>N/A</b></span>
                                            </Card.Text>
                                            <Card.Text>
                                            <span>Localización: <b>N/A</b></span>
                                            </Card.Text>
                                            <Button variant="primary">Adicionar Gestión</Button>
                                        </Card.Body>
                                        </Card>

                                        <Card>
                                             <Card.Body>
                                            <Card.Title>Información Contacto</Card.Title>
                                            <Card.Text>
                                            <span>Nombre Contacto: <b>Juan David Vergara</b></span>
                                            </Card.Text>
                                            <Card.Text>
                                            <span>Número Contacto: <b>601 123456789</b></span>
                                            </Card.Text>
                                            <Card.Text>
                                            <span>Correo Contacto: <b>jdv@solucionessyscaf.com.co</b></span>
                                            </Card.Text>
                                            <Button variant="primary">Contactar</Button>
                                        </Card.Body>
                                        </Card>
            </Box>
                                           
                                            </Tab>
                                            <Tab eventKey="localizacion" title="Localizacion">
                                                <span>NO HAY INFORMACION DISPONIBLE</span>
                                            </Tab>
                                            <Tab eventKey="detalles" title="Detalles">
                                                <span>NO HAY INFORMACION DISPONIBLE</span>
                                            </Tab>

                                        </Tabs>
            
          )}
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
        </>
    );
}
export {CardContainerEventos}


