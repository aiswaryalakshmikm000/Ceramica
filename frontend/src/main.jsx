// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



//fornormal case
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// // import { store } from "./store";
// import App from "./App";


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );




// src/main.jsx   for the rtkquery
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; //provider connect the react and redux making all component to use the store
import App from "./App";
import store from "./app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>   
      <App />
  </Provider>
);
