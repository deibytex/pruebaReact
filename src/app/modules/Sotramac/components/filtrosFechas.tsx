import moment from "moment";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap-v5";
import { useDataSotramac } from "../core/provider";

type Props = {

}

export const Fechas: React.FC<Props> = () => {

    //Data desde el provider
    const { fechaInicial, fechaFinal, setfechaInicial, setfechaFinal} = useDataSotramac();

    const [predefinidos, setpredefinidos] = useState("");

    const Predifinidos = [
        { Nombre: "Seleccione rango", value: "0" },
        { Nombre: "Ayer", value: "2" },
        { Nombre: "Ultimo 7 dias", value: "6" },
        { Nombre: "Ultimos 30 dias", value: "29" },
        { Nombre: "Este mes", value: "31" },
        { Nombre: "Mes anterior", value: "30" }
    ]

    useEffect(() => {
        let FechaInicial = "";
        let FechaFinal = "";
        if (predefinidos != "0") {
            switch (predefinidos) {
                case "2":
                    FechaInicial = moment().subtract(1, 'days').format("YYYY-MM-DD");
                    FechaFinal = moment().subtract(1, 'days').format("YYYY-MM-DD");
                    break;
                case "6":
                    FechaInicial = moment().subtract(7, 'days').format("YYYY-MM-DD");
                    FechaFinal = moment().subtract(1, 'days').format("YYYY-MM-DD");
                    break;
                case "29":
                    FechaInicial = moment().subtract(30, 'days').format("YYYY-MM-DD");
                    FechaFinal = moment().subtract(1, 'days').format("YYYY-MM-DD");
                    break;
                case "31":
                    FechaInicial = moment().startOf('month').format("YYYY-MM-DD");
                    FechaFinal = moment().endOf('month').format("YYYY-MM-DD");
                    break;
                case "30":
                    FechaInicial = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
                    FechaFinal = moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
                    break;
            }
            setfechaInicial(FechaInicial);
            setfechaFinal(FechaFinal);
        }


    }, [predefinidos])

    function FechaInicialControl() {
        return (
            <Form.Control className=" mb-3 " value={fechaInicial} type="date" name="fechaini" onChange={(e) => {

                setpredefinidos("0");
                // buscamos el objeto completo para tenerlo en el sistema
                setfechaInicial(e.currentTarget.value);
            }} />
        )
    }

    function FechaFinalControl() {
        return (
            <Form.Control className=" mb-3 " value={fechaFinal} type="date" name="fechaifin" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setfechaFinal(e.currentTarget.value);
            }} />
        )
    }

    function SelectPredefinidos() {
        return (
            <Form.Select className=" mb-3 " name="categoria" value={predefinidos} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setpredefinidos(e.currentTarget.value as any);
            }}>
                {Predifinidos.map((cat) => {
                    return (
                        <option key={cat.value} value={cat.value}>
                            {cat.Nombre}
                        </option>
                    );
                })}
            </Form.Select>
        );
    }

    return (
        <>
            <div className="col-sm-4 col-md-4 col-xs-4">
                <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Predefinidos:</label>
                <SelectPredefinidos />
            </div>
            <div className="col-sm-4 col-md-4 col-xs-4">
                <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Fecha Inicial:</label>
                <FechaInicialControl />
            </div>
            <div className="col-sm-4 col-md-4 col-xs-4">
                <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Fecha Final:</label>
                <FechaFinalControl />
            </div>
        </>
    )
}