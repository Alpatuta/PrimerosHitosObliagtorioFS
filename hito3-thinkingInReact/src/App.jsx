import { useState } from "react";
import "./styles.css";
//import Dashboard from "./components/Dashboard";
import Login from "./components/SeccionLogin/Login";
//import Registro from "./components/Registro";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="spa-root">
      <main className="spa-stage">
        <section
          id="login"
          className="screen screen-auth"
          aria-labelledby="login-title"
        >
          <div className="spa-stage">
            <Login />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
