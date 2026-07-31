/* ============================================================
   SHOWROOM — HES 1217 Angelópolis
   CATÁLOGO  ·  este es el único archivo que se edita
   ============================================================

   Al elegir modelo y color cambian JUNTAS las fotos, el precio,
   la memoria y las características. Por eso todo vive aquí.

   ─── REGLA DE ORO ─────────────────────────────────────────
   Los PRECIOS salen de la tienda (tabla de preventa del tablero,
   reportes del POS), NUNCA de la web de HUAWEI: esos son los
   precios de ellos y pueden moverlos sin avisar. Aquí se cobra
   en el mostrador, así que el precio que manda es el tuyo.

   ─── CÓMO AGREGAR UN EQUIPO ───────────────────────────────
   Copia un bloque completo { ... }, pégalo antes del ] final y
   cambia el id (no se puede repetir).

   ─── FOTOS ────────────────────────────────────────────────
   Son los renders oficiales de HUAWEI, guardados en fotos/.
   Cada color lista sus vistas en orden: dorso, ángulo, frente,
   perfil, detalle. Si un color trae menos, no pasa nada: el
   visor muestra las que haya.

   Para agregar las de un color nuevo: en la página del equipo
   en consumer.huawei.com, elige ese color y guarda las 5 fotos
   del carrusel (las que vienen del CDN de la tienda, 800×800).

   ─── COLORES ──────────────────────────────────────────────
   El nombre es el MISMO que usa el visor 3D de HUAWEI, para que
   el cliente no vea dos nombres distintos del mismo color. Entre
   paréntesis va el del sistema, para cruzarlo con el SKU.

   Cada color va de una tonalidad a otra, como el equipo real:
     hex = tono donde empieza    hex2 = tono donde termina

   ─── MEMORIAS ─────────────────────────────────────────────
   Cada capacidad con su precio. Si el equipo trae más de una,
   salen como botones y el precio cambia al elegir.
   ============================================================ */

