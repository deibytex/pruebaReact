type TabProperty = {
    icon : string;
    iconColored : string;
    titulo : string;
    subtitulo : string;
    
   }
   
   const tab1 : TabProperty = {  icon: "/media/icons/duotone/files/Selected-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Sites", subtitulo : "Lista"}
   const tab2 : TabProperty = {  icon: "/media/icons/duotone/files/Deleted-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Correos", subtitulo : "Detalle"}

   export const listTabs : TabProperty[] = [tab1,tab2]
   