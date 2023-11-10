import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
// index.js or index.tsx
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { BrowserRouter as Router } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
    <App />
    </Provider>
)
