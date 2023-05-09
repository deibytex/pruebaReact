import moment from "moment";

export const FormatoColombiaDDMMYYY: string = "DD/MM/YYYY";
export const FormatoColombiaDDMMYYYHHmm: string = "DD/MM/YYYY HH:mm";
export const FormatoColombiaDDMMYYYHHmmss: string = "DD/MM/YYYY HH:mm:ss";

export const FormatoSerializacionYYYY_MM_DD_HHmmss: string = "YYYY-MM-DD HH:mm:ss";
export const FormatoColombiaDD_MM_YYY: string = "DD_MM_YYYY";

//RangosPredefinidos de timePicker
export const ranges: any = [
    {
        label: 'Mes Actual',
        value: [moment().startOf('month').toDate(), moment().endOf('month').endOf('day').toDate()]
    },
    {
        label: 'Mes Anterior',
        value: [moment().add(-1, 'months').startOf('month').toDate(), moment().add(-1, 'months').endOf('month').endOf('day').toDate()]
    },
    {
        label: 'Ultimos 7 días',
        value: [moment().add(-7, 'day').toDate(), moment().endOf('day').toDate()]
    },
    {
        label: 'Hoy',
        value: [moment().toDate(), moment().endOf('day').toDate()]
    }
];