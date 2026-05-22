import FormularioAltaReceta from "./FormularioAltaReceta";
import HeaderPanel from "./HeaderPanel";

const Panel = () => {
  return (
    <article class="panel large-panel">
      <HeaderPanel />
      <FormularioAltaReceta />
    </article>
  );
};

export default Panel;
