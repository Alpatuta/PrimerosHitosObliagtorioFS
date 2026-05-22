const PanelUso = () => {
  return (
    <aside class="panel usage-panel">
      <p class="eyebrow">Informe de uso</p>
      <h2>Plan plus</h2>
      <div class="usage-ring" aria-hidden="true">
        <span>75%</span>
      </div>
      <p class="muted">3 de 4 recetas disponibles utilizadas.</p>
      <button class="button button-secondary" type="button">
        Cambiar a premium
      </button>
    </aside>
  );
};

export default PanelUso;
