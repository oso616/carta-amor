/* ============================================================
   TODO LO QUE NO CABE EN UNA SOLA FRASE
   ------------------------------------------------------------
   Datos + utilidades de la penúltima sección de la experiencia
   teatral («Nuestro Primer Acto»).

   · window.LOVE_NOTES → las 100 notas románticas, en orden.
       { id, text, date }   (date: null hasta que exista una real)
   · window.LoveNotes  → utilidades puras y reutilizables:
       normalizar(texto)          copia para análisis (no se muestra)
       categorias(texto)          ids de categoría detectados
       analizar(notas)            notas + normalizedText + categorias
       estadisticas(notas)        recuentos reales (nunca inventados)
       CATEGORIAS                 definición de cada recuento/filtro
       fragmento(texto, max)      fragmento corto para el corazón/flotantes
       primerasBreves(notas, n)   entradas breves para la hoja
       seleccionar(notas, n, sem) selección variada y determinista
       topeFlotantes(ancho)       cuántas frases flotantes por pantalla
       topeEntradas(alto)         cuántas entradas caben en la hoja
       prefiereMovimientoReducido()

   Sin dependencias. Se carga ANTES del motor del teatro y no
   modifica el texto original de ninguna nota.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- 1. Las 100 notas (texto original, sin retocar) ---------- */
  var TEXTOS = [
    "Te amoooo, amorcito mío.",
    "Te extrañooo, amorrr.",
    "Cómo extraño esos lindos ojos tuyos.",
    "Amorrr, extraño un montonazo esos ojitos preciosos que tenés.",
    "Mi vida, no te imaginas cuánto te extraño, a pesar de que solo hayan pasado un par de días desde que te vi.",
    "Te lo juro, desde que estoy contigo, amor, me haces muy feliz cada día.",
    "Cómo extraño tu sonrisita y esos ojitos tan bonitos tuyos.",
    "Amorcito, te lo prometo, no hay día en el cual no piense en ti y en cómo jugábamos como niños pequeños en el Airbnb.",
    "A pesar de estar en clases, lo único en lo que puedo pensar es en esa carita tan preciosa que tienes, amor.",
    "Te extrañooo.",
    "No puedes creer lo mucho que te amoooo.",
    "Tú, mi vida hermosa, eres lo más preciado que tengo y por ti haré lo que sea con tal de ver tus ojos preciosos.",
    "Cómo extraño las veces que fui a donde vives, porque de esa forma podía verte todo el día, todos los días.",
    "De verdad, cómo extraño tener tu presencia cerca, amor.",
    "A pesar de tener tantas cosas por hacer, no puedo dejar de pensar en ti, amor.",
    "Amooo cuantooo amoooo tu formaaa de serrr, amorrr, te lo juroooo.",
    "Te extrañoooooo.",
    "Amorrr, estaba viendo fotos de nosotros y no sabes cuán afortunado soy de tenerte como mi polola tan preciosa, hermosa, bella, guapaa, increíble, simpática, cariñosa, tierna y simplemente maravillosa. Te extraño, amorcitooo.",
    "Te extrañooo, amorcitooo.",
    "Te extrañooo, amorrr. No te imaginas cuánto extraño esa carita preciosaaa que tienes.",
    "Amorrr, te extrañooo cada segundo de mi día.",
    "Wapaaa mía, cómo te amooo, adorooo y extrañooo, sobre todo por esa personalidad tan perfecta que tienes.",
    "Amorrr, te extrañoooo.",
    "Jsjsjsjsj, por andar escribiendo cuánto te amooo me retó mi profesora, la loca, jsjsjsjsj.",
    "Amorrr, te extrañoooo.",
    "Te amooo mucho, mi amorcitooo bellooooo.",
    "A medida que han aumentado los días desde la última vez que nos vimos, también ha aumentado lo mucho que te amooo.",
    "Nunca pensé que pudiera extrañar tanto a alguien con quien hablo todos los días. Te amooo, mi amorcitooo.",
    "Hermosaaa que sos, muy wapaaa, te lo jurooo. Cuando pienso en ti, solo me lleno de lindos y perfectos recuerdos.",
    "Te extrañooo, amorcito. Cómo desearía que estuvieras a mi lado todos los días, pero la distancia no es más que otro obstáculo para demostrarte lo mucho que te amooo y adorooo, amor.",
    "Eres todo lo que quiero, amor. Amo ver tus lindos y preciosos ojitos junto a tu hermosa sonrisa.",
    "Te extrañooo, amorrr, y extraño poder ver esos ojitos tuyos de frente.",
    "Te lo juro, amor, sos muy hermosa y preciosa.",
    "Cómo extraño poder verte sonreír de frente, amor.",
    "Amorrr, te jurooo que te extrañooo un montonazo. No te imaginas cuánto me gusta hacer de todo a tu lado.",
    "Te lo jurooo, cómo adorooo dormir a tu lado, ya sea en llamada o en la realidad. Simplemente sentirte cerca es lo mejor de todo, amor.",
    "Cómo te amoooo, te recontraaa amooo, mi princeshita más hermosaaa y wapaaa.",
    "Hermosaaa, y qué hermosos ojitos tienes, amorrr. Cómo extraño mirártelos.",
    "Es impresionante lo mucho que te extraño, a pesar de hablar contigo a diario, amor.",
    "Sabes, a algunos viajar dos horas a diario los volvería locos, pero a mí me gusta porque ese tiempo lo dedico a pensarte y eso me encanta.",
    "Te extrañooo, wapaaa, porque eso es lo que eres, muy, muy wapaaa y hermosaaa.",
    "Extraño mucho tu carita, amor. Prefiero esperar una eternidad para estar contigo antes que estar con alguien más.",
    "Algunos dicen que la distancia hace las cosas difíciles, y es verdad, pero para mí solo demuestra lo mucho que te amooo y aprecio, amor. Porque, a pesar de todo, eres tú y siempre serás tú, amor.",
    "Te extrañooo un montón.",
    "De verdad, qué hermosa sonrisa tienes, amor, grrr.",
    "Tus ojitos son demasiado preciosos.",
    "Cómo te extraño, a pesar de que hablamos hace poquito. Ya te echo de menos, amor.",
    "Extraño escuchar tu voz tan preciosa.",
    "Extraño ver esos ojitos tan preciosos que tienes, amor.",
    "Te amoooo muchoteeee.",
    "Eres hermosaaa, te lo jurooo, mi preciosa.",
    "Extraño las caricias que me hacías cuando estábamos uno al lado del otro.",
    "Amooo ver esos ojitos tan lindos que tienes. Te extrañooo.",
    "Cada vez que te recuerdo, pienso en lo linda y tierna que eres, mi amorcito.",
    "Te extrañoooo.",
    "Hermosaaa, cómo te extrañoooo.",
    "Te extraño mucho, amor. Aunque nos hayamos molestado, nunca dejaré de amarte.",
    "Amo escucharte estudiar.",
    "Amo escuchar cuando me lees.",
    "Amorrr, amo tu voz tan tierna.",
    "Amo tus piecitos tan pequeñitos.",
    "Amo cada acto que tienes conmigo.",
    "Extraño ver tus ojitos cuando me mirabas directamente.",
    "Extraño escuchar tu vocecita tan delicada y tierna cuando me hablabas mirándome a los ojos.",
    "Amo cuando me mandas fotitos tuyas, amor.",
    "Amo cuando me hablas sin que tenga que escribirte primero.",
    "Amo cómo me haces sentir.",
    "Extraño cómo me hablas toda tiernita tú.",
    "Amo lo cariñosa que eres.",
    "Extraño cómo me cuidabas cuando me enfermé.",
    "A pesar de estar siempre hablando contigo, te extraño porque nadie me hace sentir como tú, amorcito mío, mi princeshita hermosa.",
    "Mi princeshita hermosa, mi niña bonita, mi corazoncito de melón, mi todo, cómo amooo ser tu pareja.",
    "No sé cuántas veces lo he repetido, pero cómo amooo y extrañooo ver esos ojitos tan hermosos, preciosos y tiernos que tienes.",
    "Tan chiquita que eres, amor, y tanto amor que puedes dar. Te quiero, te amooo y te adorooo.",
    "Sos el amor de mi vida. Cómo extraño sentirte cerquita de mí, amorcito.",
    "Tierna que sos.",
    "Tan cariñosa que eres, amor.",
    "Muaaaa, cómo extraño tenerte a unos metros o centímetros de mí.",
    "Amorrr, te extrañooo tantooo que cualquier cosita que veo me hace pensar inmediatamente en ti y en esa carita tan preciosa que tienes.",
    "Te lo jurooo, mi vida, cada día que pasa me doy cuenta aún más de lo muchísimo que te amooo y de lo afortunado que soy por tenerte.",
    "Wapaaa míaaa, cómo desearía poder abrazarte ahora mismooo y quedarme contigo sin soltarte nunca, amorcitooo.",
    "Amorrr, extraño demasiado cuando me miras con esos ojitos tan preciosos y me haces sentir como la persona más feliz del mundooo.",
    "Mi princeshita hermosaaa, no sabes las ganas que tengo de volver a verte y hacer cualquier cosita juntos, aunque sea solamente estar acostaditos hablando.",
    "Te extrañooo demasiado, amorcitooo. Hasta cuando estoy ocupado, mi cabecita encuentra alguna forma de ponerse a pensar en ti, jsjsjsjsj.",
    "Amorrr, amooo tanto cuando te pones toda tiernita conmigo porque, te lo jurooo, haces que mi corazón se derrita completitooo.",
    "Cómo amooo esa sonrisita tan preciosa que tienes, amor. Podría pasarme todo el día mirándote sonreír y jamás me aburriría.",
    "Wapaaa, preciosa, hermosa y bellaaa, no sabes cuánto extraño escuchar tu vocecita y que me cuentes cualquier cosita de tu día.",
    "Amorrr, cada recuerdo que tengo contigo me hace sonreír como tontito porque todos los momentos a tu lado son demasiado lindos y especiales para mí.",
    "Te extrañooo, mi niña bonitaaa. Lo único que quiero es volver a tenerte cerquita y poder mirar esos ojitos preciosos de frente otra vez.",
    "Te lo jurooo, amor, aunque pasen días sin poder verte, no existe ni un solo segundo en el que deje de amarte con todo mi corazoncitooo.",
    "Mi vida hermosaaa, cómo amooo que seas tú la persona que alegra todos mis días, incluso desde lejitos y sin darte cuenta.",
    "Amorrr, sos demasiado preciosa y perfecta para mí. Cada cosita que haces consigue que me enamore muchísimo más de ti.",
    "Extrañooo jugar contigo como dos niñitos pequeños y reírnos por cualquier tontera hasta que nos duela la guatita, amorrr.",
    "Amorcitooo, si supieras todas las veces que miro nuestras fotitos solamente para sentir que estás un poquito más cerquita de mí.",
    "Wapaaa mía, cuando finalmente pueda verte te voy a dar el abrazo más fuerte y lleno de amorrr de todo el mundooo.",
    "Amorrr, no importa cuánto tenga que viajar o esperar para verte porque cualquier esfuerzo vale completamente la pena si al final puedo estar contigo.",
    "Mi princeshitaaa, amooo absolutamente todo de ti: tu carita, tu vocecita, tu forma de hablar y ese corazoncito tan precioso que tienes.",
    "Te extrañooo un montonazo, amor, y cada vez que pienso en ti solamente deseo que el tiempo pase más rápido para poder volver a verte.",
    "Amorrr, eres mi lugar favoritooo porque no importa dónde estemos, mientras esté contigo me siento tranquilo, feliz y demasiado amado.",
    "Cómo te amoooo, mi niña preciosa. Te lo jurooo, volvería a elegirte una y mil veces porque sos todo lo lindo que quiero en mi vida. 💗"
  ];

  var LOVE_NOTES = TEXTOS.map(function (texto, i) {
    return { id: i + 1, text: texto, date: null };
  });

  /* ---------- 2. Normalización (solo para análisis) ----------
     Minúsculas · sin tildes · sin repeticiones de letras · sin
     espacios dobles. El mensaje que se muestra nunca se toca. */
  function normalizar(texto) {
    var t = String(texto == null ? "" : texto);
    t = t.toLowerCase();
    if (t.normalize) t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    t = t.replace(/(.)\1+/g, "$1");   // amoooo → amo · extrañooo → extraño
    return t.replace(/\s+/g, " ").trim();
  }

  /* ---------- 3. Categorías ----------
     Cada categoría se detecta sobre la copia normalizada, así los
     alargamientos (amooo, extrañooo, ojitos) no escapan al recuento.
     "filtro" indica si aparece en el panel de lectura completa. */
  var CATEGORIAS = [
    { id: "amo",       etiqueta: "Te amo",          filtro: true,  orden: 1,
      patron: /\b(am(o|as|a|os|an|e|arte|ar|aba|ando|ado)\b|enamor|ador(o|as|a|os|an|arte)\b|te quier(o|es|e)\b)/ },
    { id: "extrano",   etiqueta: "Te extraño",      filtro: true,  orden: 2,
      /* la copia normalizada pierde la tilde de la ñ: "extrañ" → "extran" */
      patron: /(extran|echo de menos|echa de menos)/ },
    { id: "ojitos",    etiqueta: "Ojitos",          filtro: true,  orden: 3,
      patron: /(ojit|ojos?|mirada|pestan)/ },
    { id: "voz",       etiqueta: "Voz",             filtro: true,  orden: 4,
      patron: /(\bvoz\b|\bvoce)/ },
    { id: "distancia", etiqueta: "Distancia",       filtro: true,  orden: 5,
      patron: /(distancia|lejitos|\blejos\b|viaj|kilometr|\bkm\b|dos horas)/ },
    { id: "recuerdos", etiqueta: "Recuerdos",       filtro: true,  orden: 6,
      patron: /(recuerd|foto|fotit|imagen|momento|polaroid|airbnb)/ },
    { id: "volver",    etiqueta: "Volver a verte",  filtro: true,  orden: 7,
      patron: /(volver(ia|e|e|é)? a (ver|verte|tenerte|elegirte|estar)|verte (otra vez|de nuevo)|ganas de verte|reencuentro)/ },
    { id: "abrazos",   etiqueta: "Abrazos y caricias", filtro: false, orden: 8,
      patron: /(abraz|carici|cerquita|\bcerca\b|al lado|junto a|acostadit|\bapoy)/ },
    { id: "risa",      etiqueta: "Risas",           filtro: false, orden: 9,
      patron: /(jsjs|reir|reimos|risa|guatita|tontera|tontito|grrr)/ }
  ];

  function categorias(texto) {
    var t = normalizar(texto);
    var salida = [];
    for (var i = 0; i < CATEGORIAS.length; i++) {
      if (CATEGORIAS[i].patron.test(t)) salida.push(CATEGORIAS[i].id);
    }
    return salida;
  }

  /* ---------- 4. Análisis y estadísticas ---------- */
  function analizar(notas) {
    var lista = Array.isArray(notas) ? notas : [];
    return lista.map(function (n, i) {
      var texto = (n && typeof n === "object") ? n.text : n;
      return {
        id: (n && n.id != null) ? n.id : (i + 1),
        text: String(texto == null ? "" : texto),
        date: (n && n.date) || null,
        normalizedText: normalizar(texto),
        categorias: categorias(texto)
      };
    });
  }

  function estadisticas(notas) {
    var analizadas = (Array.isArray(notas) && notas.length && notas[0].categorias) ? notas : analizar(notas);
    var porCategoria = {};
    CATEGORIAS.forEach(function (c) { porCategoria[c.id] = 0; });
    var amoYExtrano = 0, conAlguna = 0;
    analizadas.forEach(function (n) {
      var cats = n.categorias || [];
      if (cats.length) conAlguna++;
      cats.forEach(function (c) { if (porCategoria[c] !== undefined) porCategoria[c]++; });
      if (cats.indexOf("amo") !== -1 && cats.indexOf("extrano") !== -1) amoYExtrano++;
    });
    return {
      total: analizadas.length,
      porCategoria: porCategoria,
      amoYExtrano: amoYExtrano,
      conAlguna: conAlguna,
      analizadas: analizadas
    };
  }

  /* ---------- 5. Selección de mensajes ---------- */
  function fragmento(texto, max) {
    var t = String(texto == null ? "" : texto).replace(/\s+/g, " ").trim();
    var limite = max || 34;
    if (t.length <= limite) return t;
    var corte = t.slice(0, limite);
    var ultimo = corte.lastIndexOf(" ");
    if (ultimo > limite * 0.5) corte = corte.slice(0, ultimo);
    return corte.replace(/[,;:.\s]+$/, "") + "…";
  }

  function primerasBreves(notas, cantidad) {
    var analizadas = (Array.isArray(notas) && notas.length && notas[0].categorias) ? notas : analizar(notas);
    var tope = cantidad || 7;
    var breves = analizadas.filter(function (n) { return n.text.length <= 92; });
    return breves.slice(0, tope);
  }

  function barajar(lista, semilla) {
    var a = lista.slice();
    var s = (semilla || 7) % 2147483647;
    if (s <= 0) s += 2147483646;
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Selección variada: reparte por categorías (round-robin) y luego
     rellena con el resto, en un orden determinista. */
  function seleccionar(notas, cantidad, semilla) {
    var analizadas = (Array.isArray(notas) && notas.length && notas[0].categorias) ? notas : analizar(notas);
    var tope = Math.max(1, Math.min(cantidad || 12, analizadas.length));
    var bolsas = {};
    CATEGORIAS.forEach(function (c) { bolsas[c.id] = []; });
    var resto = [];
    analizadas.forEach(function (n) {
      var principal = null;
      for (var i = 0; i < CATEGORIAS.length; i++) {
        if (n.categorias.indexOf(CATEGORIAS[i].id) !== -1) { principal = CATEGORIAS[i].id; break; }
      }
      if (principal) bolsas[principal].push(n); else resto.push(n);
    });
    var usados = {};
    var salida = [];
    function agregar(n) {
      if (!n || usados[n.id]) return false;
      usados[n.id] = true;
      salida.push(n);
      return true;
    }
    var orden = barajar(CATEGORIAS.map(function (c) { return c.id; }), semilla || 13);
    var i, j;
    for (i = 0; i < CATEGORIAS.length; i++) bolsas[CATEGORIAS[i].id] = barajar(bolsas[CATEGORIAS[i].id], (semilla || 13) + i * 31);
    var indice = {};
    var progreso = true;
    while (salida.length < tope && progreso) {
      progreso = false;
      for (i = 0; i < orden.length && salida.length < tope; i++) {
        var id = orden[i];
        indice[id] = indice[id] || 0;
        var bolsa = bolsas[id];
        while (indice[id] < bolsa.length && !agregar(bolsa[indice[id]])) indice[id]++;
        if (indice[id] < bolsa.length) progreso = true;
      }
    }
    resto = barajar(resto, (semilla || 13) + 999);
    for (j = 0; j < resto.length && salida.length < tope; j++) agregar(resto[j]);
    return salida;
  }

  /* ---------- 6. Ajustes por dispositivo ---------- */
  function topeFlotantes(ancho) {
    var w = ancho || (global.innerWidth || 1024);
    if (w >= 900) return 30;   // PC
    if (w >= 720) return 18;   // tablet
    return 10;                 // teléfono
  }
  function topeEntradas(alto) {
    var h = alto || (global.innerHeight || 800);
    if (h >= 760) return 7;
    if (h >= 620) return 6;
    return 5;
  }
  function prefiereMovimientoReducido() {
    try { return !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    catch (err) { return false; }
  }

  /* ---------- 6b. Cada nota lleva su análisis incorporado ----------
     categories / normalizedText se calculan automáticamente (nunca a
     mano). "categorias" es el mismo dato con nombre en español. */
  LOVE_NOTES.forEach(function (nota) {
    var cats = categorias(nota.text);
    nota.categories = cats;
    nota.categorias = cats;
    nota.normalizedText = normalizar(nota.text);
  });

  /* ---------- 7. Exposición ---------- */
  var LoveNotes = {
    CATEGORIAS: CATEGORIAS,
    normalizar: normalizar,
    categorias: categorias,
    analizar: analizar,
    estadisticas: estadisticas,
    fragmento: fragmento,
    primerasBreves: primerasBreves,
    seleccionar: seleccionar,
    barajar: barajar,
    topeFlotantes: topeFlotantes,
    topeEntradas: topeEntradas,
    prefiereMovimientoReducido: prefiereMovimientoReducido
  };

  global.LOVE_NOTES = LOVE_NOTES;
  global.LoveNotes = LoveNotes;

  /* ---------- 8. Verificación de integridad (avisa, no rompe) ---------- */
  (function verificar() {
    var avisos = [];
    if (LOVE_NOTES.length !== 100) avisos.push("Se esperaban 100 notas y hay " + LOVE_NOTES.length + ".");
    var vistos = {}, duplicados = [];
    LOVE_NOTES.forEach(function (n) {
      if (vistos[n.id]) duplicados.push(n.id);
      vistos[n.id] = true;
      if (!n.text) avisos.push("La nota " + n.id + " está vacía.");
    });
    for (var id = 1; id <= LOVE_NOTES.length; id++) if (!vistos[id]) avisos.push("Falta la nota " + id + ".");
    if (duplicados.length) avisos.push("Identificadores duplicados: " + duplicados.join(", ") + ".");
    if (avisos.length && global.console && console.warn) {
      console.warn("[loveNotes] " + avisos.join(" "));
    }
  })();
})(typeof window !== "undefined" ? window : this);
