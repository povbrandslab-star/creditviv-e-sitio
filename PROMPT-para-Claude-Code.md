# Prompt para Claude Code · Sitio Creditviv-e

Copia todo lo que está debajo de la línea y pégalo en Claude Code, con la carpeta `creditviv-e-sitio` abierta en VS Code.

---

Vas a convertir los wireframes aprobados de Creditviv-e en un sitio web estático, navegable e interactivo, para publicarlo en GitHub Pages y compartirlo con el cliente.

## Qué hay en esta carpeta

- `html-limpio/`: las 5 páginas aprobadas, ya en HTML que abre en el navegador. Es tu punto de partida.
  - `index.html` · Inicio
  - `credito-vivienda.html`
  - `credito-vehiculo.html`
  - `asesorias-consumo.html`
  - `nosotros.html`
- `html-con-etiquetas/`: las mismas páginas con las notas internas del wireframe (texto verde en mayúsculas). Solo para consulta: explican la intención de cada bloque. Esas notas no van en el sitio.
- `fuente/`: los archivos originales del lienzo de diseño. No los edites.

## Lo que necesito

1. **Estructura limpia.** Pasa los estilos en línea a un `css/estilos.css` con clases reutilizables y variables CSS para colores, tipografía, espacios y radios. Header, navegación y footer deben ser iguales en las 5 páginas. Usa HTML, CSS y JavaScript sin frameworks ni paso de compilación, para que GitHub Pages lo sirva tal cual.
2. **No cambies los textos.** Respeta los textos, el orden de las secciones y la jerarquía tal como están. Si algo no se puede hacer sin cambiar un texto, pregúntame antes.
3. **Responsive.** Que se vea bien en escritorio (1440 px), tablet y móvil (390 px). En móvil, la navegación va en un menú desplegable accesible.
4. **Navegación.**
   - El menú principal y los botones «Conocer…» enlazan entre las 5 páginas.
   - Los botones que apuntan a una sección (`#simulador`, `#llamamos`, `#contacto`, etc.) hacen scroll suave a esa sección.
   - El ítem de la página actual queda marcado.
5. **Desplegables (documentos y preguntas frecuentes).** En el wireframe están abiertos para que se vea todo el contenido. En el sitio deben funcionar como acordeón: cerrados al cargar y se abren al hacer clic. Usa `<details>`/`<summary>` o un equivalente accesible.
6. **Simulador «Haga la cuenta con calma»** (en Inicio, Vivienda, Vehículo y Asesorías):
   - Convierte la tasa EA a tasa mensual: `(1 + EA)^(1/12) − 1`.
   - Calcula la cuota con el sistema de cuota fija: `cuota = P · i / (1 − (1 + i)^−n)`.
   - Calcula el porcentaje de ingresos que iría a deudas: `(cuotas actuales + cuota nueva) / ingresos`.
   - Muestra el mensaje «favorable» o «Hoy no alcanza…» según el porcentaje de referencia que aparece en la página. Si en alguna página no aparece, usa 40 % y déjalo en una sola constante fácil de cambiar.
   - Formato de pesos colombianos: `$ 1.480.000`.
   - La tasa de 24 % EA es editable. El botón «Ver mi resultado» calcula en el navegador.
   - «Enviarme el PDF»: por ahora solo valida los campos y la casilla de autorización, y muestra un mensaje de confirmación. Deja un comentario `TODO` donde irá el envío real (PDF y base de datos).
7. **Formulario «¿Prefiere que le llamemos?»** (en las 5 páginas):
   - Valida nombre, celular, correo y la casilla de autorización de datos.
   - La fecha «Hasta» no puede ser anterior a «Desde». La fecha «Desde» no puede ser anterior a hoy. No se permiten domingos.
   - La hora «Hasta las» debe ser posterior a «Desde las».
   - El horario permitido es de lunes a viernes de 8:00 a. m. a 5:00 p. m., y los sábados de 9:00 a. m. a 1:00 p. m. Si el rango elegido incluye un sábado, avisa que ese día solo se llama hasta la 1:00 p. m.
   - Al enviar: muestra una confirmación en la misma página y arma un mensaje de WhatsApp con los datos y la franja elegida, que termine en «(Web)».
   - Deja un `TODO` para conectar el envío real.
8. **WhatsApp.**
   - Todos los botones de WhatsApp abren `https://wa.me/NUMERO?text=...` con el mensaje precargado según el tema elegido. Cada mensaje termina en « (Web)».
   - Guarda el número en una sola constante con el valor `[NUMERO_POR_CONFIRMAR]`.
   - Donde hay un selector de tema, el mensaje cambia según la opción.
9. **Carrusel de bancos (Nosotros).** Desplazamiento infinito de derecha a izquierda. Se pausa al pasar el mouse y respeta `prefers-reduced-motion`.
10. **Tipografía.** IBM Plex Sans e IBM Plex Mono, desde Google Fonts.
11. **Accesibilidad.** Contraste AA, foco visible, etiquetas en todos los campos, `alt` o `aria-label` en los marcadores de imagen y áreas táctiles de al menos 44 px.
12. **Para GitHub Pages:**
    - Los archivos del sitio van en la raíz del repo, con `index.html` como inicio.
    - Usa solo rutas relativas.
    - Agrega un archivo `.nojekyll` vacío.
    - Agrega un `README.md` corto explicando cómo ver el sitio en local y cómo publicarlo.
    - Mueve las carpetas `fuente/`, `html-limpio/` y `html-con-etiquetas/` a una carpeta `referencia/`.

## Reglas de marca (no negociables)

- Tratamiento de «usted» en todos los textos.
- El nombre se escribe «Creditviv-e». «CREDIT VIV-E PRO» es el nombre del aplicativo y «CREDIT VIV-E S.A.S.» la razón social.
- Sin precios en ninguna parte.
- Nunca prometer aprobación, tasa, plazo ni eliminación de reportes.
- Un solo llamado a la acción principal por bloque.
- Paleta: #1C1C1B (texto y botones), #55554F (texto secundario), #F5F5F3 (fondos suaves), #D4D4CF (líneas), #FFFFFF. Radio de 4 px.
- Todo lo que está entre [corchetes] es un dato pendiente del cliente. Déjalo visible tal cual y haz un `PENDIENTES.md` con la lista de cada uno, indicando en qué página y en qué sección está.

## Cómo trabajar

- Empieza por el CSS compartido y el Inicio. Muéstrame el resultado antes de seguir con las otras 4 páginas.
- Al terminar, revisa que no queden enlaces rotos y que las 5 páginas se vean bien en 390 px y en 1440 px.
- Si tomas alguna decisión que no está aquí, anótala en el README.
