import { MRT_ColumnDef } from "material-react-table";
import moment from "moment";

import { Totales } from "../models/ZpOperadorMovilModels";
import ProgressBar from "@ramonak/react-progress-bar";
import { locateFormatPercentNDijitos } from "../../../../_start/helpers/Helper";

const RetornarLabel = (Data: any) => {
    return <span >{Data}</span>;
};



export const ColumnasTablas: any[] = [{
    "movil": [
        {
            accessorKey: 'Movil',
            header: 'Movil',
            Header: 'Móvil',
            Cell(row: any) {
                return (row.row.original.Movil)
            },
            size: 400
        },
        {
            accessorKey: 'Fecha',
            header: 'Fecha',
            Header: 'Fecha',
            Cell(row: any) {
                return (moment(row.row.original.Fecha).format("DD/MM/YYYY"))
            }
        },
        {
            accessorKey: 'EV0Regeneracion0P',
            header: '0. Reg 0<P %',
            Header: '0. Reg 0<P',
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV1Potencia0P50',
            header: '1.Pot 0<P<50 %',
            Header: "1.Pot 0<P<50",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV2Potencia50P100',
            header: '2.Pot 50<P<100 %',
            Header: '2.Pot 50<P<100',
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV2Potencia50P100 != 0 ? row.row.original.EV2Potencia50P100 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV3Potencia100P150',
            header: '3.Pot 100<P<150 %',
            Header: "3.Pot 100<P<150",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV4Potencia150P175',
            header: '4.Pot 150<P<175 %',
            Header: "4.Pot 150<P<175",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV5Potencia175',
            header: '5.Pot P>175 %',
            Header: "5.Pot P>175",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        }]
}, {
    "operador": [
        {
            accessorKey: 'Operador',
            header: 'Operador',
            Header: 'Operador',
            Cell(row: any) {
                return (row.row.original.Operador)
            },
            size: 400
        },
        {
            accessorKey: 'Fecha',
            header: 'Fecha',
            Header: "Fecha",
            Cell(row: any) {
                return (moment(row.row.original.Fecha).format("DD/MM/YYYY"))
            }
        },
        {
            accessorKey: 'EV0Regeneracion0P',
            header: '0. Reg 0<P %',
            Header: "0. Reg 0<P",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV0Regeneracion0P != 0 ? row.row.original.EV0Regeneracion0P / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV1Potencia0P50',
            header: '1.Pot 0<P<50 %',
            Header: "1.Pot 0<P<50",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV1Potencia0P50 != 0 ? row.row.original.EV1Potencia0P50 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV2Potencia50P100',
            header: '2.Pot 50<P<100 %',
            Header: "2.Pot 50<P<100",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV2Potencia50P100 != 0 ? row.row.original.EV2Potencia50P100 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV3Potencia100P150',
            header: '3.Pot 100<P<150 %',
            Header: "3.Pot 100<P<150",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV3Potencia100P150 != 0 ? row.row.original.EV3Potencia100P150 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV4Potencia150P175',
            header: '4.Pot 150<P<175 %',
            Header: "4.Pot 150<P<175",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV4Potencia150P175 != 0 ? row.row.original.EV4Potencia150P175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        },
        {
            accessorKey: 'EV5Potencia175',
            header: '5.Pot P>175 %',
            Header: "5.Pot P>175",
            Cell(row: any) {
                return (RetornarLabel(`${(row.row.original.EV5Potencia175 != 0 ? row.row.original.EV5Potencia175 / row.row.original.Total * 100 : 0).toFixed(2).toString().replace(".", ",")}%`))
            }
        }
    ]
}];

export const ColumnasGraficaZonaOperador: MRT_ColumnDef<Totales>[] = [{
    accessorKey: 'Operador',
    header: 'Operador',
    Header: ({ column, header, table }) => {
        return "";
    },
    Cell: ({ cell, column, row, table }) => {
        return <span className="fw-bolder" style={{ fontSize: '10px' }}>{row.original.Operador}</span>
    },
    size: 200,
    maxSize: 200,
    minSize: 200,
}, {
    accessorKey: 'Total',
    header: 'Total',
    Header: ({ column, header, table }) => {
        return "";
    },
    size: 150,
    maxSize: 150,
    minSize: 150,
    Cell: ({ cell, column, row, table }) => {
        let Total = (row.original.Total == null ? 0 : row.original.Total)
        return <span title={`${row.original.Completo?.toString()} : ${Total}`}>
            <ProgressBar
                className='text-center fw-bolder'
                baseBgColor='transparent'
                bgColor={`${(row.original.Id?.includes("4") ? '#ebba09' : '#F44336')}`}
                labelSize={`10px`}
                width='200px'
                customLabel={` ${locateFormatPercentNDijitos( Number(Total),2)}`}
                completed={`${(Number(Total) * 100+ 50)}`}
                maxCompleted={100}>
            </ProgressBar>
        </span>
    }
}];