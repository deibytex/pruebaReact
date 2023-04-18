import { createContext,useContext, useEffect, useState } from "react";
import moment from "moment";
export interface ZpOperadorMovilContextModel {
    fechaInicial?:Date;
    setfechaInicial:(fechaInicial:Date) =>void;
    fechaFinal?:Date;
    setfechafinal:(fechaFinal:Date) =>void;
}
const ZpOperadorMovilContext = createContext<ZpOperadorMovilContextModel>({
    setfechaInicial:(fechaInicial:Date)=>{},
    setfechafinal:(fechaiInicial:Date) =>{}
});
export const ZpOperadorMovilProvider: React.FC = ({ children }) => {
    moment.tz.setDefault("America/Bogota");
    const [fechaInicial, setfechaInicial] = useState<Date>(moment().startOf('day').startOf('day').add(-5, 'days').toDate());
    const [fechaFinal, setfechafinal] = useState<Date>(moment().endOf('day').startOf('day').toDate());

    const value: ZpOperadorMovilContextModel = {
       fechaInicial, 
       setfechaInicial,
       fechaFinal, 
       setfechafinal
    };
    return (
        <ZpOperadorMovilContext.Provider value={value}>
            {children}
        </ZpOperadorMovilContext.Provider>
    );
};
export function useDataZpOperadorMovil() {
    return useContext(ZpOperadorMovilContext);
}