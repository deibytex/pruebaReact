type TabProperty = {
 icon : string;
 iconColored : string;
 titulo : string;
 subtitulo : string;
 
}

const tab1 : TabProperty = {  icon: "/media/svg/logo/gray/aven.svg", iconColored : "/media/svg/logo/colored/aven.svg", titulo: "DashBoard", subtitulo : "Inicio"}
const tab2 : TabProperty = {  icon: "/media/svg/logo/gray/tower.svg", iconColored : "/media/svg/logo/colored/tower.svg", titulo: "Mapa", subtitulo : ""}

export const listTabs : TabProperty[] = [tab1,tab2]


