const state = {
  token: "",
  categoriaId: "",
  ingredienteId: "",
  recetaId: "",
  reviewId: "",
  imagenUrl: "",
};

let runId = "";
let datos = {};

const makeRunId = () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}${random}`;
};

const buildDatos = (id) => ({
  usuario: {
    nombre: `Usuario Hito ${id}`,
    correo: `hito1.${id}@mail.com`,
    contrasenia: "Password1",
    confirmarContrasenia: "Password1",
    plan: "plus",
    rol: "admin",
  },
  categoria: {
    nombre: `Categoria Hito ${id}`,
    descripcion: "Categoria fija creada desde el hito 1",
  },
  ingrediente: {
    nombre: `Chicken ${id}`,
    cantidad: 2,
    unidad: "unidades",
  },
});

const resetScenario = () => {
  state.token = "";
  state.categoriaId = "";
  state.ingredienteId = "";
  state.recetaId = "";
  state.reviewId = "";
  state.imagenUrl = "";
  runId = makeRunId();
  datos = buildDatos(runId);
};

const logOutput = document.querySelector("#logOutput");
const stateOutput = document.querySelector("#stateOutput");
const baseUrlInput = document.querySelector("#baseUrl");
const fullFlowButton = document.querySelector("#btnFullFlow");
const clearButton = document.querySelector("#btnClear");

const getBaseUrl = () => baseUrlInput.value.replace(/\/$/, "");

const printState = () => {
  stateOutput.textContent = JSON.stringify(state, null, 2);
};

const log = (title, data) => {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  logOutput.textContent += `\n\n=== ${title} ===\n${text}`;
  logOutput.scrollTop = logOutput.scrollHeight;
  printState();
};

const clearLog = () => {
  logOutput.textContent = "Listo para probar.";
  printState();
};

const request = async (method, path, options = {}) => {
  const { body, auth = true, formData } = options;
  const headers = {};

  if (auth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  });

  const rawText = await response.text();
  let data;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = rawText;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || rawText || "Error en la peticion";
    throw new Error(`${response.status} ${message}`);
  }

  return {
    status: response.status,
    data,
  };
};

const step = async (label, action, options = {}) => {
  try {
    log(label, "Enviando peticion...");
    const result = await action();
    log(label, result);
    return result;
  } catch (error) {
    log(`${label} - ERROR`, error.message);
    if (options.required) {
      throw error;
    }
    return null;
  }
};

const requireValue = (value, message) => {
  if (!value) {
    throw new Error(message);
  }
};

const recetaBody = () => {
  requireValue(state.categoriaId, "Primero tenes que crear una categoria.");

  return {
    titulo: `Receta Hito ${runId}`,
    descripcion: "Receta fija para probar el alta, consulta y edicion desde AJAX.",
    ingredientes: ["chicken", "sal", "aceite"],
    pasos: ["Preparar ingredientes", "Cocinar a fuego medio", "Servir caliente"],
    dificultad: "Fácil",
    categoria: state.categoriaId,
    imagen: state.imagenUrl || "https://placehold.co/600x400?text=Hito+1",
  };
};

const register = async () => {
  if (state.token || state.categoriaId || state.ingredienteId || state.recetaId || state.reviewId) {
    throw new Error("Para registrar otro usuario, usa 'Ejecutar flujo completo' o recarga la pagina.");
  }

  const result = await request("POST", "/auth/register", {
    auth: false,
    body: datos.usuario,
  });

  state.token = result.data.token;
  return result;
};

const login = async () => {
  const result = await request("POST", "/auth/login", {
    auth: false,
    body: {
      correo: datos.usuario.correo,
      contrasenia: datos.usuario.contrasenia,
    },
  });

  state.token = result.data.token;
  return result;
};

const createCategory = async () => {
  const result = await request("POST", "/categorias", {
    body: datos.categoria,
  });

  state.categoriaId = result.data.categoria._id;
  return result;
};

const getCategories = () => request("GET", "/categorias");

const getCategoryById = () => {
  requireValue(state.categoriaId, "Primero tenes que crear una categoria.");
  return request("GET", `/categorias/${state.categoriaId}`);
};

const updateCategory = () => {
  requireValue(state.categoriaId, "Primero tenes que crear una categoria.");
  return request("PATCH", `/categorias/${state.categoriaId}`, {
    body: {
      nombre: `${datos.categoria.nombre} editada`,
      descripcion: "Categoria editada desde el hito 1",
    },
  });
};

const deleteCategory = () => {
  requireValue(state.categoriaId, "Primero tenes que crear una categoria.");
  return request("DELETE", `/categorias/${state.categoriaId}`);
};

const createIngredient = async () => {
  const result = await request("POST", "/ingredientes", {
    body: datos.ingrediente,
  });

  state.ingredienteId = result.data.ingrediente._id;
  return result;
};

const getIngredients = () => request("GET", "/ingredientes");

const getIngredientById = () => {
  requireValue(state.ingredienteId, "Primero tenes que crear un ingrediente.");
  return request("GET", `/ingredientes/${state.ingredienteId}`);
};

const updateIngredient = () => {
  requireValue(state.ingredienteId, "Primero tenes que crear un ingrediente.");
  return request("PATCH", `/ingredientes/${state.ingredienteId}`, {
    body: {
      nombre: `Chicken editado ${runId}`,
      cantidad: 3,
      unidad: "unidades",
    },
  });
};

const deleteIngredient = () => {
  requireValue(state.ingredienteId, "Primero tenes que crear un ingrediente.");
  return request("DELETE", `/ingredientes/${state.ingredienteId}`);
};

const uploadImage = async () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
      <rect width="100%" height="100%" fill="#2f57d7"/>
      <text x="50%" y="50%" fill="white" font-size="42" font-family="Arial"
        text-anchor="middle" dominant-baseline="middle">Hito 1</text>
    </svg>
  `;

  const file = new File([svg], `hito-${runId}.svg`, { type: "image/svg+xml" });
  const formData = new FormData();
  formData.append("imagen", file);
  formData.append("folder", "hito1-ajax");

  const result = await request("POST", "/uploads", {
    formData,
  });

  state.imagenUrl = result.data.url;
  return result;
};

