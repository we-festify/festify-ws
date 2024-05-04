import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/index.tsx";
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="festify-ws-ui-theme">
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);
