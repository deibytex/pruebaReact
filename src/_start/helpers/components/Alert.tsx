import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-bootstrap-v5';
import { AlertModal } from '../Models/AlertModel';


const initialValues = { variant: "success", showDefault: false, Title: "", Text: "" };

const CommonAlertContext = createContext({
    setError: (error: AlertModal) => { }
});

export const CommonAlertProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<AlertModal>(initialValues);
    return <CommonAlertContext.Provider value={{
        setError
    }}>
        <Alert show={error.showDefault}
            variant={error.variant} dismissible
            onClose={() => setError(initialValues)} >
            <Alert.Heading>{error.Title}</Alert.Heading>
            <p>
                {error.Text}
            </p>
        </Alert>

        {children}
    </CommonAlertContext.Provider>
}

export const useCommonAlert = () => useContext(CommonAlertContext);

