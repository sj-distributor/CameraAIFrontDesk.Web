import "@/antd.css";
import "./i18n/i18n";

import { App as MessageApp } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BrowserRouter } from "react-router-dom";

import { useAction } from "./app-hook";
import { AuthProvider } from "./hooks";
import { Router } from "./routes";

dayjs.extend(utc);

function App() {
  const { isLoaded } = useAction();

  return (
    <BrowserRouter>
      <MessageApp>
        {isLoaded ? (
          <AuthProvider>
            <Router />
          </AuthProvider>
        ) : (
          <></>
        )}
      </MessageApp>
    </BrowserRouter>
  );
}

export default App;
