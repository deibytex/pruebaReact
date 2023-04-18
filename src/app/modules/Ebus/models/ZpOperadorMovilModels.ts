export interface FiltrosReportes {
    FechaInicial : Date,
    FechaFinal: Date,
    IndGrafica : number,
    FechaGrafica: string | null,
    Vehiculos : string[],
    Operadores: string[] | null
    indexSeleccionado: number,
    fechaFiltroGrafica: Date | null | string,
    limitdate: number
  }
  
  