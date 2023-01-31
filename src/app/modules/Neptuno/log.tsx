import { useSelector } from 'react-redux';
import { RootState } from '../../../setup';
import { UserModelSyscaf } from '../auth/models/UserModel';
import { LogTable } from './components/Log/LogTable';
import { LogProvider, useDatLog } from './core/LogProvider';
import { UsuariosDTO } from './models/logModel';

export default function Logs(){
    const { Usuarios } = useDatLog();

  return(
    <>
      <LogProvider>
        <LogTable />
      </LogProvider>
    </>
  )
 
}