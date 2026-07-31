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

   ─── COLORES ──────────────────────────────────────────────
   Los equipos no son de un color plano: van de una tonalidad a
   otra. Por eso cada color lleva DOS tonos.
     hex   = tono donde empieza     hex2 = tono donde termina
     giro  = dirección del degradado en grados; el valor por
             omisión deja el primer tono arriba y el segundo abajo
     metal = color de la placa de la cámara, si es distinto
   Si un equipo sí fuera de un solo color, basta con poner hex.

   El truco para sacarlos exactos: en la página del equipo en
   consumer.huawei.com, el selector de color trae el degradado
   como CSS; de ahí salieron los del Pura 90s Pro.

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
      cx: 5, cy: 42,                   // el módulo NO va centrado: se carga al lado de los botones
      ancho: 56, alto: 56, radio: 8,   // en el triángulo, "radio" redondea las 3 puntas
      saliente: 1.8,                   // cuánto sobresale del dorso (mm)
      // Los lentes son grandes: casi se tocan entre sí, como en el equipo real
      lentes: [                        // x/y dentro del módulo, d = diámetro del aro
        { x: 0,     y: -13.4, d: 21 }, // 50 MP principal (el grande, abajo)
        { x: -11.6, y: 6.7,   d: 19 }, // 200 MP telefoto
        { x: 11.6,  y: 6.7,   d: 18 }  // 40 MP ultra gran angular
      ],
      flash: { x: 0, y: 6.7, d: 1.7 }
    },

    /* Cada color va de una tonalidad a otra (hex → hex2), como el equipo real.
       Tonos muestreados de los dos extremos del degradado en la foto oficial.
       Nombre comercial y orden según los SKUs de preventa del tablero (CEA 243);
       en la web de Huawei México los llaman Negro Grafito / Dorado Solar /
       Naranja Celeste. Solo llega en 12/512 GB. */
    colores: [
      { n: 'Graphite Black', hex: '#24231f', hex2: '#56554f', acabado: 'mate' },
      { n: 'Blush Gold',     hex: '#faf7f2', hex2: '#e0c9a2', acabado: 'brillante', metal: '#c9ab72' },
      { n: 'Blaze Purple',   hex: '#9890c4', hex2: '#efdbcc', acabado: 'brillante' },
      { n: 'Orange Ocean',   hex: '#8fd9ea', hex2: '#f8ae76', acabado: 'brillante' }
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
      cx: 5, cy: 40, ancho: 52, alto: 52, radio: 7.5, saliente: 1.7,
      lentes: [
        { x: 0,     y: -12.4, d: 19.5 },  // 50 MP principal (el grande, abajo)
        { x: -10.7, y: 6.2,   d: 17.5 },  // 50 MP macro telefoto
        { x: 10.7,  y: 6.2,   d: 16.5 }   // 12.5 MP ultra gran angular
      ],
      flash: { x: 0, y: 6.2, d: 1.6 }
    },

    /* Estos degradados son los EXACTOS de la web de Huawei México
       (consumer.huawei.com/mx/offer/telefonos/pura90s-pro-buy/): están ahí como
       CSS del selector de color, así que no hay estimación de por medio.
       Nombre y orden según los SKUs de preventa del tablero (CEA 243);
       en la web al Orange Soda lo llaman "Naranja Spritz".
       Llega en 12/512 y 12/256 GB. */
    colores: [
      { n: 'Coconut White',  hex: '#fbe0d9', hex2: '#fbfcf5', acabado: 'brillante' },
      { n: 'Mulberry Black', hex: '#393a3b', hex2: '#9a9b9c', acabado: 'mate' },
      { n: 'Guava Soda',     hex: '#ffc3c1', hex2: '#d2f5a8', acabado: 'brillante' },
      { n: 'Orange Soda',    hex: '#ef7343', hex2: '#fde8a5', acabado: 'brillante' }
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
