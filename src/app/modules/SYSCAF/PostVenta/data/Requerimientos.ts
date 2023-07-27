const tabReq1 = { icon: 'Equalizer', titulo: "Todos ", subtitulo: "Requerimientos" }
const tabReq2 = { icon: 'Equalizer', titulo: "Asignados", subtitulo: "Requerimientos" }
const tabReq3 = { icon: 'Equalizer', titulo: "Cerradas", subtitulo: "Recientemente" }
const tabReq4 = { icon: 'Equalizer', titulo: "Reportes ", subtitulo: "Requerimientos" }
export const listTabsRequerimientos:any[] = [tabReq1, tabReq2, tabReq3, tabReq4 ]


//======================================================================================================================================
export const FiltroData = {
    // obtiene la informacion segun se requiera.
    getAsignados: (data: any[]) => {
        return data.filter(f => ["Asignado Soporte", "Asignado Agente", "Asignado ST"].includes((f.Estado)));
    },
    getCerrados: (data: any[]) => {
        return data.filter(f => ["Cerrado"].includes((f.Estado)));
    },
    getAbiertos: (data: any[]) => {
        return data.filter(f => ["Creado", "Reabierto"].includes((f.Estado)));
    },
    getSoporte: (data: any[]) => {
        return data.filter(f => ["Soporte"].includes((f.Tipo)));
    },
    getReporte: function (data: any[]) {
        return (data).reduce((p, c) => {
            const Cabecera =JSON.parse(c.Cabecera);
            let name =Cabecera[0].registrationNumber;
            p[name] = p[name] ?? [];
            p[name].push(c);
            return p;
        }, {});
    },
    getClientes: (data: any[]) => {
        return true;
    },
    getAgentes: (data: any[]) => {
        return true;
    },
    getEstados: (data: any[]) => {
        return true;
    },
};