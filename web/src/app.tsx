import "./i18n/i18n";

import { BrowserRouter } from "react-router-dom";

import { useAction } from "./app.hook";
import { AuthProvider } from "./hooks";
import { Router } from "./routes";

function App() {
  const { isLoaded } = useAction();

  return (
    <BrowserRouter>
      {isLoaded ? (
        <AuthProvider>
          <Router />
        </AuthProvider>
      ) : (
        <></>
      )}
    </BrowserRouter>
  );
}

export default App;
