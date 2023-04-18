import { PageTitle } from "../../layout/core";

interface propiedades {

}

export default function ReportesIFrame (titulo : string, url:string) {

    return (
        <>
        <PageTitle>{titulo}</PageTitle>
        <iframe src={url} height='100%' width='100%' ></iframe>
        </>
    )
}