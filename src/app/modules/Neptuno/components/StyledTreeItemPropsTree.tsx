import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { AddCircle, Download} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ButtonGroup, Button, ButtonToolbar, Modal } from 'react-bootstrap-v5';
import {  Form, Formik } from "formik";
import { DescargarArchivo } from '../data/dataNeptuno';


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
    tipoArchivo: string;
    src: string;
    handleshowFileLoad: ((arg0: boolean) => void);
    handlessetSrc: ((arg0: string) => void);
    container: string;
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

export function StyledTreeItem(props: StyledTreeItemProps) {


    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText, tipoArchivo, src, handleshowFileLoad, handlessetSrc, container,
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
                            {(tipoArchivo == "archivo") && (
                                <Formik
                                    initialValues={{

                                    }}
                                    onSubmit={
                                        values => {
                                            DescargarArchivo(src, container, "");
                                        }
                                    } >
                                    <Form>
                                        <Button className="btn btn-icon btn-sm fw-bolder" type='submit'> <Download /></Button>
                                    </Form>

                                </Formik>)

                            }{
                                (tipoArchivo == "carpeta") && (<button className='btn btn-icon btn-sm  fw-bolder' onClick={() => { handleshowFileLoad(true); handlessetSrc(src); }}  > <AddCircle /></button>)
                            }
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
