import "@/antd.css";
import "./i18n/i18n";

import { ConfigProvider, App as MessageApp } from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/zh_CN";
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
          <ConfigProvider
            locale={locale}
            theme={{ token: { colorPrimary: "#2866F1" } }}
          >
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ConfigProvider>
        ) : (
          <></>
        )}
      </MessageApp>
    </BrowserRouter>
  );
}

export default App;