window.CATALOGO = [

  {
    id: 'pura90spromax',
    marca: 'HUAWEI',
    nombre: 'Pura 90s Pro Max',
    corto: 'Pro Max',
    etiqueta: 'Preventa',
    gancho: 'Zoom óptico 4x y 200 MP: acerca sin que la foto se despedace.',

    // Precio de la preventa CEA 243. El Pro Max solo llega en 512 GB.
    memorias: [
      { cap: '12 GB + 512 GB', precio: 22999 }
    ],

    colores: [
      { n: 'Amanecer', sistema: 'Orange Ocean',  hex: '#8fd9ea', hex2: '#f8ae76',
        fotos: ['promax-amanecer-1.webp', 'promax-amanecer-2.webp', 'promax-amanecer-3.webp',
                'promax-amanecer-4.webp', 'promax-amanecer-5.webp'] },

      { n: 'Grafito',  sistema: 'Graphite Black', hex: '#a9a7a3', hex2: '#191713',
        fotos: ['promax-grafito-1.webp', 'promax-grafito-2.webp', 'promax-grafito-3.webp',
                'promax-grafito-4.webp', 'promax-grafito-5.webp'] },

      { n: 'Dorado',   sistema: 'Blush Gold',     hex: '#f4f4f4', hex2: '#f2e5ce',
        fotos: ['promax-dorado-1.webp', 'promax-dorado-2.webp', 'promax-dorado-3.webp',
                'promax-dorado-4.webp', 'promax-dorado-5.webp'] },

      /* Este trae dos vistas, no cinco: en la web de HUAWEI aparece AGOTADO y por
         eso no publican su carrusel. La del dorso sale de la sección de diseño de
         la ficha; la del detalle de cámara, de la foto oficial de los cuatro
         colores. Si algún día lo reponen, se bajan las cinco como los demás. */
      { n: 'Tornasol', sistema: 'Blaze Purple',   hex: '#7e78c0', hex2: '#fde9d1',
        fotos: ['promax-tornasol-1.webp', 'promax-tornasol-2.webp'] }
    ],

    specs: [
      ['Pantalla',  '6.9" OLED · 120 Hz'],
      ['Cámara',    'Triple · 50 + 200 + 40 MP'],
      ['Zoom',      'Óptico 4x · digital 100x'],
      ['Selfie',    '13 MP gran angular'],
      ['Batería',   '6000 mAh'],
      ['Carga',     '100 W con cable · 80 W inalámbrica'],
      ['Memoria',   '12 GB RAM · 512 GB'],
      ['Peso',      '230.5 g']
    ],

    // Las que flotan junto al equipo. Máximo 5, textos CORTOS: son ganchos de
    // venta y se leen de lejos. Si crecen a tres líneas, se enciman entre ellas.
    nubes: [
      { t: 'Cámara',   v: '200 MP' },
      { t: 'Zoom',     v: 'Óptico 4x · hasta 100x' },
      { t: 'Pantalla', v: '6.9" · 120 Hz' },
      { t: 'Batería',  v: '6000 mAh' },
      { t: 'Carga',    v: '100 W' }
    ]
  },

  {
    id: 'pura90spro',
    marca: 'HUAWEI',
    nombre: 'Pura 90s Pro',
    corto: 'Pro',
    etiqueta: 'Preventa',
    gancho: 'Acerca el zoom a 5 cm: la foto macro que ningún otro hace.',

    // Precios de la preventa CEA 243, uno por capacidad.
    memorias: [
      { cap: '12 GB + 256 GB', precio: 15999 },
      { cap: '12 GB + 512 GB', precio: 18999 }
    ],

    colores: [
      { n: 'Spritz',  sistema: 'Orange Soda',    hex: '#ef7343', hex2: '#fde8a5',
        fotos: ['pro-spritz-1.webp', 'pro-spritz-2.webp', 'pro-spritz-3.webp',
                'pro-spritz-4.webp', 'pro-spritz-5.webp'] },

      { n: 'Carbono', sistema: 'Mulberry Black', hex: '#393a3b', hex2: '#9a9b9c',
        fotos: ['pro-carbono-1.webp', 'pro-carbono-2.webp', 'pro-carbono-3.webp',
                'pro-carbono-4.webp', 'pro-carbono-5.webp'] },

      { n: 'Citrus',  sistema: 'Guava Soda',     hex: '#ffc3c1', hex2: '#d2f5a8',
        fotos: ['pro-citrus-1.webp', 'pro-citrus-2.webp', 'pro-citrus-3.webp',
                'pro-citrus-4.webp', 'pro-citrus-5.webp'] },

      { n: 'Perla',   sistema: 'Coconut White',  hex: '#fbe0d9', hex2: '#fbfcf5',
        fotos: ['pro-perla-1.webp', 'pro-perla-2.webp', 'pro-perla-3.webp',
                'pro-perla-4.webp', 'pro-perla-5.webp'] }
    ],

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

    nubes: [
      { t: 'Macro',       v: 'Enfoca desde 5 cm' },
      { t: 'Cámara',      v: 'Triple · 50 + 50 MP' },
      { t: 'Pantalla',    v: '6.6" · 120 Hz' },
      { t: 'Batería',     v: '6000 mAh' },
      { t: 'Resistencia', v: 'IP68 · IP69' }
    ]
  }

];


/* ============================================================
   AJUSTES GENERALES
   ============================================================ */

/* La frase que cierra hacia el mostrador. Aquí se cobra en tienda:
   nunca poner nada que mande a comprar en línea. */
window.LLAMADA = 'Apártalo hoy con tu asesor';

/* Visor 3D oficial de HUAWEI, el que se abre con el botón "Girarlo en 3D".
   Revisado: no trae enlaces ni botones de compra.
   ⚠️ La dirección es de campaña ("2026q204") y va a cambiar. Cuando deje de
   cargar: entra a la ficha del equipo en consumer.huawei.com, abre su visor 3D
   (el botón que dice 3D) y copia aquí el src del iframe que se abre. */
window.VISOR_3D = 'https://meta.kivisense.com/project-h-2026q204-alpha/phone.html?lang=mx';
