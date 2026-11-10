# Creditviv-e · sitio web

Sitio estático (HTML, CSS y JavaScript, sin frameworks ni compilación) hecho a partir de los wireframes aprobados.

## Verlo en local

Abra `index.html` con doble clic. Todo funciona sin servidor.

## Publicarlo en GitHub Pages

1. Haga commit y push a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment**, elija la rama `main` y la carpeta `/ (root)`, y guarde.
3. En uno o dos minutos aparece el link `https://SU-USUARIO.github.io/creditviv-e-sitio/`.

## Estructura

```
index.html                Inicio
credito-vivienda.html     Crédito de vivienda
credito-vehiculo.html     Crédito de vehículo
asesorias-consumo.html    Asesorías y consumo
nosotros.html             Nosotros
css/estilos.css           estilos compartidos y variables (colores, tipografía, espacios, radio)
js/sitio.js               menú móvil, WhatsApp, simulador y formulario de llamada
referencia/               wireframes originales; no se publican como páginas del sitio
PENDIENTES.md             datos que faltan del cliente
.nojekyll                 para que GitHub Pages sirva los archivos tal cual
```

## Dónde se cambian los datos

En `js/sitio.js`, bloque `CONFIG` al inicio:

- `WHATSAPP_NUMERO`: hoy dice `[NUMERO_POR_CONFIRMAR]`. Va en formato internacional, solo dígitos (ej.: `573001234567`).
- `REFERENCIA_DEUDA`: 0,40 (40 %) si la página no trae su propia referencia.
- `PLAZO_POR_DEFECTO`: plazo que usa el simulador mientras los plazos no estén confirmados.
- `HORARIO`: horario de llamadas (lunes a viernes de 8 a 17 h, sábados de 9 a 13 h).

Los mensajes precargados de WhatsApp están en cada botón, en el atributo `data-wa`. El sistema agrega « (Web)» al final.

## Decisiones tomadas (no estaban en el encargo)

- **Menú móvil:** por debajo de 760 px aparece un botón «Menú» que abre la navegación. Es el único rótulo nuevo de la interfaz.
- **Enlaces del Inicio:** en el wireframe, «Vivienda», «Vehículo» y «Consumo» del menú de la portada y la tarjeta «Ver crédito de vivienda» apuntaban a `#servicios`. Ahora llevan a la página de cada servicio. «Asesorías financieras» sigue bajando a la sección del Inicio.
- **Botones que abren WhatsApp:** «Revisar mi caso por WhatsApp», «Quiero referir clientes» y los cuatro botones del cierre (Vivienda, Vehículo, Consumo, Asesorías). Cada uno lleva su propio mensaje. Si el navegador no tiene JavaScript, bajan a la sección de contacto.
- **Guías:** mientras el cliente no las entregue, se muestran como texto y no como enlace, para no dejar enlaces rotos.
- **Política de tratamiento de datos:** el enlace no lleva a ninguna parte hasta que haya URL (ver `PENDIENTES.md`).
- **Simulador:**
  - Al cargar muestra las cifras de ejemplo del wireframe con el rótulo «Su resultado · cifras de ejemplo». Al calcular, el rótulo cambia a «Su resultado» y aparece el mensaje «favorable» o «Hoy no alcanza…».
  - La barra se llena en proporción a la referencia (lleno = 40 % o más).
  - «Tipo de crédito», «¿Qué quiere financiar?» y «Moneda» no cambian el cálculo. Con UVR se calcula igual que en pesos: es una simulación orientativa.
  - Si se escribe el valor del bien, el crédito no puede superarlo.
  - «Enviarme el PDF» exige haber calculado antes.
- **Formulario de llamada:**
  - Las fechas se precargan con el próximo día hábil y tres días después, para que nunca arranquen en el pasado. El texto de ejemplo del wireframe se conserva tal cual.
  - El aviso del sábado aparece en cuanto el rango incluye un sábado. Si el rango tiene solo sábados (y domingos) y la franja queda fuera de 9:00 a. m. a 1:00 p. m., no se deja enviar.
  - Al enviar, la confirmación aparece en la misma página con un botón «Enviar mi solicitud por WhatsApp» que abre el mensaje armado.
- **Pie de página:** es igual en las 5 páginas. Se usó el del Inicio, que incluye «[ Canales oficiales ]».
- **Cierres con selector de tema** (Vivienda, Vehículo, Nosotros): el botón «Escribir por WhatsApp» cambia el mensaje según la opción elegida.
- **Plazos sin confirmar** (Vehículo y Asesorías): el simulador calcula a 60 meses hasta que el cliente confirme los plazos.
- **Nosotros:** el rótulo «Lo que sí hacemos» pasó de verde a gris oscuro, para respetar la paleta. El carrusel se detiene al pasar el mouse o al recibir el foco, y con «reducir movimiento» queda quieto y se desliza a mano.
- **Textos nuevos:** los mensajes de error y de confirmación de los formularios son nuevos (no existían en el wireframe). Están escritos con «usted».
- **Colores:** además de los cinco de la paleta, se conservan los neutros de apoyo que ya traía el wireframe (fondos de foto, textos sobre fondo oscuro). El borde de los campos se oscureció un poco (#8C8C86) para que cumpla contraste AA.
- **Accesibilidad:** enlace «Ir al contenido», foco visible en fondo claro y oscuro, etiquetas en todos los campos, errores anunciados por lector de pantalla y áreas táctiles de 44 px o más.
