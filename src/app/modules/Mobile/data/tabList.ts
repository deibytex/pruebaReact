type TabProperty = {
    icon : string;
    iconColored : string;
    titulo : string;
    subtitulo : string;
    
   }
   
   const tab1 : TabProperty = {  icon: "/media/svg/logo/gray/aven.svg", iconColored : "/media/svg/logo/colored/aven.svg", titulo: "Preoperacionales", subtitulo : "Inicio"}
   const tab2 : TabProperty = {  icon: "/media/svg/logo/gray/tower.svg", iconColored : "/media/svg/logo/colored/tower.svg", titulo: "No Diligenciados", subtitulo : ""}
   const tab3 : TabProperty = {  icon: "/media/svg/logo/gray/fox-hub-2.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Reportes", subtitulo : "Detallados"}

   export const listTabs : TabProperty[] = [tab1,tab2,tab3]
   