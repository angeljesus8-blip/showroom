/* ============================================================
   SHOWROOM 3D — HES 1217 Angelópolis
   CATÁLOGO DE EQUIPOS  ·  este es el único archivo que se edita
   ============================================================

   Cada equipo se dibuja en 3D a partir de estos números.
   No hay archivos de modelo: cambias una medida y el equipo cambia.

   ─── CÓMO AGREGAR UN EQUIPO ───────────────────────────────
   Copia un bloque completo { ... }, pégalo antes del ] final,
   cambia el id (no se puede repetir) y ajusta los datos.

   ─── MEDIDAS ──────────────────────────────────────────────
   Todo en MILÍMETROS, tal cual vienen en la ficha técnica del
   fabricante ("Dimensiones: 162.6 x 75.1 x 8.4 mm").
     dim.w = ancho     dim.h = alto     dim.t = grosor
     dim.r = qué tan redondas son las esquinas (12–16 típico)

   ─── verificar: true ──────────────────────────────────────
   Marca el equipo como "datos por confirmar" y la app le pone
   un aviso visible. Cuando ya cotejaste la ficha oficial,
   bórralo o ponlo en false para que el aviso desaparezca.

   ─── PRECIOS ──────────────────────────────────────────────
   HOY NO SE MUESTRAN: todos están en null por decisión de Ángel,
   y la app pone "Pregunta el precio a tu asesor". Si algún día
   quieres mostrarlos, aquí está cómo:

   precio  = precio de lista (obligatorio si quieres mostrarlo)
   promo   = precio promocional; si lo pones, el de lista sale
             tachado. Si no hay promo, bórralo o ponlo en null.
   promoHasta = último día de la promo "AAAA-MM-DD". Pasada esa
             fecha la app ignora la promo sola y muestra el
             precio de lista. Si la dejas vacía, la promo no vence.
   ============================================================ */

