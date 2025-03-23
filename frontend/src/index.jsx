import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalState from "./context";
import { ThemeProvider } from "next-themes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GlobalState>
          <App />
        </GlobalState>
      </ThemeProvider>
    </React.StrictMode>
  </BrowserRouter>
);

