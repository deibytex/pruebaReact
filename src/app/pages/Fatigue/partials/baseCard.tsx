import { Button, Card, Nav } from "react-bootstrap-v5";
import { string } from "yup";

type CardOptions =
{
    titulo: string;

}

export default function CardContainer()
{
    return ( <Card>
        <Card.Header as="h5"  >Evento</Card.Header>
        <Card.Body>
          
        <Nav variant="tabs" defaultActiveKey="#first">
          <Nav.Item>
            <Nav.Link href="#first">Videos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#link">Localizacion</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#disabled" disabled>
             Detalles
            </Nav.Link>
          </Nav.Item>
        </Nav>
     
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>);
}