window.CATALOGO = [

  {
    /* Ficha y foto oficial que pasó Ángel el 30-jul-2026.
       Sin precio por decisión suya: el asesor lo da de viva voz. */
    id: 'pura90spromax',
    marca: 'HUAWEI',
    nombre: 'Pura 90s Pro Max',
    etiqueta: 'Preventa',              // banderita en la esquina. Borra la línea si no aplica

    dim: { w: 77.1, h: 164, t: 8.1, r: 16 },

    pantalla: {
      // 6.9" con relación 2880×1308 = pantalla de 159.6 × 72.5 mm,
      // que dentro del cuerpo deja 2.3 mm de marco por lado.
      bezel: 2.3,
      hueco: { x: 0, y: 12, d: 3.8 },  // cámara frontal 13 MP: x/y desde el centro-arriba
      curva: 0.45                      // 0 = pantalla plana, 1 = bordes muy curvos
    },

    camara: {
      // Módulo triangular del Pura, punta hacia abajo: el lente grande abajo
      // y los otros dos arriba, con el flash en medio.
      forma: 'triangulo',              // 'triangulo' | 'circulo' | 'cuadrado' | 'pildora'
      giro: 180,                       // 0 = punta arriba, 180 = punta abajo
      cx: 0, cy: 42,                   // centro del módulo, desde el centro del equipo
      ancho: 56, alto: 56, radio: 10,  // en el triángulo, "radio" redondea las 3 puntas
      saliente: 1.8,                   // cuánto sobresale del dorso (mm)
      lentes: [                        // x/y dentro del módulo, d = diámetro del aro
        { x: 0,      y: -12.3, d: 19 },// 50 MP principal (el grande, abajo)
        { x: -10.65, y: 6.15,  d: 16 },// 200 MP telefoto
        { x: 10.65,  y: 6.15,  d: 15 } // 40 MP ultra gran angular
      ],
      flash: { x: 0, y: 6.15, d: 3.5 }
    },

    // Tono muestreado de la foto oficial; nombre comercial y orden según los SKUs
    // de preventa del tablero (CEA 243). Solo llega en 12/512 GB.
    colores: [
      { n: 'Graphite Black', hex: '#1d1d1b', acabado: 'mate' },
      { n: 'Blush Gold',     hex: '#ece7e0', acabado: 'brillante' },
      { n: 'Blaze Purple',   hex: '#8579bd', acabado: 'brillante' },
      { n: 'Orange Ocean',   hex: '#8ad3e6', acabado: 'brillante' }
    ],

    precio: null,                      // Ángel pidió no mostrar precios
    promo: null,
    promoHasta: '',

    specs: [
      ['Pantalla',  '6.9" OLED · 120 Hz'],
      ['Cámara',    'Triple · 50 + 200 + 40 MP'],
      ['Zoom',      'Óptico 4x · digital 100x'],
      ['Selfie',    '13 MP gran angular'],
      ['Batería',   '6000 mAh'],
      ['Carga',     '100 W con cable · 80 W inalámbrica'],
      // La ficha del fabricante lista 256 y 512, pero Ángel confirmó que
      // el de 256 no va a llegar a tienda: solo se muestra el de 512.
      ['Memoria',   '12 GB RAM · 512 GB'],
      ['Peso',      '230.5 g']
    ],
    gancho: 'Zoom óptico 4x y 200 MP: acerca sin que la foto se despedace.'
  },

  {
    /* Ficha y foto oficial que pasó Ángel el 30-jul-2026.
       Sin precio por decisión suya: el asesor lo da de viva voz. */
    id: 'pura90spro',
    marca: 'HUAWEI',
    nombre: 'Pura 90s Pro',

    dim: { w: 74.5, h: 157.8, t: 8.2, r: 15.5 },

    pantalla: {
      // 6.6" con relación 2760×1256 = pantalla de 152.6 × 69.4 mm,
      // que dentro del cuerpo deja 2.55 mm de marco por lado.
      bezel: 2.55,
      hueco: { x: 0, y: 11.5, d: 3.8 },   // cámara frontal 13 MP
      curva: 0.4
    },

    camara: {
      forma: 'triangulo',
      giro: 180,                          // punta hacia abajo, igual que el Pro Max
      cx: 0, cy: 40, ancho: 52, alto: 52, radio: 9.5, saliente: 1.7,
      lentes: [
        { x: 0,     y: -11,  d: 18 },     // 50 MP principal (el grande, abajo)
        { x: -9.53, y: 5.5,  d: 15 },     // 50 MP macro telefoto
        { x: 9.53,  y: 5.5,  d: 14 }      // 12.5 MP ultra gran angular
      ],
      flash: { x: 0, y: 5.5, d: 3.2 }
    },

    // Tono muestreado de la foto oficial; nombre comercial y orden según los SKUs
    // de preventa del tablero (CEA 243). Llega en 12/512 y 12/256 GB.
    colores: [
      { n: 'Coconut White',  hex: '#ebe8e3', acabado: 'brillante' },
      { n: 'Mulberry Black', hex: '#48494b', acabado: 'mate' },
      { n: 'Guava Soda',     hex: '#f5cfcb', acabado: 'brillante' },
      { n: 'Orange Soda',    hex: '#e3703f', acabado: 'brillante' }
    ],

    precio: null,                         // Ángel pidió no mostrar precios
    promo: null,
    promoHasta: '',

    specs: [
      ['Pantalla',    '6.6" OLED · 120 Hz'],
      ['Cámara',      'Triple · 50 + 50 + 12.5 MP'],
      ['Macro',       'Telefoto 4x desde 5 cm'],
      ['Selfie',      '13 MP gran angular'],
      ['Batería',     '6000 mAh'],
      ['Carga',       '66 W con cable · 50 W inalámbrica'],
      ['Memoria',     '12 GB RAM · 256 o 512 GB'],
      ['Resistencia', 'IP68 e IP69 · agua y polvo'],
      ['Peso',        '213.5 g']
    ],
    gancho: 'Acerca el zoom a 5 cm: la foto macro que ningún otro hace.'
  }

];
