import { ToggleColorMode, Views } from "./components";
import { AuthProvider } from "./contexts/auth.context";

function App() {
  return (
    <AuthProvider>
      <ToggleColorMode />
      <Views />
    </AuthProvider>
  );
}

export default App;
