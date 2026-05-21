import { useState } from "react";
import "./styles.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/SeccionLogin/Login";
import Registro from "./components/Registro";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
 

      <Login />

    </>
  );
}

export default App;
