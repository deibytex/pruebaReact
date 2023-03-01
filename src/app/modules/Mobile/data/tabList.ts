type TabProperty = {
    icon : string;
    iconColored : string;
    titulo : string;
    subtitulo : string;
    
   }
   
   const tab1 : TabProperty = {  icon: "/media/icons/duotone/files/Selected-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Preoperacionales", subtitulo : "Inicio"}
   const tab2 : TabProperty = {  icon: "/media/icons/duotone/files/Deleted-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "No Diligenciados", subtitulo : "Detalle"}
   const tab3 : TabProperty = {  icon: "/media/icons/duotone/files/DownloadedFile.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Reportes", subtitulo : "Detallados"}

   export const listTabs : TabProperty[] = [tab1,tab2,tab3]
   