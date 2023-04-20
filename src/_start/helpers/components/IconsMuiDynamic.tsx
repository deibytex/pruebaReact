import * as Icons from '@mui/icons-material'
export const DrawDynamicIconMuiMaterial : React.FC<{ name: string, isactive:boolean }> = ({name, isactive}) => {
    const IconComponent  = Icons[name];
  
    if (!IconComponent) { // Return a default one
      return <Icons.Check />;
    }
  
    return <IconComponent color={`${isactive ? "success" : "primary"}`}/>;
  };
