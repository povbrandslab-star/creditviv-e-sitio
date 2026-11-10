/* ==========================================================================
   Creditviv-e · comportamiento compartido
   Sin dependencias. Se carga con «defer» en las 5 páginas.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Configuración (cambiar aquí) ---------- */
  var CONFIG = {
    // Número de WhatsApp en formato internacional, solo dígitos (ej.: 573001234567).
    WHATSAPP_NUMERO: '[NUMERO_POR_CONFIRMAR]',
    // Sufijo que identifica los mensajes que llegan desde el sitio.
    SUFIJO_WEB: ' (Web)',
    // Porcentaje de ingresos de referencia para el simulador, si la página no trae uno.
    REFERENCIA_DEUDA: 0.40,
    // Plazo en meses que usa el simulador cuando la página aún no tiene plazos confirmados.
    PLAZO_POR_DEFECTO: 60,
    // Horario de llamadas (horas en formato 24 h).
    HORARIO: {
      semana: { desde: 8, hasta: 17 },   // lunes a viernes
      sabado: { desde: 9, hasta: 13 }    // sábados
    }
  };

  document.documentElement.classList.add('js');

  /* ---------- Utilidades ---------- */
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function enlaceWhatsApp(mensaje) {
    var texto = mensaje.replace(/\s*\(Web\)\s*$/, '') + CONFIG.SUFIJO_WEB;
    return 'https://wa.me/' + encodeURIComponent(CONFIG.WHATSAPP_NUMERO) + '?text=' + encodeURIComponent(texto);
  }

  function pesos(valor) {
    var entero = Math.round(valor);
    var signo = entero < 0 ? '-' : '';
    return '$ ' + signo + String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function leerPesos(texto) {
    var digitos = String(texto || '').replace(/\D/g, '');
    return digitos ? parseInt(digitos, 10) : NaN;
  }

  function leerPorcentaje(texto) {
    var limpio = String(texto || '').replace(/[^\d,.]/g, '').replace(',', '.');
    return limpio ? parseFloat(limpio) : NaN;
  }

  function fechaLocal(iso) {
    if (!iso) return null;
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function aIso(fecha) {
    var m = String(fecha.getMonth() + 1).padStart(2, '0');
    var d = String(fecha.getDate()).padStart(2, '0');
    return fecha.getFullYear() + '-' + m + '-' + d;
  }

  function hoy() {
    var h = new Date();
    return new Date(h.getFullYear(), h.getMonth(), h.getDate());
  }

  function sumarDias(fecha, dias) {
    var f = new Date(fecha);
    f.setDate(f.getDate() + dias);
    return f;
  }

  function fechaLarga(fecha) {
    return fecha.getDate() + ' de ' + MESES[fecha.getMonth()];
  }

  /* Agrega punto final solo si el texto no termina ya en punto (ej.: «p. m.»). */
  function conPunto(t) { return /\.$/.test(t) ? t : t + '.'; }

  function rangoFechas(a, b) {
    if (a.getTime() === b.getTime()) return 'el ' + fechaLarga(a);
    if (a.getMonth() === b.getMonth()) return 'entre el ' + a.getDate() + ' y el ' + fechaLarga(b);
    return 'entre el ' + fechaLarga(a) + ' y el ' + fechaLarga(b);
  }

  function horaTexto(h) {
    if (h === 12) return '12:00 m.';
    return (h > 12 ? h - 12 : h) + ':00 ' + (h < 12 ? 'a. m.' : 'p. m.');
  }

  /* Errores de campo accesibles */
  var contadorErrores = 0;
  function marcarError(input, mensaje) {
    limpiarError(input);
    var id = 'error-' + (++contadorErrores);
    var p = document.createElement('p');
    p.className = 'error-campo';
    p.id = id;
    p.textContent = mensaje;
    var ancla = input.closest('label') || input;
    ancla.insertAdjacentElement('afterend', p);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', id);
  }
  function limpiarError(input) {
    var id = input.getAttribute('aria-describedby');
    if (id) {
      var viejo = document.getElementById(id);
      if (viejo && viejo.classList.contains('error-campo')) viejo.remove();
    }
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  function limpiarErrores(form) {
    form.querySelectorAll('[aria-invalid]').forEach(limpiarError);
  }

  function correoValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function celularValido(v) {
    var d = v.replace(/\D/g, '');
    return d.length >= 7 && d.length <= 15;
  }

  /* Valida nombre, celular, correo y autorización. Devuelve el primer campo con error. */
  function validarContacto(form) {
    var primero = null;
    function falla(campo, msg) { marcarError(campo, msg); if (!primero) primero = campo; }

    var nombre = form.querySelector('[data-campo="nombre"]');
    var celular = form.querySelector('[data-campo="celular"]');
    var correo = form.querySelector('[data-campo="correo"]');
    var autoriza = form.querySelector('[data-campo="autorizacion"]');

    if (nombre && nombre.value.trim().length < 2) falla(nombre, 'Escriba su nombre.');
    if (celular && !celularValido(celular.value)) falla(celular, 'Escriba un número de celular o WhatsApp válido.');
    if (correo && !correoValido(correo.value.trim())) falla(correo, 'Escriba un correo electrónico válido, por ejemplo nombre@correo.com.');
    if (autoriza && !autoriza.checked) falla(autoriza, 'Para continuar, autorice el tratamiento de sus datos.');
    return primero;
  }

  /* ---------- 1. Menú móvil ---------- */
  var botonMenu = document.querySelector('.nav-boton');
  var menu = document.getElementById('nav-principal');
  if (botonMenu && menu) {
    function cerrarMenu(devolverFoco) {
      menu.classList.remove('esta-abierto');
      botonMenu.setAttribute('aria-expanded', 'false');
      if (devolverFoco) botonMenu.focus();
    }
    botonMenu.addEventListener('click', function () {
      var abrir = botonMenu.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('esta-abierto', abrir);
      botonMenu.setAttribute('aria-expanded', String(abrir));
      if (abrir) { var a = menu.querySelector('a'); if (a) a.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('esta-abierto')) cerrarMenu(true);
    });
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('esta-abierto')) return;
      if (!menu.contains(e.target) && !botonMenu.contains(e.target)) cerrarMenu(false);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu(false);
    });
  }

  /* ---------- 2. Enlaces de WhatsApp ----------
     data-wa="mensaje"                 → mensaje fijo
     data-wa-select="#id-del-select"   → toma el data-mensaje de la opción elegida */
  function actualizarWhatsApp(enlace) {
    var mensaje = enlace.getAttribute('data-wa') || '';
    var selector = enlace.getAttribute('data-wa-select');
    if (selector) {
      var select = document.querySelector(selector);
      var opcion = select && select.options[select.selectedIndex];
      if (opcion) mensaje = opcion.getAttribute('data-mensaje') || ('Hola, quiero hablar sobre ' + opcion.text.toLowerCase() + '.');
    }
    enlace.href = enlaceWhatsApp(mensaje);
    enlace.target = '_blank';
    enlace.rel = 'noopener';
  }
  document.querySelectorAll('[data-wa], [data-wa-select]').forEach(function (enlace) {
    actualizarWhatsApp(enlace);
    var selector = enlace.getAttribute('data-wa-select');
    if (selector) {
      var select = document.querySelector(selector);
      if (select) select.addEventListener('change', function () { actualizarWhatsApp(enlace); });
    }
  });

  /* ---------- 3. Campos de pesos: formato mientras se escribe ---------- */
  document.querySelectorAll('[data-pesos]').forEach(function (input) {
    input.addEventListener('input', function () {
      var n = leerPesos(input.value);
      input.value = isNaN(n) ? '' : pesos(n);
    });
  });

  /* ---------- 4. Simulador «Haga la cuenta con calma» ---------- */
  document.querySelectorAll('[data-simulador]').forEach(function (raiz) {
    var form = raiz.querySelector('[data-sim-form]');
    var salida = raiz.querySelector('[data-sim-resultado]');
    if (!form || !salida) return;

    var referencia = parseFloat(raiz.getAttribute('data-referencia')) || CONFIG.REFERENCIA_DEUDA;
    var el = {
      etiqueta: salida.querySelector('[data-sim-etiqueta]'),
      cuota: salida.querySelector('[data-sim-cuota]'),
      pct: salida.querySelector('[data-sim-pct]'),
      barra: salida.querySelector('[data-sim-barra]'),
      fav: salida.querySelector('[data-sim-favorable]'),
      no: salida.querySelector('[data-sim-noalcanza]')
    };
    var campo = function (n) { return form.querySelector('[data-sim="' + n + '"]'); };
    raiz.ultimoResultado = null;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limpiarErrores(form);
      var primero = null;
      function falla(c, m) { marcarError(c, m); if (!primero) primero = c; }

      var cIngresos = campo('ingresos'), cCuotas = campo('cuotas'), cCredito = campo('credito'),
          cValor = campo('valor'), cTasa = campo('tasa'), cPlazo = campo('plazo');

      var ingresos = leerPesos(cIngresos.value);
      var cuotas = cCuotas.value.trim() === '' ? 0 : leerPesos(cCuotas.value);
      var credito = leerPesos(cCredito.value);
      var valor = cValor ? leerPesos(cValor.value) : NaN;
      var ea = leerPorcentaje(cTasa.value);
      var plazo = parseInt(cPlazo.value, 10);
      if (isNaN(plazo)) plazo = parseInt(cPlazo.getAttribute('data-plazo-defecto'), 10) || CONFIG.PLAZO_POR_DEFECTO;

      if (!(ingresos > 0)) falla(cIngresos, 'Escriba sus ingresos mensuales.');
      if (isNaN(cuotas) || cuotas < 0) falla(cCuotas, 'Escriba el valor de las cuotas que paga hoy, o 0 si no tiene.');
      if (!(credito > 0)) falla(cCredito, 'Escriba el valor del crédito que necesita.');
      if (cValor && valor > 0 && credito > valor) falla(cCredito, 'El valor del crédito no puede ser mayor que el valor del bien.');
      if (!(ea > 0 && ea < 200)) falla(cTasa, 'Escriba una tasa efectiva anual válida, por ejemplo 24 %.');
      if (primero) { primero.focus(); return; }

      // Tasa EA → tasa mensual: (1 + EA)^(1/12) − 1
      var i = Math.pow(1 + ea / 100, 1 / 12) - 1;
      // Cuota fija: P · i / (1 − (1 + i)^−n)
      var cuota = credito * i / (1 - Math.pow(1 + i, -plazo));
      // Porcentaje de ingresos que iría a deudas
      var pct = (cuotas + cuota) / ingresos;
      var favorable = pct <= referencia;

      el.etiqueta.textContent = 'Su resultado';
      el.cuota.textContent = pesos(cuota);
      el.pct.textContent = Math.round(pct * 100) + ' %';
      if (el.barra) el.barra.style.width = Math.min(pct / referencia, 1) * 100 + '%';
      el.fav.hidden = !favorable;
      el.no.hidden = favorable;

      raiz.ultimoResultado = { cuota: cuota, pct: pct, favorable: favorable, ingresos: ingresos, cuotas: cuotas, credito: credito, ea: ea, plazo: plazo };
      salida.focus();
    });

    /* «Enviarme el PDF» */
    var pdf = raiz.querySelector('[data-sim-pdf]');
    if (pdf) {
      var estado = pdf.querySelector('[data-estado]');
      pdf.addEventListener('submit', function (e) {
        e.preventDefault();
        limpiarErrores(pdf);
        estado.hidden = true;
        var primero = validarContacto(pdf);
        if (primero) { primero.focus(); return; }
        if (!raiz.ultimoResultado) {
          estado.className = 'mensaje mensaje--error';
          estado.textContent = 'Primero haga la cuenta con el botón «Ver mi resultado».';
          estado.hidden = false;
          estado.focus();
          return;
        }
        // TODO: enviar a un servicio real que genere el PDF y guarde el registro en la base de datos.
        //       Datos disponibles: nombre, correo, WhatsApp y raiz.ultimoResultado.
        estado.className = 'mensaje mensaje--ok';
        estado.innerHTML = '';
        var t = document.createElement('strong');
        t.textContent = 'Listo, ' + pdf.querySelector('[data-campo="nombre"]').value.trim() + '.';
        estado.appendChild(t);
        estado.appendChild(document.createTextNode('Le enviaremos su resultado en PDF a ' + pdf.querySelector('[data-campo="correo"]').value.trim() + '.'));
        estado.hidden = false;
        estado.focus();
      });
    }
  });

  /* ---------- 5. Formulario «¿Prefiere que le llamemos?» ---------- */
  document.querySelectorAll('[data-llamada]').forEach(function (form) {
    var desde = form.querySelector('[data-campo="fecha-desde"]');
    var hasta = form.querySelector('[data-campo="fecha-hasta"]');
    var horaDesde = form.querySelector('[data-campo="hora-desde"]');
    var horaHasta = form.querySelector('[data-campo="hora-hasta"]');
    var tema = form.querySelector('[data-campo="tema"]');
    var aviso = form.querySelector('[data-aviso-sabado]');
    var estado = form.querySelector('[data-estado]');

    // Fechas iniciales: desde el próximo día hábil, hasta tres días después.
    var inicio = sumarDias(hoy(), 1);
    if (inicio.getDay() === 0) inicio = sumarDias(inicio, 1);
    var fin = sumarDias(inicio, 3);
    if (fin.getDay() === 0) fin = sumarDias(fin, -1);
    desde.value = aIso(inicio);
    hasta.value = aIso(fin);
    desde.min = aIso(hoy());
    hasta.min = desde.value;

    function incluyeSabado(a, b) {
      if (!a || !b || b < a) return false;
      for (var f = new Date(a); f <= b; f = sumarDias(f, 1)) if (f.getDay() === 6) return true;
      return false;
    }
    function soloSabados(a, b) {
      for (var f = new Date(a); f <= b; f = sumarDias(f, 1)) if (f.getDay() !== 0 && f.getDay() !== 6) return false;
      return true;
    }
    function revisarSabado() {
      aviso.hidden = !incluyeSabado(fechaLocal(desde.value), fechaLocal(hasta.value));
    }
    desde.addEventListener('change', function () { if (desde.value) hasta.min = desde.value; revisarSabado(); });
    hasta.addEventListener('change', revisarSabado);
    revisarSabado();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limpiarErrores(form);
      estado.hidden = true;

      var primero = validarContacto(form);
      function falla(c, m) { marcarError(c, m); if (!primero) primero = c; }

      var d1 = fechaLocal(desde.value), d2 = fechaLocal(hasta.value);
      var h1 = parseInt(horaDesde.value, 10), h2 = parseInt(horaHasta.value, 10);

      if (!d1) falla(desde, 'Elija desde qué día le podemos llamar.');
      else if (d1 < hoy()) falla(desde, 'La fecha «Desde» no puede ser anterior a hoy.');
      else if (d1.getDay() === 0) falla(desde, 'No llamamos los domingos. Elija otro día.');

      if (!d2) falla(hasta, 'Elija hasta qué día le podemos llamar.');
      else if (d1 && d2 < d1) falla(hasta, 'La fecha «Hasta» no puede ser anterior a «Desde».');
      else if (d2.getDay() === 0) falla(hasta, 'No llamamos los domingos. Elija otro día.');

      if (!(h2 > h1)) falla(horaHasta, 'La hora «Hasta las» debe ser posterior a «Desde las».');
      else if (h1 < CONFIG.HORARIO.semana.desde || h2 > CONFIG.HORARIO.semana.hasta) {
        falla(horaDesde, conPunto('Llamamos de lunes a viernes, de ' + horaTexto(CONFIG.HORARIO.semana.desde) + ' a ' + horaTexto(CONFIG.HORARIO.semana.hasta)));
      } else if (d1 && d2 && d2 >= d1 && soloSabados(d1, d2) &&
                 (h2 <= CONFIG.HORARIO.sabado.desde || h1 >= CONFIG.HORARIO.sabado.hasta)) {
        falla(horaDesde, 'Los sábados solo llamamos de ' + horaTexto(CONFIG.HORARIO.sabado.desde) + ' a ' + horaTexto(CONFIG.HORARIO.sabado.hasta) + ' Elija una franja dentro de ese horario.');
      }

      if (primero) { primero.focus(); return; }

      var nombre = form.querySelector('[data-campo="nombre"]').value.trim();
      var celular = form.querySelector('[data-campo="celular"]').value.trim();
      var correo = form.querySelector('[data-campo="correo"]').value.trim();
      var temaTexto = tema.options[tema.selectedIndex].text;
      var dias = rangoFechas(d1, d2);
      var franja = 'de ' + horaTexto(h1) + ' a ' + horaTexto(h2);
      var sabado = incluyeSabado(d1, d2);

      var mensajeWa = 'Hola, soy ' + nombre + '. Quiero que me llamen sobre: ' + temaTexto + '. ' +
        'Días: ' + dias + '. Franja: ' + conPunto(franja) +
        (sabado ? ' (El sábado, hasta la 1:00 p. m.)' : '') +
        ' Celular: ' + celular + '. Correo: ' + correo + '.';

      // TODO: conectar el envío real (CRM, hoja de cálculo o correo) con estos mismos datos.

      estado.className = 'mensaje mensaje--ok';
      estado.innerHTML = '';
      var t = document.createElement('strong');
      t.textContent = 'Recibimos su solicitud, ' + nombre + '.';
      estado.appendChild(t);
      estado.appendChild(document.createTextNode(
        conPunto('Le llamamos ' + dias + ', ' + franja) +
        (sabado ? ' El sábado solo llamamos hasta la 1:00 p. m.' : '') +
        ' Le confirmamos por WhatsApp el día y la hora de la llamada.'));
      var wa = document.createElement('a');
      wa.className = 'btn btn--primario btn--sm';
      wa.href = enlaceWhatsApp(mensajeWa);
      wa.target = '_blank';
      wa.rel = 'noopener';
      wa.textContent = 'Enviar mi solicitud por WhatsApp';
      estado.appendChild(document.createElement('br'));
      estado.appendChild(wa);
      estado.hidden = false;
      estado.focus();
    });
  });

  /* ---------- 6. Enlaces sin destino todavía ---------- */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Exponer utilidades para pruebas manuales en la consola.
  window.Creditvive = { CONFIG: CONFIG, pesos: pesos, enlaceWhatsApp: enlaceWhatsApp };
})();
