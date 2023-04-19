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
  
  
  type TabProperty = {
    icon : string;
    iconColored : string;
    titulo : string;
    subtitulo : string;
    
   }
   const tab1 : TabProperty = {  icon: "/media/icons/duotone/files/Selected-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Movil", subtitulo : ""}
   const tab2 : TabProperty = {  icon: "/media/icons/duotone/files/Deleted-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Operador", subtitulo : ""}
   const tab3 : TabProperty = {  icon: "/media/icons/duotone/files/DownloadedFile.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Zona operador", subtitulo : ""}

   export const listTabs : TabProperty[] = [tab1,tab2,tab3]
   