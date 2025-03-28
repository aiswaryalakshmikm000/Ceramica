import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; //provider connect the react and redux making all component to use the store
import App from "./App";
import store from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>  
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider> 
  </Provider>
);
