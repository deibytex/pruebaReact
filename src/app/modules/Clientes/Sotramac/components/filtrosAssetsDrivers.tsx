import { join } from "path";
import { useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import { string } from "yup/lib/locale";
import { useDataSotramac } from "../core/provider";
import { Assets, Drivers, dualList } from "../models/dataModels";

type Props = {
    reporte: string;
}

export const SelectAssetsDrivers: React.FC<Props> = ({reporte}) => {

    const { assets, drivers, siteId, assetTypeId,  setdriverSelected, setassetSelected } = useDataSotramac();


    const [lstAssets, setlstAssets] = useState<dualList[]>([]);
    const [lstDrivers, setlstDrivers] = useState<dualList[]>([]);
    const [selectedAssets, setselectedAssets] = useState([]);
    const [selectedDrivers, setselectedDrivers] = useState([]);

    const [showAssets, setshowAssets] = useState(true);
    const [showDrivers, setshowDrivers] = useState(true);

    useEffect(() => {

        if (assetTypeId != 0 && (reporte === "EOAPV" || reporte === "EOAPCV")) {

            let filter = (assets as Assets[]).filter(function (arr) {
                return (arr.assetTypeId == assetTypeId)
            });

            let dual = filter.map((item) => {
                if (!item.description.toLowerCase().includes("piloto"))
                    return { "value": item.assetIdString, "label": item.description };
            }) as dualList[];

            setlstAssets(dual);

            setshowAssets(false);
            setshowDrivers(true);
        }
        else if (siteId != 0 && (reporte === "EOAPC" || reporte === "EOAPCV")) {

            let filters = (drivers as Drivers[]).filter(function (arr) {
                return (arr.SiteId == -6032794350987665724 || arr.SiteId == 6835483207492495255)
            });

            let dual = filters.map((item) => {
                return { "value": item.DriverIdString, "label": item.name };
            })  as dualList[];

            setlstDrivers(dual);

            setshowAssets(true);
            setshowDrivers(false);
        }
        if (siteId != 0 && assetTypeId != 0 && reporte === "EOAPCV") {
            setshowAssets(false);
            setshowDrivers(false);
        }
    }, [assetTypeId, siteId, reporte])

    function SelectAssets() {
        return (
            <DualListBox className=" mb-3 " canFilter  
                options={lstAssets}
                selected={selectedAssets}
                onChange={(selected: any) => setselectedAssets(selected)}
            />
        );
    }

    function SelectDrivers() {
        return (
            <DualListBox className=" mb-3 " canFilter 
                options={lstDrivers}
                selected={selectedDrivers}
                onChange={(selected: any) => setselectedDrivers(selected)}
            />
        );
    }

    useEffect(() => {
        if (reporte === "EOAPCV") {
        setselectedAssets([]);
        setselectedDrivers([]);
    }
     }, [assetTypeId, reporte])

    useEffect(() => {
       setassetSelected(selectedAssets.join());
       setdriverSelected(selectedDrivers.join());
    }, [selectedDrivers, selectedAssets])


    return (
        <>
            <div className="col-sm-12 col-md-12 col-xs-12" hidden={showAssets}>
                <label className="control-label label label-sm text-primary m-3" style={{ fontWeight: 'bold' }}>Seleccione Vehículos:</label>
                <SelectAssets />
            </div>
            <div className="col-sm-12 col-md-12 col-xs-12" hidden={showDrivers}>
                <label className="control-label label label-sm text-primary m-3" style={{ fontWeight: 'bold' }}>Seleccione Conductores:</label>
                <SelectDrivers />
            </div>
        </>
    )
}