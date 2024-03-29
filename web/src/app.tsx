import "@/antd.css";
import "./i18n/i18n";

import { App as MessageApp } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BrowserRouter } from "react-router-dom";

import { useAction } from "./app-hook";
import { AuthProvider } from "./hooks";
import { Router } from "./routes";
import { useEffect } from "react";

dayjs.extend(utc);

function App() {
  const { isLoaded } = useAction();
  var myIframe = document.getElementById("myIframe");
  const token = localStorage.getItem((window as any).appsettings?.tokenKey);

  useEffect(() => {
    if (isLoaded && myIframe && token) {
      (myIframe as any).contentWindow.postMessage(
        token,
        (window as any).appsettings?.cameraAIBackstageDomain
      );
    }
  }, [isLoaded, myIframe, token]);

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
        <iframe
          id="myIframe"
          src={(window as any).appsettings?.cameraAIBackstageDomain}
          style={{ display: "none" }}
        />
      </MessageApp>
    </BrowserRouter>
  );
}

export default App;