const createRecipe = async () => {
  const result = await request("POST", "/recetas", {
    body: recetaBody(),
  });

  state.recetaId = result.data.receta._id;
  return result;
};

const getRecipes = () => request("GET", "/recetas?page=1&limit=10");

const getRecipeById = () => {
  requireValue(state.recetaId, "Primero tenes que crear una receta.");
  return request("GET", `/recetas/${state.recetaId}`);
};

const updateRecipe = () => {
  requireValue(state.recetaId, "Primero tenes que crear una receta.");

  return request("PATCH", `/recetas/${state.recetaId}`, {
    body: {
      ...recetaBody(),
      titulo: `Receta Hito ${runId} editada`,
      descripcion: "Receta editada desde AJAX manteniendo categoria e imagen.",
      dificultad: "Media",
    },
  });
};

const getCombinedRecipes = () => request("GET", "/recetas/combinadas?ing1=chicken&ing2=sal");

const createRecipeWithAi = async () => {
  requireValue(state.categoriaId, "Primero tenes que crear una categoria.");

  const result = await request("POST", "/recetas/ia", {
    body: {
      ingredientes: ["chicken", "sal"],
      dificultad: "Fácil",
      categoria: state.categoriaId,
    },
  });

  return result;
};

const adaptRecipeWithAi = () => {
  requireValue(state.recetaId, "Primero tenes que crear una receta.");

  return request("POST", `/recetas/${state.recetaId}/adaptar`, {
    body: {
      tipo: "vegetarian",
    },
  });
};

const createReview = async () => {
  requireValue(state.recetaId, "Primero tenes que crear una receta.");

  const result = await request("POST", "/reviews", {
    body: {
      comentario: "Review fija creada desde el hito 1",
      calificacion: 5,
      receta: state.recetaId,
    },
  });

  state.reviewId = result.data.review._id;
  return result;
};

