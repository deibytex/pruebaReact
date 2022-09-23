import axios from 'axios'

type neptunoDirectory = {
    archivoId: number;
    nombre: string;
    descripcion: string | undefined | null;
    tipo: string;
    src: string;
    peso: number;
    hijos: Array<neptunoDirectory> | null;

};


let dataArchivos = [ 

            {
                id: 1,
                orden: 1,
                tipo: "carpeta",
                nombre: "DOCUMENTACION TECNICA",
                src: "DOCUMENTACION TECNICA/",
                hijos: [
                    {
                        id: 2,
                        tipo: "carpeta",
                        nombre: "KIMAX",
                        src: "DOCUMENTACION TECNICA/KIMAX",
                        hijos: [

                            {
                                id: 3,
                                tipo: "carpeta",
                                nombre: "BROCHURE",
                                src: "DOCUMENTACION TECNICA/KIMAX/BROCHURE",
                                hijos: [
                                    {
                                        id: 4,
                                        tipo: "archivo",
                                        nombre: "Elegante.pdf",
                                        src: "DOCUMENTACION TECNICA/KIMAX/BROCHURE/Elegante.pdf",
                                        hijos: null

                                    }]

                            }

                        ]

                    }
                    ,
                    {
                        id: 5,
                        tipo: "carpeta",
                        nombre: "MIX",
                        src: "",
                        hijos: [

                            {
                                id: 6,
                                tipo: "carpeta",
                                nombre: "CAPACITACIONES",
                                src: "",
                                hijos: [
                                    {
                                        id: 7,
                                        tipo: "archivo",
                                        nombre: "Elegante Capacitacion.pdf",
                                        src: "DOCUMENTACION TECNICA/KIMAX/BROCHURE/Elegante capacitacion.pdf",
                                        hijos: null

                                    },
                                    {
                                        id: 8,
                                        tipo: "archivo",
                                        nombre: "Elegante Capacitacion 2.pdf",
                                        src: "DOCUMENTACION TECNICA/KIMAX/BROCHURE/Elegante capacitacion.pdf",
                                        hijos: null

                                    }
                                ]

                            }

                        ]

                    }

                ]

            }
        ]

    ;


export { dataArchivos }