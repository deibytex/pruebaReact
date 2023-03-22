import { useEffect, useState } from "react";
import { Button } from "react-bootstrap-v5";
import DualListBox from "react-dual-listbox";
import confirmarDialog, { errorDialog, successDialog } from "../../../../_start/helpers/components/ConfirmDialog";
import { useDataCorreosTx } from "../core/provider";
import { setSitesCorreosTx } from "../data/dataCorreosTx";
import {  dualList, Sites, SitesNotifacion } from "../models/dataModels";

type Props = {
}

export const SelectSites: React.FC<Props> = () => {

    const { ListaSites, ListaSitesNotifacion, ClienteId, ListaNotifacionId} = useDataCorreosTx();


    const [lstSites, setlstSites] = useState<dualList[]>([]);
    const [selectedSites, setselectedSites] = useState([]); 
    const [sitesSelected, setsitesSelected] = useState("");


    useEffect(() => {
        if (ClienteId != 0) {
            let filter = (ListaSites as Sites[]).filter(function (arr) {
                return (arr.clienteId == ClienteId)
            });


            let dual = filter.map((item) => {
                    return { "value": item.siteId, "label": item.siteName };
            }) as dualList[];

            setlstSites(dual);
        }
        if (ListaNotifacionId != 0) {
            let filters = (ListaSitesNotifacion as SitesNotifacion[]).filter(function (arr) {
                return (arr.ListaClienteNotifacionId == ListaNotifacionId )
            });          

            let initialSelected: any = filters.map((item) => {
                return item.SiteId;
            })

            setselectedSites(initialSelected);

            // setselectedSites(dual);
        }
    }, [ListaNotifacionId, ClienteId, ListaSites, ListaSitesNotifacion])

    function SelectSites() {
        return (
            <DualListBox className=" mb-3 " canFilter 
                options={lstSites}
                selected={selectedSites}
                onChange={(selected: any) => setselectedSites(selected)}
            />
        );
    }

    useEffect(() => {
        setsitesSelected(selectedSites.join());
    }, [selectedSites])

   
    const updatedSites = () => {
        confirmarDialog(() => {
            setSitesCorreosTx(ListaNotifacionId, sitesSelected).then((response) => {
                successDialog("Operación Éxitosa", "");
            }).catch((error) => {
                errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            });
        }, `Está seguro que desea modificar los sites`
            , "Modificar")
    }

    return (
        <>
            <div className="mt-5">
                <label className="control-label label label-sm  m-3" style={{ fontWeight: 'bold' }}>Seleccione Sites:</label>
                <SelectSites />
            </div>
            <div className="row">
                <div className="mt-5 justify-content-end" style={{ textAlign: 'right' }}>
                    <Button type="button" variant="primary" className="m-3" onClick={() => { updatedSites(); }}>
                        Modificar Sites
                    </Button>
                </div>
            </div>
        </>
    )
}