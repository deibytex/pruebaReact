import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { AddCircle, Download, Edit, Folder, Archive } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Col, Container, Row, ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap-v5';
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { dataArchivos } from "./dataNeptuno"



// configuramos el thema que llevara el aplicativo, siempre en cada pagina se debe configurar para quitar elementos innecesarios que en la pagina en especifica
// no se necesite, como en este caso la barra de al lado , y que el menu se muestre en el lado izquierdo

import {   
    PageTitle,
  } from "../../../_start/layout/core";

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) { 

 

    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>

                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="sm-1 " aria-label="First group">
                            {/*<Link to="/"><AddCircle /></Link>
                            <Link to="/"><Edit /></Link>
                            <Link to="/"><Download /></Link>
                            <Link to="/"><InfoIcon /></Link>*/ }

                            <Link to="/download"><Download /></Link>
                            
                        </ButtonGroup>
                    </ButtonToolbar>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />

    );
}

// definimos los campos a recibir de las propiedades
type dataprops =  {
    id: number;
    tipo: string; nombre: string; src: string | null; hijos: Array<dataprops> | null;

};


// renderiza segun los datos el arbol de información
// este método es recursivo, hay que tener cuidado con realizar cambios 
// para que no quede en un ciclo infinito
function getComponetsFromData(props: dataprops) {
    // se definen las constantes que vienen de las propiedades
    const {
        id,
        tipo,
        nombre,
        src,
        hijos
    } = props;
    
    // si el item que viene tiene hijo, se vuelve a llamar la misma función para imprimir el resto de información 
    if (hijos != null && hijos.length > 0) {

        // retornamos el item a mostrar en el arbol, le asignamos un key ya que como se imprime dinamicamente
        // el sistema pide asignarle un key único que será tenido en cuenta en el aplicativo
        return (
            <StyledTreeItem key={`nept_tree_${id.toString()}_${nombre}`} nodeId={id.toString()} labelText={nombre} labelIcon={Folder} >
                {
                     hijos.map(
                        function(hijo, idx){                         

                           return getComponetsFromData( {
                                id: hijo.id,
                                tipo : hijo.tipo ,
                                nombre : hijo.nombre,
                                src : hijo.src,
                                hijos : hijo.hijos
                            })                          
                        }
                    )
                    
                }
            </StyledTreeItem>
        );
    }else{
        // archivo que se imprime al final con un icono diferente
        return (
            <StyledTreeItem key={`nept_tree_${id.toString()}_${nombre}`} nodeId={id.toString()} labelText={nombre} labelIcon={Archive} />               
        );

    }


}

export default function Neptuno() {

  
    return (
<>
<PageTitle>Neptuno App</PageTitle>
        <Container>
            <Row><Col>
            <label className='d-flex'> Bienvenidos a Neptuno, ayudante para tus descargas diarias</label>
            </Col></Row>
            <Row>
                <Col>
                    <Container>
                        <form
                            className="form w-100"
                            noValidate
                            id="nept_search_documents"                        >

                            {/* begin::Form group */}
                            <div className="v-row mb-10 fv-plugins-icon-container d-flex flex-row-reverse">
                            <button
                                    type="submit"
                                    id="nept_search_submit_button"
                                    className="btn btn-primary">
                                    <span className="indicator-label">Buscar</span>

                                </button>
                                {' '}
                                <input
                                    placeholder="Buscar"
                                    name="Buscar"
                                    autoComplete="off"
                                />
                              
                            </div>


                        </form>
                    </Container>
                </Col>


            </Row>
            <Row>
                <Col >

                    <TreeView
                        aria-label="gmail"
                        defaultExpanded={['3']}
                        defaultCollapseIcon={<ArrowDropDownIcon />}
                        defaultExpandIcon={<ArrowRightIcon />}
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        sx={{ height: 264, flexGrow: 1, overflowY: 'auto' }}
                    >
                       
                        {

                            dataArchivos.map(function (item, indx) {
                                     let nodeid = indx + 25;   
                                return (
                                    <StyledTreeItem key={item.id.toString()} nodeId={nodeid.toString()} labelText={item.nombre} labelIcon={Folder} >
                                         {
                                          
                                                item.hijos.map(
                                                    function(hijo, idx){
                                                      

                                                       return getComponetsFromData( {
                                                            id: hijo.id,
                                                            tipo : hijo.tipo ,
                                                            nombre : hijo.nombre,
                                                            src : hijo.src,
                                                            hijos : hijo.hijos
                                                        })

                                                      
                                                    }
                                                )
                                                 }   

                                    </StyledTreeItem>
                                )
                            })

                        }


                    </TreeView>
                </Col>

            </Row>
        </Container>
        </>
    );
}
