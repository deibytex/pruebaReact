import ReactDOM from "react-dom";
// Redux
// https://github.com/rt2zz/redux-persist
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import * as _redux from "./setup";
import store, { persistor } from "./setup/redux/Store";
// Axios
import axios from "axios";
// Apps
import { App } from "./app/App";
import "./_start/assets/sass/style.scss";
import "../node_modules/@availity/block-ui/src/BlockUi.css"
import "../node_modules/@availity/block-ui/src/Loader.css"
import 'rsuite/dist/rsuite.min.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';

import 'rsuite/dist/rsuite.min.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env;
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Start mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */

/* const mock = */ 
//_redux.mockAxios(axios);
/**
 * Inject Start interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
_redux.setupAxios(axios, store, null);

ReactDOM.render(
  <Provider store={store}>
    {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
    <PersistGate persistor={persistor} loading={<div>Cargando...</div>}>
      <App basename={PUBLIC_URL} />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
