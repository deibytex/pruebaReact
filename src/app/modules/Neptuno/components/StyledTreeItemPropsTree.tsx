import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import { AddCircle, DeleteRounded, Download, Preview } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ButtonGroup, Button, ButtonToolbar, Modal } from 'react-bootstrap-v5';
import { DescargarArchivo, DescargarDirectorio, UpdateEstadoArchivo } from '../data/dataNeptuno';
import { neptunoDirectory } from '../models/neptunoDirectory';
import { EsPermitido, Operaciones, PermisosOpcion } from '../../../../_start/helpers/Axios/CoreService';
import confirmarDialog, { errorDialog, successDialog } from '../../../../_start/helpers/components/ConfirmDialog';
import { useDataNeptuno } from '../core/NeptunoProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../setup';
import { UserModelSyscaf } from '../../auth/models/UserModel';
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
    item: neptunoDirectory;
    handleshowFileLoad: ((arg0: boolean) => void);
    handlessetSrc: ((arg0: string) => void);
    container: string;
    ShowDocumentPdf: ((arg0: neptunoDirectory, arg1: string) => void);
    handlesdatosNeptuno : ((arg0: neptunoDirectory[]) => void);
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
    const {loader, setLoader, EsModificado, setEsModificado} = useDataNeptuno();
    const permisosOpcion = PermisosOpcion('Archivos ST');
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        item, handleshowFileLoad, handlessetSrc, container, ShowDocumentPdf, handlesdatosNeptuno,
        ...other
    } = props;

 // informacion del usuario almacenado en el sistema
 const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );
  
  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);


    return (
        <StyledTreeItemRoot className={bgColor}
            label={
                <Box className='' sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>

                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography className={`${(item.tipo == "archivo") ? 'fs-3 fw-bold' : 'fs-4'}`} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {item.nombre}
                    </Typography>

                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="sm-1 " aria-label="First group">
                            {(item.tipo == "archivo") && (
                                <>
                                    {(item.nombre.includes('.pdf') && EsPermitido(permisosOpcion, Operaciones.Descargar)) && (
                                        <Button className="btn btn-icon btn-sm fw-bolder "
                                            onClick={() => { ShowDocumentPdf(item, container); }}
                                        >   <Preview /></Button>
                                    )}
                                    {(EsPermitido(permisosOpcion, Operaciones.Descargar)) && (
                                        <Button className="btn btn-icon btn-sm fw-bolder" onClick={() => { DescargarArchivo(item.src, container, item.nombre); }}> <Download /></Button>
                                    )}
                                </>)
                            }{
                                (item.tipo == "carpeta" && EsPermitido(permisosOpcion, Operaciones.Adicionar)) && (<Button className='btn btn-icon btn-sm  fw-bolder bg-success' onClick={() => { handleshowFileLoad(true); handlessetSrc(item.src); }}  > <AddCircle /></Button>)
                            }
                            {(EsPermitido(permisosOpcion, Operaciones.Eliminar) && (item.tipo == "archivo")) && (
                                <Button className="btn btn-icon btn-sm fw-bolder bg-danger"
                                    onClick={() => {
                                        confirmarDialog(() => {
                                            setLoader(true) 
                                            UpdateEstadoArchivo(item.archivoId.toString(),model.Id, 3).then(() => {
                                                
                                                successDialog("Archivo Eliminado Exitosamente!", "");
                                                setLoader(false);
                                                (async () => {
                                                   
                                                    handlesdatosNeptuno(await DescargarDirectorio(container, ""));
                                                })()
                                            }).catch((e) => {
                                                errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");
                                                setLoader(false)
                                            });

                               }, `Está seguro que desea eliminar el archivo ${item.nombre}`)
                                    }}> <DeleteRounded /></Button>
                            )}

                        </ButtonGroup>
                    </ButtonToolbar>
                </Box>
            }

            {...other}
        />

    );
}
