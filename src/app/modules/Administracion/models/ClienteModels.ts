// export interface ClienteCampos = {

import { TabProperty } from "../../../../_start/helpers/Models/Tabs"

    
// }
const tab0 : TabProperty = {  icon: "/media/icons/duotone/Code/Option.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Administradores", subtitulo : ""}
const tab1 : TabProperty = {  icon: "/media/icons/duotone/General/User.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Vehiculos", subtitulo : ""}
const tab2 : TabProperty = {  icon: "/media/icons/duotone/Files/User-folder.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Conductores", subtitulo : ""}
const tab3 : TabProperty = {  icon: "/media/icons/duotone/Files/User-folder.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Sitios", subtitulo : ""}


export const listTabs : TabProperty[] = [tab0, tab1,tab2,tab3]

export interface clienteCMP{
    estadoClienteIdS:boolean;
    GeneraIMG:boolean;
    notificacion:boolean;
    Event:boolean;
    Position:boolean;
    Trips:boolean;
}