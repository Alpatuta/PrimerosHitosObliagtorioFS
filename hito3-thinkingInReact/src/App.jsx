import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Registro from "./components/Registro";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Dashboard />

      <Login />

      <Registro />
    </>
  );
}

export default App;
