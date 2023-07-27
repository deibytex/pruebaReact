export interface FiltrosReportes {
    FechaInicialInicial:Date,
    FechaFinalInicial:Date,
    FechaInicial : Date,
    FechaFinal: Date,
    limitdate : Number | null
    TipoReporte?:string,
    Data:any[],
    Consulta:boolean,
  }