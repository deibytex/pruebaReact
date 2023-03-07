import { useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import { useDataSotramac } from "../core/provider";
import { Assets, dualList } from "../models/dataModels";

type Props = {
    siteId: number,
    assetTypeId: number
}

export const SelectAssetsDrivers: React.FC<Props> = ({ siteId, assetTypeId }) => {

    const { assets } = useDataSotramac();


    const [lstAssets, setlstAssets] = useState<dualList[]>([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (assetTypeId != 0) {
            let filter = (assets as Assets[]).filter(function (arr) {
                return (arr.assetTypeId == assetTypeId)
            });

            let dual = filter.map((item) => {
                return { "value": item.assetId, "label": item.description };
            })

            setlstAssets(dual);
        }
        else {
            //al ser cero debemos poner todos los filtros por defecto y ocultar los menús
            setlstAssets([]);
        }
    }, [assetTypeId])


    function SelectAssets() {
        return (
            <DualListBox className=" mb-3 "
                options={lstAssets}
                selected={selected}
                onChange={(selected: any) => setSelected(selected)}
            />
        );
    }

    console.log(lstAssets);

    return (
        <div className="col-sm-12 col-md-12 col-xs-12">
            <label className="control-label label label-sm text-white m-3" style={{ fontWeight: 'bold' }}>Seleccione Vehículos:</label>
            <SelectAssets />
        </div>
    )
}