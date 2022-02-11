import ReactDOM from "react-dom";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";

import "@stellar/design-system/build/styles.min.css";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
