import "./i18n/i18n";

import { App as MessageApp } from "antd";
import { BrowserRouter } from "react-router-dom";

import { useAction } from "./app.hook";
import { AuthProvider } from "./hooks";
import { Router } from "./routes";

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