const getReviewById = () => {
  requireValue(state.reviewId, "Primero tenes que crear una review.");
  return request("GET", `/reviews/${state.reviewId}`);
};

const getReviewsByRecipe = () => {
  requireValue(state.recetaId, "Primero tenes que crear una receta.");
  return request("GET", `/reviews/receta/${state.recetaId}`);
};

const getMyReviews = () => request("GET", "/reviews/usuario/me");

const updateReview = () => {
  requireValue(state.reviewId, "Primero tenes que crear una review.");

  return request("PATCH", `/reviews/${state.reviewId}`, {
    body: {
      comentario: "Review editada desde el hito 1",
      calificacion: 4,
    },
  });
};

const deleteReview = () => {
  requireValue(state.reviewId, "Primero tenes que crear una review.");
  return request("DELETE", `/reviews/${state.reviewId}`);
};

const changePlan = () => request("PATCH", "/usuarios/cambiar-plan");

const getAiModels = () => request("GET", "/ai");

const askAi = () =>
  request("POST", "/ai", {
    body: {
      prompt: "Respondeme en una frase que la conexion AJAX funciona.",
    },
  });

const actions = {
  register,
  login,
  createCategory,
  createIngredient,
  uploadImage,
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  getCombinedRecipes,
  createReview,
  getReviewById,
  getReviewsByRecipe,
  getMyReviews,
  updateReview,
  changePlan,
  getAiModels,
  askAi,
  createRecipeWithAi,
  adaptRecipeWithAi,
  deleteReview,
  deleteRecipe: () => {
    requireValue(state.recetaId, "Primero tenes que crear una receta.");
    return request("DELETE", `/recetas/${state.recetaId}`);
  },
  deleteIngredient,
  deleteCategory,
};

const runFullFlow = async () => {
  fullFlowButton.disabled = true;
  clearLog();
  resetScenario();
  log("Nuevo escenario", {
    runId,
    correo: datos.usuario.correo,
  });

  try {
    await step("1. Registro", register, { required: true });
    await step("2. Login", login, { required: true });

    await step("3. Crear categoria", createCategory, { required: true });
    await step("4. Listar categorias", getCategories);
    await step("5. Categoria por ID", getCategoryById);
    await step("6. Editar categoria", updateCategory);

    await step("7. Crear ingrediente", createIngredient, { required: true });
    await step("8. Listar ingredientes", getIngredients);
    await step("9. Ingrediente por ID", getIngredientById);
    await step("10. Editar ingrediente", updateIngredient);

    await step("11. Subir imagen", uploadImage);

    await step("12. Crear receta", createRecipe, { required: true });
    await step("13. Listar recetas", getRecipes);
    await step("14. Receta por ID", getRecipeById);
    await step("15. Editar receta", updateRecipe);
    await step("16. Recetas combinadas", getCombinedRecipes);

    await step("17. Crear review", createReview, { required: true });
    await step("18. Review por ID", getReviewById);
    await step("19. Reviews por receta", getReviewsByRecipe);
    await step("20. Reviews del usuario", getMyReviews);
    await step("21. Editar review", updateReview);

    await step("22. Cambiar plan", changePlan);
    await step("23. GET IA", getAiModels);
    await step("24. POST IA", askAi);
    await step("25. Crear receta con IA", createRecipeWithAi);
    await step("26. Adaptar receta con IA", adaptRecipeWithAi);

    await step("27. Eliminar review", deleteReview);
    await step("28. Eliminar receta", actions.deleteRecipe);
    await step("29. Eliminar ingrediente", deleteIngredient);
    await step("30. Eliminar categoria", deleteCategory);

    log("FIN", "Flujo completo terminado.");
  } finally {
    fullFlowButton.disabled = false;
  }
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const actionName = button.dataset.action;
  const action = actions[actionName];

  if (!action) {
    log("Accion no encontrada", actionName);
    return;
  }

  button.disabled = true;
  await step(actionName, action);
  button.disabled = false;
});

fullFlowButton.addEventListener("click", runFullFlow);
clearButton.addEventListener("click", clearLog);

resetScenario();
printState();
