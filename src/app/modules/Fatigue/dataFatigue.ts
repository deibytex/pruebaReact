import { uuid } from "uuidv4";
import Moment from 'moment';
import _ from "lodash";




const dataGeneral: any[] = [];
const eventos: any[] = []
 

console.log(dataGeneral);

dataGeneral.map((element) => {
    let tipoAlerta = "";
    let color = "";
    if (element.TotalAlertas >= 0 && element.TotalAlertas <= 2) {
        tipoAlerta = "Riesgo bajo"; color = "primary";
    }
    else if (element.TotalAlertas > 2 && element.TotalAlertas <= 5) {
        tipoAlerta = "Riesgo moderado"; color = "warning";
    }
    else {
        tipoAlerta = "Riesgo alto"; color = "danger";
    }

    element["Alerta"] = tipoAlerta;
    element["color"] = color;

});


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
            let name = c.Criticidad;
            if (!p.hasOwnProperty(name)) {
                p[name] = 0;
            }
            p[name]++;
            return p;
        }, {});
        console.log('conteo', counts);
        return counts;

    },

    getTotalPorCriticidad: (alertas: any[], ListadoVehiculoSinOperacion : unknown, soloNiveles : boolean = false) => {

          console.log('alertas', alertas);
          console.log('sinoperar',ListadoVehiculoSinOperacion);
          console.log('niveles', soloNiveles)
          
        let totalEventos = alertas ?? [];
        let ListadoVehiculoSinOpera = (ListadoVehiculoSinOperacion as any[]);
        // agrupamos la informacion por el registration number del carro
        var grouped = _.mapValues(_.groupBy(totalEventos, 'vehiculo'),
          clist => clist.map(car => _.omit(car, 'vehiculo')));
      console.log('grouped',grouped);
          const vehiculosFiltrados = ListadoVehiculoSinOpera.filter((elem) => !totalEventos.find(({ vehiculo }) => elem.Assetid === vehiculo));
       
          console.log('vehiculsfiltrados',vehiculosFiltrados)

        let vehiculosNoOperando =vehiculosFiltrados.filter( (f) => f.Estado == 'No Operando' );
        let VehiculosOperando  = vehiculosFiltrados.filter( (f) => f.Estado == 'Operando' );

        let arrayVehiculos: any[] = [];
        let arrayCriticidad: any[] = [{ nivel: 'Riesgo bajo' }, { nivel: 'Riesgo moderado' }, { nivel: 'Riesgo alto' }]

        
        
        let getCriticidad = (TotalEventos: number) => {

            console.log('totaleventos', totalEventos)
            let tipoAlerta = "";
            if (TotalEventos >= 0 && TotalEventos <= 2)
                tipoAlerta = "Riesgo bajo";
            else if (TotalEventos > 2 && TotalEventos <= 5)
                tipoAlerta = "Riesgo moderado";
            else
                tipoAlerta = "Riesgo alto";
            return tipoAlerta;
        };

        Object.entries(grouped).map((element, index) => {

            console.log('goupeded[1]',element[1] as any[])
            //  // agrupamos la informacion por los eventos para saber la cantidad de eventos que esta generando
            var groupedEvento = _.mapValues(_.groupBy((element[1] as any[]), 'TipoAlerta'),
                clist => clist.map(evento => _.omit(evento, 'TipoAlerta')));

                console.log('antes del array', groupedEvento)

                console.log('a ver que es', element[0]);
                console.log('supuesta criti ', (element[1] as any[]));

            arrayVehiculos.push({
                RegistrationNumber: element[0],
                TotalEventos: (element[1] as any[]).length,
                Criticidad: getCriticidad((element[1] as any[]).length),
                EventosDetallados: element[1],
                EventosAgrupados: groupedEvento
            })

            console.log('objeto arrya vh',arrayVehiculos)
        })
            ;
       

        let response = {
            TotalAlertasFlota: 0,
            operandoDivididos: {}
        };



        // sumamos todas las alertas
        response.TotalAlertasFlota = arrayVehiculos.reduce((partialSum, a) => partialSum + a.TotalEventos, 0);

        
    

        /*  let data = operandoDivididos.reduce((p, c) => {
              let name = c;
              if (!p.hasOwnProperty(name)) {
                  p[name] = 0;            
              }
              p[name]++;
              return p;
          }, {});*/

        //  // agrupamos la informacion por los eventos para saber la cantidad de eventos que esta generando
        // agrupamos la informacion por el registration number del carro
        console.log('arraycirticos',arrayCriticidad)
        var agrupadosPorNivel = _.mapValues(_.groupBy(arrayCriticidad, 'Criticidad'),
            clist => clist.map(nivel => _.omit(nivel, 'Criticidad')));
        response.operandoDivididos = agrupadosPorNivel;

        if(!soloNiveles) {
        response.operandoDivididos["No Riesgo"] = (VehiculosOperando);
        response.operandoDivididos["No Operando"] = (vehiculosNoOperando);
        }
        return response;


    },
    // obtiene los primeros 10 lineas de tiempo de las alargas generadas en el d[ia]
    getTimeLine: () => {
        // llenamos la informacion con datos dummis
        
        dataGeneral.forEach((elemt) => {
            console.log('a ver si es alertas', elemt);
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