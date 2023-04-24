export interface FiltrosReportes {
  FechaInicial : Date,
  FechaFinal: Date,
  FechaInicialInicial: Date,
  FechaFinalInicial: Date,
  IndGrafica : number,
  FechaGrafica: string | null,
  Vehiculos : string[],
  Operadores: string[] | null,
  limitdate : Number | null
}

export interface FiltrosReportesZp extends  FiltrosReportes {
  consultar:boolean | null 
}

