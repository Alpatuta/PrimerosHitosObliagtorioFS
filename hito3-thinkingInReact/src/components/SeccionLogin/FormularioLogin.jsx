const FormularioLogin = () => {
  return (
    <>
      <form class="form">
        <div class="field">
          <label for="login-correo">Correo</label>
          <input
            id="login-correo"
            type="email"
            placeholder="usuario@mail.com"
          />
        </div>

        <div class="field">
          <label for="login-contrasenia">Contrasena</label>
          <input
            id="login-contrasenia"
            type="password"
            placeholder="Password1"
          />
        </div>

        <p class="form-message">
          El boton se habilitara cuando ambos campos sean validos.
        </p>

        <a class="button button-primary" href="#dashboard">
          Ingresar
        </a>
      </form>
    </>
  );
};

export default FormularioLogin;
