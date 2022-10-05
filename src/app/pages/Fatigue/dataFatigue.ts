import { uuid } from "uuidv4";
import Moment from 'moment';

const dataGeneral = [{ "AssetId": -8635884042744915408, "RegistrationNumber": "WDY-226", "Description": "CT_WDY-226_Kenworth_T800_2014", "Estado": "No Operando", "TotalAlertas": 6 }, { "AssetId": -7621279541019316768, "RegistrationNumber": "EQT-850", "Description": "CT_EQT-850_Kenworth_T800_2019", "Estado": "Operando", "TotalAlertas": 6 }, { "AssetId": -6249438583080034136, "RegistrationNumber": "WMP-354", "Description": "CT_WMP-354_Kenworth_T800_2015", "Estado": "No Operando", "TotalAlertas": 4 }, { "AssetId": -5455180564325710306, "RegistrationNumber": "EQT-852", "Description": "CT_EQT-852_Kenworth_T800_2019", "Estado": "No Operando", "TotalAlertas": 4 }, { "AssetId": -5008111499118051552, "RegistrationNumber": "EQT-540", "Description": "CT_EQT-540_Kenworth_T800_2019", "Estado": "Operando", "TotalAlertas": 4 }, { "AssetId": -4693387311954782427, "RegistrationNumber": "EQT-538", "Description": "CT_EQT-538_Kenworth_T800_2019", "Estado": "No Operando", "TotalAlertas": 0 }, { "AssetId": -2725605589225582359, "RegistrationNumber": "EQT-698", "Description": "CT_EQT-698_Kenworth_T800_2019", "Estado": "Operando", "TotalAlertas": 7 }, { "AssetId": -1489385570717736633, "RegistrationNumber": "EQT-539", "Description": "CT_EQT-539_Kenworth_T800_2019", "Estado": "No Operando", "TotalAlertas": 3 }, { "AssetId": 107817067343128751, "RegistrationNumber": "WLC-231", "Description": "CT_WLC-231_Kenworth_T800_2015", "Estado": "Operando", "TotalAlertas": 1 }, { "AssetId": 337278989305464832, "RegistrationNumber": "EQT-541", "Description": "CT_EQT-541- Kenworth_T800_2019", "Estado": "Operando", "TotalAlertas": 6 }, { "AssetId": 904175370446241792, "RegistrationNumber": "TLZ-688", "Description": "CT_TLZ-688_Kenworth_T800_2015", "Estado": "No Operando", "TotalAlertas": 6 }, { "AssetId": 904951679545884672, "RegistrationNumber": "STW-571", "Description": "CT_STW-571_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 3 }, { "AssetId": 905273225522028544, "RegistrationNumber": "STW-580", "Description": "CT_STW-580_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 9 }, { "AssetId": 905305864526286848, "RegistrationNumber": "TLZ-944", "Description": "CT_TLZ-944_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 7 }, { "AssetId": 905307326215987200, "RegistrationNumber": "TLZ-817", "Description": "CT_TLZ-817_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 2 }, { "AssetId": 905377883313774592, "RegistrationNumber": "TEO-110", "Description": "CT_TEO-110_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 2 }, { "AssetId": 905596692666470400, "RegistrationNumber": "SNX-545", "Description": "CT_SNX-545_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 6 }, { "AssetId": 905633234839621632, "RegistrationNumber": "WCZ-069", "Description": "CT_WCZ-069_Kenworth_T800_2014", "Estado": "No Operando", "TotalAlertas": 7 }, { "AssetId": 905714360765554688, "RegistrationNumber": "TAL-312", "Description": "CT_TAL-312_Kenworth_T800_2012", "Estado": "No Operando", "TotalAlertas": 0 }, { "AssetId": 905984458680082432, "RegistrationNumber": "WCZ-280", "Description": "CT_WCZ-280_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 0 }, { "AssetId": 906025432791031808, "RegistrationNumber": "STW-575", "Description": "CT_STW-575_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 7 }, { "AssetId": 906074060914073600, "RegistrationNumber": "TAL-670", "Description": "CT_TAL-670_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 8 }, { "AssetId": 906358604099657728, "RegistrationNumber": "STW-573", "Description": "CT_STW-573_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 6 }, { "AssetId": 906453248266108928, "RegistrationNumber": "WCZ-210", "Description": "CT_WCZ-210_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 5 }, { "AssetId": 907771388942086144, "RegistrationNumber": "STW-579", "Description": "CT_STW-579_Kenworth_T800_2013", "Estado": "No Operando", "TotalAlertas": 5 }, { "AssetId": 938706496813252608, "RegistrationNumber": "ST-607", "Description": "Trailer Messer ST-607", "Estado": "No Operando", "TotalAlertas": 9 }, { "AssetId": 976299832863387648, "RegistrationNumber": "SYS-001", "Description": "FM Portable Sys001", "Estado": "Operando", "TotalAlertas": 3 }, { "AssetId": 987534100875915264, "RegistrationNumber": "WMP-094", "Description": "CT_WMP-094_Kenworth_T800_2015", "Estado": "No Operando", "TotalAlertas": 7 }, { "AssetId": 1013380761984466944, "RegistrationNumber": "WDZ-735", "Description": "CT_WDZ-735_Kenworth_T800_2015", "Estado": "Operando", "TotalAlertas": 7 }, { "AssetId": 1023498958092836864, "RegistrationNumber": "WDX-556", "Description": "CT_WDX-556_Kenworth_T800_2017", "Estado": "No Operando", "TotalAlertas": 0 }, { "AssetId": 1084250035173015552, "RegistrationNumber": "SNW-905", "Description": "CT_SNW-905_Kenworth_T800_2014", "Estado": "Operando", "TotalAlertas": 3 }, { "AssetId": 1108907726041161728, "RegistrationNumber": "STW-576", "Description": "CT_STW-576_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 1 }, { "AssetId": 1118402410555392000, "RegistrationNumber": "Portable 2", "Description": "Equipo portable 2", "Estado": "No Operando", "TotalAlertas": 8 }, { "AssetId": 1127478175446646784, "RegistrationNumber": "WDX-782", "Description": "WDX-782_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 5 }, { "AssetId": 1147350406722588672, "RegistrationNumber": "SMV-992", "Description": "SMV-992_Kenworth_T800_2011", "Estado": "No Operando", "TotalAlertas": 4 }, { "AssetId": 1613191408002951117, "RegistrationNumber": "TTN-474", "Description": "CT_TTN-474_Kenworth_T800_2014", "Estado": "No Operando", "TotalAlertas": 9 }, { "AssetId": 2456963239633364059, "RegistrationNumber": "WDX-367", "Description": "CT_WDX-367_Kenworth_T800_2014", "Estado": "Operando", "TotalAlertas": 4 }, { "AssetId": 3965720265322171840, "RegistrationNumber": "EQT-697", "Description": "CT_EQT-697_Kenworth_T800_2019", "Estado": "No Operando", "TotalAlertas": 8 }, { "AssetId": 4079468591936584388, "RegistrationNumber": "WDX-369", "Description": "CT_WDX-369_Kenworth_T800_2014", "Estado": "Operando", "TotalAlertas": 8 }, { "AssetId": 4379718263864345379, "RegistrationNumber": "EQT-696", "Description": "CT_EQT-696_Kenworth_T800_2019", "Estado": "Operando", "TotalAlertas": 8 }, { "AssetId": 6204983726929882815, "RegistrationNumber": "STW-578", "Description": "CT_STW-578_Kenworth_T800_2013", "Estado": "Operando", "TotalAlertas": 9 }, { "AssetId": 6241747430121736671, "RegistrationNumber": "EQT-699", "Description": "CT_EQT-699 _Kenworth_T800_2019", "Estado": "No Operando", "TotalAlertas": 0 }, { "AssetId": 7903845467126314853, "RegistrationNumber": "ESP-460", "Description": "CT_ESP-460_Daf_CF_2019", "Estado": "No Operando", "TotalAlertas": 0 }];
const eventos = [{"EventId":3084362655887947910,"Evento":"MiX Vision: Driver fatigue - yawning","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-03T12:42:22","Latitud":4.798433000000000e+000,"Longitud":-7.410890700000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":4.000000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313707338808799232\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313707338808799232\/index\/3.mp4\"}"},{"EventId":3084363772140426792,"Evento":"MiX Vision: Driver fatigue - yawning","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-03T12:46:42","Latitud":4.810437000000000e+000,"Longitud":-7.409141099999999e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":4.300000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313708436877586432\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313708436877586432\/index\/3.mp4\"}"},{"EventId":3084364282577672074,"Evento":"MiX Vision: Driver fatigue - yawning","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-03T12:48:41","Latitud":4.818162000000000e+000,"Longitud":-7.408942200000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":1.200000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313708925572722688\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313708925572722688\/index\/3.mp4\"}"},{"EventId":3084364584781145902,"Evento":"MiX Vision: Driver fatigue - yawning","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-03T12:49:51","Latitud":4.819898000000000e+000,"Longitud":-7.408918799999999e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":1.400000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313709232214093824\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1313709232214093824\/index\/3.mp4\"}"},{"EventId":3084734394451872905,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:44:54","Latitud":4.939534000000000e+000,"Longitud":-7.396908100000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.700000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070362564280320\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070362564280320\/index\/3.mp4\"}"},{"EventId":3084734547967762531,"Evento":"MiX Vision: Driver fatigue - eye closing","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:45:30","Latitud":4.939060000000000e+000,"Longitud":-7.397406500000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.600000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070510375747584\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070510375747584\/index\/3.mp4\"}"},{"EventId":3084734587328919340,"Evento":"MiX Vision: Driver fatigue - eye closing","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:45:39","Latitud":4.938924000000000e+000,"Longitud":-7.397547800000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.700000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070537890381824\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070537890381824\/index\/3.mp4\"}"},{"EventId":3084734624766180377,"Evento":"MiX Vision: Driver fatigue - eye closing","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:45:48","Latitud":4.938790000000000e+000,"Longitud":-7.397677600000000e+001,"TotalTimeSeconds":6,"SpeedKilometresPerHour":5.600000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070587215396864\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070587215396864\/index\/3.mp4\"}"},{"EventId":3084734701815372913,"Evento":"MiX Vision: Driver fatigue - eye closing","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:46:06","Latitud":4.938364000000000e+000,"Longitud":-7.397911300000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.700000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070662041780224\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070662041780224\/index\/3.mp4\"}"},{"EventId":3084734720100939387,"Evento":"MiX Vision: Driver not wearing seatbelt","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:46:10","Latitud":4.938187000000000e+000,"Longitud":-7.397979500000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.700000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070661874008064\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314070661874008064\/index\/3.mp4\"}"},{"EventId":3084735884234266056,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:50:41","Latitud":4.938261000000000e+000,"Longitud":-7.397807500000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.800000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314071820017811456\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314071820017811456\/index\/3.mp4\"}"},{"EventId":3084736157977093679,"Evento":"MiX Vision: Driver not wearing seatbelt","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:51:45","Latitud":4.939278000000000e+000,"Longitud":-7.396899700000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.500000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314072080408592384\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314072080408592384\/index\/3.mp4\"}"},{"EventId":3084736266619525940,"Evento":"MiX Vision: Driver fatigue - eye closing","RegistrationNumber":"WMP-094","driver":"Jhon Jairo Vanegas Rodriguez","StartDateTime":"2022-10-04T12:52:10","Latitud":4.938984000000000e+000,"Longitud":-7.396543800000001e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":5.200000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314072175275360256\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314072175275360256\/index\/3.mp4\"}"},{"EventId":3084776829164171739,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:29:34","Latitud":4.951514000000000e+000,"Longitud":-7.394218600000001e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":3.200000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314111794076807168\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314111794076807168\/index\/3.mp4\"}"},{"EventId":3084777088806125150,"Evento":"MiX Vision: Driver not wearing seatbelt","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:30:35","Latitud":4.952417000000000e+000,"Longitud":-7.393881700000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":2.300000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314112045261090816\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314112045261090816\/index\/3.mp4\"}"},{"EventId":3084778106167209635,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:34:31","Latitud":4.948354000000000e+000,"Longitud":-7.394868800000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":4.100000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113033502027776\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113033502027776\/index\/3.mp4\"}"},{"EventId":3084778202345264985,"Evento":"MiX Vision: Driver not wearing seatbelt","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:34:54","Latitud":4.947309000000000e+000,"Longitud":-7.395079500000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":4.500000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113123595677696\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113123595677696\/index\/3.mp4\"}"},{"EventId":3084778921820527275,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:37:41","Latitud":4.946948000000000e+000,"Longitud":-7.395098200000000e+001,"TotalTimeSeconds":8,"SpeedKilometresPerHour":3.800000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113844269379584\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113844269379584\/index\/3.mp4\"}"},{"EventId":3084778953258229463,"Evento":"MiX Vision: Mobile phone distraction","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:37:49","Latitud":4.947357000000000e+000,"Longitud":-7.395033200000000e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":3.600000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113867006701568\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113867006701568\/index\/3.mp4\"}"},{"EventId":3084778988765917088,"Evento":"MiX Vision: Driver not wearing seatbelt","RegistrationNumber":"WMP-094","driver":"Leonardo López Quintero - C.C 94459127","StartDateTime":"2022-10-04T15:37:57","Latitud":4.947730000000000e+000,"Longitud":-7.394971099999999e+001,"TotalTimeSeconds":0,"SpeedKilometresPerHour":3.400000000000000e+001,"MediaUrls":"{\"Clip0\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113889312010240\/index\/1.mp4\",\"Clip1\":\"https:\/\/mixvisionapi.us.mixtelematics.com\/api\/video\/organisation\/7052086746763945579\/asset\/987534100875915264\/entity\/987534100875915264\/entityType\/Asset\/clip\/1314113889312010240\/index\/3.mp4\"}"}]
dataGeneral.map((element) => {
    let tipoAlerta = "";
    let color = "";
    if (element.TotalAlertas >= 0 && element.TotalAlertas <= 2) {
        tipoAlerta = "Normal"; color = "primary";
    }
    else if (element.TotalAlertas > 2 && element.TotalAlertas <= 5) {
        tipoAlerta = "Elevado"; color = "warning";
    }
    else {
        tipoAlerta = "Critico"; color = "danger";
    }

    element["Alerta"] = tipoAlerta;
    element["color"] = color;

});

console.log(dataGeneral)
const datamapa = {
    "features": [
        {
            "type": "Feature",
            "properties": {
                "PARK_ID": 960,
                "NAME": "Bearbrook Skateboard Park",
                "DESCRIPTIO": "Flat asphalt surface, 5 components"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-74.1131842, 4.6828744]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "PARK_ID": 1219,
                "NAME": "Bob MacQuarrie Skateboard Park (SK8 Extreme Park)",
                "DESCRIPTIO": "Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-74.074584, 4.6495095]
            }
        }
    ]
};

const datosFatigue = {


    orginalDatos: dataGeneral,

    getTotalFlota: () => {

        // agrupamos los que opera y no
        let counts = dataGeneral.reduce((p, c) => {
            let name = c.Estado;
            if (!p.hasOwnProperty(name)) {
                p[name] = 0;
            }
            p[name]++;
            return p;
        }, {});

        return counts;

    },

    getTotalPorCriticidad: () => {
        let operando = dataGeneral.filter((element) => {
            if (element.Estado == "Operando")
                return element;
        });

        let response = {
            TotalAlertasFlota: 0,
            operandoDivididos: {}
        };

        let operandoDivididos = operando.map((element) => {
            let tipoAlerta = "";
            if (element.TotalAlertas >= 0 && element.TotalAlertas <= 2)
                tipoAlerta = "Normal";
            else if (element.TotalAlertas > 2 && element.TotalAlertas <= 5)
                tipoAlerta = "Elevado";
            else
                tipoAlerta = "Critico";

            return tipoAlerta;
        });


        response.TotalAlertasFlota = operando.reduce((partialSum, a) => partialSum + a.TotalAlertas, 0);
        let data = operandoDivididos.reduce((p, c) => {
            let name = c;
            if (!p.hasOwnProperty(name)) {
                p[name] = 0;            
            }
            p[name]++;
            return p;
        }, {});

        response.operandoDivididos = data;

        return response;


    },
    // obtiene los primeros 10 lineas de tiempo de las alargas generadas en el d[ia]
    getTimeLine: () => {
        // llenamos la informacion con datos dummis
        dataGeneral.forEach((elemt) => {
            elemt["Alertas"] = getRamdomAlertas(elemt.TotalAlertas, elemt.RegistrationNumber);
        });        

        return dataGeneral;

    }



};


function GetAlerta() {
    let alertas = ["Bostezo", "Parapadeo", "Fatiga", "Tabaquismo",
        "Cinturón De Seguridad", "Distracción", "No conductor", "Uso Celular", "Distracción G", "Dist. Seguridad", 'Advertencia Colisión',
        "Seguridad G"
    ];
    let ramdom = (Math.random() * (alertas.length));

    return alertas[parseInt(ramdom.toString())];
}
function getHoraRamdom() {
    var currentdate = new Date();
    let hours = currentdate.getHours();
    let ramdom = (Math.random() * (hours + 1));
    let minutes = (Math.random() * (60 + 1));
    return `${('0' + parseInt(ramdom.toString())).slice(-2)}:${('0' + parseInt(minutes.toString())).slice(-2)}`

}
function getRamdomAlertas(cantAlertas: number, vehiculo: string) {
    // generamos la cantidad de elementos necesarios para hacer el ramdom  
    let fechahora = `${Moment().format('YYYY-MM-DD')} `;

    for (var a = [], i = 0; i < cantAlertas; ++i) {
        // fecha dia de hou
        const idUnique = uuid();
        let ramdom = (Math.random() * (400) % 10);
        let hora = getHoraRamdom();
        a[i] = {
            vehiculo,
            id: `alerta_${idUnique}`,
            alerta: GetAlerta(),
            hora: hora,
            horaDatetime: new Date(fechahora + hora),
            EsGestionado: parseInt(ramdom.toString()),
            TimeLine: [{ date: "04/10/2022 00:00", descripcion: "Se ha tomado los datos de la gesiton" },
            { date: "04/10/2022 14:00", descripcion: "Se ha tomado los datos de la gesiton" }, { date: "04/10/2022 20:00", descripcion: "Se ha tomado los datos de la gesiton" }],
            position: { lat: 4.2515665, log: -74.21521465232 },
            esVisibleTabs: false


        }
    };

    return a;

}



export { dataGeneral, datosFatigue, datamapa, eventos }