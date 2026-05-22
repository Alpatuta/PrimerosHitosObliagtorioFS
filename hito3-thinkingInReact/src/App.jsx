import { useState } from "react";
import "./styles.css";
//import Dashboard from "./components/Dashboard";
import Login from "./components/SeccionLogin/Login";
import Registro from "./components/SeccionRegistro/Registro";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="spa-root">
      <main className="spa-stage">
        <Login />
        <Registro />
      </main>
    </div>
  );
}

export default App;
