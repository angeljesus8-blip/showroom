/* ============================================================
   SHOWROOM 3D — HES 1217
   Motor 3D: construye cada equipo con pura geometría, a partir
   de las medidas del catálogo. No hay archivos de modelo.
   ============================================================ */

import * as THREE from './vendor/three.module.min.js';

/* 1 unidad de la escena = 1 cm. Las medidas del catálogo vienen en mm. */
const MM = 0.1;

/* ── Utilidades ─────────────────────────────────────────── */

/** Rectángulo con esquinas redondeadas, centrado en el origen. */
function shapeRect(w, h, r) {
  r = Math.max(0.0001, Math.min(r, Math.min(w, h) / 2 - 0.0001));
  const x = w / 2, y = h / 2;
  const s = new THREE.Shape();
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y);
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x, y - r);
  s.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  s.lineTo(-x + r, y);
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-x, -y + r);
  s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * Triángulo con las esquinas muy redondeadas: el módulo de cámara
 * característico de la familia Pura.
 * @param {number} ancho  ancho total del módulo
 * @param {number} r      radio de las tres esquinas
 * @param {number} giroGrados  0 = punta hacia arriba, 180 = punta hacia abajo
 */
function shapeTriangulo(ancho, r, giroGrados = 0) {
  const R = ancho / Math.sqrt(3);          // en un equilátero, ancho = circunradio × √3
  r = Math.max(0.001, Math.min(r, R / 2 - 0.001));
  const d = R - 2 * r;                     // centro de cada arco de esquina
  const giro = giroGrados * Math.PI / 180;
  const s = new THREE.Shape();

  for (let i = 0; i < 3; i++) {
    const a = giro + Math.PI / 2 + i * 2 * Math.PI / 3;
    const cx = d * Math.cos(a), cy = d * Math.sin(a);
    const ini = a - Math.PI / 3, fin = a + Math.PI / 3;
    if (i === 0) s.moveTo(cx + r * Math.cos(ini), cy + r * Math.sin(ini));
    s.absarc(cx, cy, r, ini, fin, false);  // los tramos rectos se cierran solos
  }
  s.closePath();
  return s;
}

/** Devuelve la silueta del módulo de cámara según su forma. */
function shapeModulo(cam, mw, mh, mr) {
  if (cam.forma === 'triangulo') return shapeTriangulo(mw, mr, cam.giro || 0);
  return shapeRect(mw, mh, mr);            // 'circulo' = cuadrado con radio = lado/2
}

/** Reasigna UVs de 0 a 1 sobre la caja del objeto (ShapeGeometry las da en coords de mundo). */
function uvCaja(g) {
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const w = bb.max.x - bb.min.x, h = bb.max.y - bb.min.y;
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - bb.min.x) / w, (pos.getY(i) - bb.min.y) / h);
  }
  uv.needsUpdate = true;
  return g;
}

/** Cuánto se redondea el canto lateral, en función de "curva" (0 plano, 1 muy curvo). */
function canto(t, curva) {
  return (0.10 + 0.36 * Math.max(0, Math.min(1, curva || 0))) * t;
}

/**
 * Las capas del frente (pantalla, marco, lentes) van a décimas de milímetro
 * unas de otras: sin esto el buffer de profundidad no las distingue y quedan
 * parpadeando o tapadas por el cuerpo. Las empuja al frente sin moverlas.
 * @param {THREE.Material} m
 * @param {number} nivel  cuanto más alto, más al frente
 */
function alFrente(m, nivel = 1) {
  m.polygonOffset = true;
  m.polygonOffsetFactor = -2 * nivel;
  m.polygonOffsetUnits = -4 * nivel;
  return m;
}

/* ── Materiales ─────────────────────────────────────────── */

/**
 * Pinta la pieza con un degradado entre dos tonos, vértice por vértice.
 * Los equipos reales no son de un color plano: van de una tonalidad a otra
 * en diagonal. Se hace con color por vértice (y no con una textura) para que
 * el degradado siga siendo continuo en el canto lateral y en el módulo.
 * @param {number} grados  dirección del degradado. El valor por omisión hace
 *   que el primer tono quede arriba y el segundo abajo, en diagonal.
 */
function pintarDegradado(geom, hexA, hexB, grados = -55) {
  const cA = new THREE.Color(hexA), cB = new THREE.Color(hexB);
  geom.computeBoundingBox();
  const bb = geom.boundingBox;
  const pos = geom.attributes.position;
  const a = grados * Math.PI / 180;
  const dx = Math.cos(a), dy = Math.sin(a);

  // Rango que cubre la proyección de la caja sobre la dirección del degradado
  let min = Infinity, max = -Infinity;
  for (const x of [bb.min.x, bb.max.x]) {
    for (const y of [bb.min.y, bb.max.y]) {
      const p = x * dx + y * dy;
      min = Math.min(min, p); max = Math.max(max, p);
    }
  }
  const span = (max - min) || 1;

  const col = new THREE.Float32BufferAttribute(pos.count * 3, 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = ((pos.getX(i) * dx + pos.getY(i) * dy) - min) / span;
    c.copy(cA).lerp(cB, Math.max(0, Math.min(1, t)));
    col.setXYZ(i, c.r, c.g, c.b);
  }
  geom.setAttribute('color', col);
  return geom;
}

/**
 * El color lo pone el degradado por vértice, por eso el material va en blanco.
 * El dorso es cristal de color, no metal: con metalness alto el color se apaga
 * (en PBR el metal no tiene componente difusa) y el equipo sale grisáceo.
 * El brillo se consigue con clearcoat, que es justo una capa de laca encima.
 */
function matCuerpo(acabado) {
  const brillante = acabado === 'brillante';
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    metalness: 0.04,
    roughness: brillante ? 0.24 : 0.62,
    clearcoat: brillante ? 1.0 : 0.28,
    clearcoatRoughness: brillante ? 0.05 : 0.42
  });
}

/** Canto lateral: mismo tono que el cuerpo, pero pulido como aluminio. */
function matMarco() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff, vertexColors: true, metalness: 0.96, roughness: 0.20
  });
}

/**
 * Tono metálico a juego con el color del equipo: mismo matiz, pero claro.
 * Los aros y la placa de la cámara son metal pulido; si se les deja el color
 * del cuerpo, en los equipos oscuros se funden con el negro de los lentes.
 */
function tonoMetal(hex) {
  const c = new THREE.Color(hex);
  const hsl = {}; c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s * 0.45, 0.45 + hsl.l * 0.35);
  return c;
}

/** Placa del módulo y aros de los lentes: metal liso, sin degradado.
    No va a metalness 1: un metal puro solo devuelve el reflejo y, contra el
    negro de los lentes, desaparece. Con algo de color propio se sostiene. */
function matMetal(hex) {
  return new THREE.MeshPhysicalMaterial({
    color: tonoMetal(hex), metalness: 0.86, roughness: 0.22
  });
}

const matCristal = () => new THREE.MeshPhysicalMaterial({
  color: 0x05060a, metalness: 0.35, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03
});

const matNegro = () => new THREE.MeshPhysicalMaterial({
  color: 0x0a0b0e, metalness: 0.5, roughness: 0.12
});

const matLente = () => new THREE.MeshPhysicalMaterial({
  color: 0x04050a, metalness: 0.9, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02
});

/* ── Fondo de pantalla generado (para que el equipo se vea encendido) ── */

let _texPantalla = null;
function texturaPantalla() {
  if (_texPantalla) return _texPantalla;

  const cv = document.createElement('canvas');
  cv.width = 720; cv.height = 1560;
  const g = cv.getContext('2d');

  const grad = g.createLinearGradient(0, 0, cv.width, cv.height);
  grad.addColorStop(0.00, '#1d2a4a');
  grad.addColorStop(0.45, '#7a2340');
  grad.addColorStop(0.75, '#c9432b');
  grad.addColorStop(1.00, '#f37021');
  g.fillStyle = grad;
  g.fillRect(0, 0, cv.width, cv.height);

  // Halos suaves
  for (const [x, y, r, a] of [[520, 300, 380, 0.18], [180, 1180, 460, 0.14]]) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, cv.width, cv.height);
  }

  // Reloj
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.font = '300 190px Montserrat, Segoe UI, sans-serif';
  g.fillText('9:41', cv.width / 2, 560);
  g.font = '400 52px Montserrat, Segoe UI, sans-serif';
  g.globalAlpha = 0.9;
  g.fillText('Martes 30 de julio', cv.width / 2, 640);
  g.globalAlpha = 1;

  // Fila de iconos abajo
  const iconos = 4, sep = cv.width / (iconos + 1);
  for (let i = 1; i <= iconos; i++) {
    g.fillStyle = 'rgba(255,255,255,0.22)';
    const x = sep * i, y = 1380, s = 96, rr = 26;
    g.beginPath();
    g.moveTo(x - s / 2 + rr, y - s / 2);
    g.arcTo(x + s / 2, y - s / 2, x + s / 2, y + s / 2, rr);
    g.arcTo(x + s / 2, y + s / 2, x - s / 2, y + s / 2, rr);
    g.arcTo(x - s / 2, y + s / 2, x - s / 2, y - s / 2, rr);
    g.arcTo(x - s / 2, y - s / 2, x + s / 2, y - s / 2, rr);
    g.closePath();
    g.fill();
  }

  _texPantalla = new THREE.CanvasTexture(cv);
  _texPantalla.colorSpace = THREE.SRGBColorSpace;
  _texPantalla.anisotropy = 8;
  _texPantalla.userData.aspecto = cv.width / cv.height;
  return _texPantalla;
}

/**
 * El fondo se dibuja vertical (proporción de celular). En una tablet, estirarlo
 * deforma el reloj; mejor se recorta para llenar, como un "cover" de CSS.
 * Se guardan en caché por proporción: son pocas y así no se recrean por equipo.
 */
const _texPorAspecto = new Map();
function texturaPara(aspecto) {
  const clave = aspecto.toFixed(3);
  if (_texPorAspecto.has(clave)) return _texPorAspecto.get(clave);

  const base = texturaPantalla();
  const aT = base.userData.aspecto;
  const t = base.clone();
  t.needsUpdate = true;
  if (aspecto > aT) {
    const k = aT / aspecto;              // pantalla más ancha: se recorta arriba y abajo
    t.repeat.set(1, k);
    t.offset.set(0, (1 - k) / 2);
  } else {
    const k = aspecto / aT;              // más angosta: se recorta a los lados
    t.repeat.set(k, 1);
    t.offset.set((1 - k) / 2, 0);
  }
  _texPorAspecto.set(clave, t);
  return t;
}

/* ── Construcción del equipo ────────────────────────────── */

/**
 * Arma un equipo completo en 3D.
 * @param {object} eq   entrada del catálogo
 * @param {number} idxColor  índice del color elegido
 * @returns {THREE.Group}  centrado en el origen, pantalla mirando a +Z
 */
export function construirEquipo(eq, idxColor = 0) {
  const grupo = new THREE.Group();
  grupo.name = eq.id;

  const w = eq.dim.w * MM, h = eq.dim.h * MM, t = eq.dim.t * MM, r = eq.dim.r * MM;
  const color = eq.colores[idxColor] || eq.colores[0];
  const curva = eq.pantalla?.curva || 0;
  const bev = canto(t, curva);
  // En una extrusión con bisel, las caras planas quedan en los extremos del
  // grosor (el bisel se come el contorno, no la profundidad): van en ±t/2.
  const zFrente = t / 2;
  const zDorso = t / 2;          // lo mismo, medido desde el dorso

  /* Cuerpo */
  const geoCuerpo = new THREE.ExtrudeGeometry(shapeRect(w, h, r), {
    depth: t - 2 * bev,
    bevelEnabled: true,
    bevelThickness: bev,
    bevelSize: bev,
    bevelSegments: 10,
    curveSegments: 56,
    steps: 1
  });
  geoCuerpo.center();
  // Los equipos van de una tonalidad a otra en diagonal, no son de color plano.
  pintarDegradado(geoCuerpo, color.hex, color.hex2 || color.hex, color.giro ?? -55);

  // ExtrudeGeometry separa: grupo 0 = tapas (frente y dorso), grupo 1 = canto lateral.
  const cuerpo = new THREE.Mesh(geoCuerpo, [matCuerpo(color.acabado), matMarco()]);
  cuerpo.castShadow = true;
  cuerpo.receiveShadow = true;
  grupo.add(cuerpo);

  /* Medidas de la pantalla */
  const bezel = Math.max((eq.pantalla?.bezel || 2) * MM, bev + 0.02);
  const wP = w - 2 * bezel, hP = h - 2 * bezel, rP = Math.max(0.01, r - bezel);

  /* Frente: marco negro con el hueco de la pantalla recortado.
     Va calado —y no encimado— para que no pelee con la pantalla por el mismo plano. */
  const wF = w - 2 * bev, hF = h - 2 * bev, rF = Math.max(0.01, r - bev);
  const marco = shapeRect(wF, hF, rF);
  marco.holes.push(shapeRect(wP, hP, rP));
  const cristal = new THREE.Mesh(new THREE.ShapeGeometry(marco, 56), alFrente(matCristal(), 2));
  cristal.position.z = zFrente + 0.03;
  grupo.add(cristal);

  /* Pantalla encendida: un pelo más grande que el hueco y ligeramente atrás,
     así el marco le tapa la orilla y no queda una rendija. */
  const tex = texturaPara(wP / hP);
  const matPant = new THREE.MeshPhysicalMaterial({
    map: tex,
    emissive: 0xffffff,
    emissiveMap: tex,
    emissiveIntensity: 0.55,
    roughness: 0.14,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04
  });
  alFrente(matPant, 1);
  const pantalla = new THREE.Mesh(uvCaja(new THREE.ShapeGeometry(shapeRect(wP + 0.04, hP + 0.04, rP), 56)), matPant);
  pantalla.position.z = zFrente + 0.02;
  grupo.add(pantalla);

  /* Cámara frontal (hueco en la pantalla) */
  const hueco = eq.pantalla?.hueco;
  if (hueco) {
    const d = hueco.d * MM;
    const punto = new THREE.Mesh(new THREE.CircleGeometry(d / 2, 32), alFrente(matNegro(), 3));
    punto.position.set((hueco.x || 0) * MM, h / 2 - hueco.y * MM, zFrente + 0.04);
    grupo.add(punto);
    const brillo = new THREE.Mesh(new THREE.CircleGeometry(d / 2 * 0.45, 24), alFrente(matLente(), 4));
    brillo.position.copy(punto.position);
    brillo.position.z += 0.008;
    grupo.add(brillo);
  }

  /* ── Dorso: se arma dentro de un grupo volteado ──
     Dentro de este grupo, +Z apunta hacia AFUERA del dorso y la X va espejada. */
  const dorso = new THREE.Group();
  dorso.rotation.y = Math.PI;
  grupo.add(dorso);

  const cam = eq.camara;
  if (cam) {
    const mw = cam.ancho * MM, mh = cam.alto * MM, mr = (cam.radio ?? 8) * MM;
    const sal = (cam.saliente ?? 1.4) * MM;
    const cb = sal * 0.35;

    // La placa del módulo es metálica (dorada en el Blush Gold, a juego con el
    // equipo en los demás). Toma el primer tono, que es el que corre por la
    // parte alta del dorso, justo donde va la cámara.
    const metal = cam.metal || color.metal || color.hex;

    const geoMod = new THREE.ExtrudeGeometry(shapeModulo(cam, mw, mh, mr), {
      depth: sal, bevelEnabled: true, bevelThickness: cb, bevelSize: cb,
      bevelSegments: 6, curveSegments: 48, steps: 1
    });
    const modulo = new THREE.Mesh(geoMod, matMetal(metal));
    modulo.position.set(-cam.cx * MM, cam.cy * MM, zDorso - cb * 0.6);
    modulo.castShadow = true;
    dorso.add(modulo);

    const zTapa = modulo.position.z + sal + cb;   // superficie del módulo

    /* Lentes. Cada uno son tres piezas, como en el equipo real:
       un aro metálico grueso, un disco negro que ocupa casi todo,
       y la óptica —pequeña y descentrada— dentro de ese disco. */
    for (const l of (cam.lentes || [])) {
      const d = l.d * MM;
      const lx = modulo.position.x - l.x * MM;    // la X va espejada dentro del dorso
      const ly = modulo.position.y + l.y * MM;
      const alto = 0.10;                          // cuánto sobresale el conjunto

      const aro = new THREE.Mesh(new THREE.CylinderGeometry(d / 2, d / 2 * 0.97, alto, 48), matMetal(metal));
      aro.rotation.x = Math.PI / 2;
      aro.position.set(lx, ly, zTapa + alto / 2);
      dorso.add(aro);

      const disco = new THREE.Mesh(new THREE.CircleGeometry(d / 2 * 0.76, 48), alFrente(matNegro(), 2));
      disco.position.set(lx, ly, zTapa + alto + 0.004);
      dorso.add(disco);

      // La óptica no va al centro del disco: queda cargada hacia abajo-derecha.
      const dOpt = d * (l.optica ?? 0.30);
      const off = d * 0.13;
      const optica = new THREE.Mesh(new THREE.CircleGeometry(dOpt / 2, 40), alFrente(matLente(), 4));
      optica.position.set(lx + off * 0.35, ly - off, zTapa + alto + 0.012);
      dorso.add(optica);

      const brillo = new THREE.Mesh(new THREE.CircleGeometry(dOpt / 2 * 0.45, 28),
        alFrente(new THREE.MeshPhysicalMaterial({
          color: 0x2f6ea8, metalness: 1, roughness: 0.05
        }), 5));
      brillo.position.copy(optica.position);
      brillo.position.z += 0.006;
      dorso.add(brillo);
    }

    // Flash: pastilla alargada, no un punto
    if (cam.flash) {
      const d = cam.flash.d * MM;
      const g = uvCaja(new THREE.ShapeGeometry(shapeRect(d, d * 2.1, d / 2), 20));
      const f = new THREE.Mesh(g, alFrente(new THREE.MeshPhysicalMaterial({
        color: 0xfff2d6, emissive: 0xffdca0, emissiveIntensity: 0.3, roughness: 0.22, metalness: 0.1
      }), 2));
      f.rotation.z = Math.PI / 2;
      f.position.set(modulo.position.x - cam.flash.x * MM, modulo.position.y + cam.flash.y * MM, zTapa + 0.02);
      dorso.add(f);
    }
  }

  /* Botones laterales (solo en teléfonos) */
  if (eq.tipo !== 'tablet') {
    const perfil = (largo, ancho) => {
      const g = new THREE.ExtrudeGeometry(shapeRect(t * 0.42, largo, t * 0.16), {
        depth: ancho, bevelEnabled: true, bevelThickness: ancho * 0.4, bevelSize: ancho * 0.4,
        bevelSegments: 4, curveSegments: 16, steps: 1
      });
      // Los botones son piezas chicas: color metálico liso, sin degradado propio.
      const m = new THREE.Mesh(g, matMetal(color.hex2 || color.hex));
      m.rotation.y = Math.PI / 2;   // el grosor del botón apunta hacia +X
      m.castShadow = true;
      return m;
    };
    const salBoton = 0.045;
    const power = perfil(h * 0.085, salBoton);
    power.position.set(w / 2 - salBoton * 0.5, h * 0.16, 0);
    grupo.add(power);

    const vol = perfil(h * 0.155, salBoton);
    vol.position.set(w / 2 - salBoton * 0.5, h * 0.30, 0);
    grupo.add(vol);
  }

  /* Puerto de carga (cara inferior) */
  const usb = new THREE.Mesh(new THREE.ShapeGeometry(shapeRect(0.9, 0.26, 0.13), 16), alFrente(matNegro(), 2));
  usb.rotation.x = Math.PI / 2;
  usb.position.set(0, -h / 2 + 0.002, 0);
  grupo.add(usb);

  grupo.userData.alto = h;
  grupo.userData.ancho = w;
  return grupo;
}

/** Libera la memoria de video de un equipo que ya no se muestra. */
export function liberar(grupo) {
  grupo.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
  });
}

/* ── Escena, luces y entorno ────────────────────────────── */

/** Estudio fotográfico en miniatura: da los reflejos del metal y el cristal. */
function entornoEstudio(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const esc = new THREE.Scene();

  const sala = new THREE.Mesh(
    new THREE.BoxGeometry(60, 60, 60),
    new THREE.MeshBasicMaterial({ color: 0xe4e6ec, side: THREE.BackSide })
  );
  esc.add(sala);

  const panel = (w, h, color, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }));
    m.position.set(...pos);
    m.rotation.set(...rot);
    esc.add(m);
  };

  panel(34, 20, 0xffffff, [0, 29, 0], [Math.PI / 2, 0, 0]);          // softbox cenital
  panel(20, 30, 0xf2f4f8, [-29, 4, 6], [0, Math.PI / 2, 0]);         // relleno izquierdo
  panel(16, 26, 0x2c2f38, [29, 2, -4], [0, -Math.PI / 2, 0]);        // bandera oscura (define el canto)
  panel(24, 16, 0x30323a, [0, -2, -29], [0, 0, 0]);                  // fondo
  panel(40, 40, 0xb9bcc4, [0, -18, 0], [-Math.PI / 2, 0, 0]);        // piso
  // Panel frontal: sin él, los aros metálicos de la cámara se ven negros
  // al mirar el dorso, porque el metal solo devuelve lo que tiene enfrente.
  panel(32, 30, 0xf4f6fa, [0, 3, 29], [0, Math.PI, 0]);

  const tex = pmrem.fromScene(esc, 0.03).texture;
  esc.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pmrem.dispose();
  return tex;
}

/**
 * Prepara renderer, escena y cámara sobre un canvas.
 * @returns {{scene, camera, renderer, piso, redimensionar, render}}
 */
export function crearEscena(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.environment = entornoEstudio(renderer);

  // El rango near/far se mantiene apretado a propósito: con near muy chico se
  // pierde precisión de profundidad y las capas de la pantalla se pelean.
  const camera = new THREE.PerspectiveCamera(28, 1, 4, 260);
  camera.position.set(0, 0, 60);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-14, 24, 20);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 90;
  const s = 22;
  Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0012;
  key.shadow.radius = 3;
  scene.add(key);

  const relleno = new THREE.DirectionalLight(0xdfe6ff, 0.45);
  relleno.position.set(18, 6, 12);
  scene.add(relleno);

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.ShadowMaterial({ opacity: 0.17 })
  );
  piso.rotation.x = -Math.PI / 2;
  piso.receiveShadow = true;
  scene.add(piso);

  function redimensionar() {
    const p = canvas.parentElement;
    const w = p.clientWidth, h = p.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  return { scene, camera, renderer, piso, redimensionar, render: () => renderer.render(scene, camera) };
}

/* ── Control de giro con el dedo ─────────────────────────── */

/**
 * Órbita táctil: arrastrar gira, dos dedos acercan/alejan.
 * Vuelve a girar solo cuando nadie la toca.
 */
export class Orbita {
  constructor(canvas, camera, opciones = {}) {
    this.canvas = canvas;
    this.camera = camera;
    this.theta = 0;            // giro horizontal
    this.phi = 0;              // giro vertical
    this.radio = opciones.radio || 60;
    this.radioMin = opciones.radioMin || 22;
    this.radioMax = opciones.radioMax || 130;
    this.centro = new THREE.Vector3(0, 0, 0);

    this.vTheta = 0; this.vPhi = 0;
    this.arrastrando = false;
    this.ultimoToque = performance.now();
    this.autoGiro = opciones.autoGiro !== false;
    this.esperaAuto = opciones.esperaAuto ?? 3500;

    this._punteros = new Map();
    this._distPrev = 0;

    const el = canvas;
    el.style.touchAction = 'none';

    el.addEventListener('pointerdown', e => {
      el.setPointerCapture(e.pointerId);
      this._punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.arrastrando = true;
      this.vTheta = this.vPhi = 0;
      this.ultimoToque = performance.now();
    });

    el.addEventListener('pointermove', e => {
      const p = this._punteros.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      this.ultimoToque = performance.now();

      if (this._punteros.size >= 2) {
        const [a, b] = [...this._punteros.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (this._distPrev) this.radio *= this._distPrev / d;
        this._distPrev = d;
        this.radio = Math.max(this.radioMin, Math.min(this.radioMax, this.radio));
      } else {
        this.vTheta = -dx * 0.006;
        this.vPhi = -dy * 0.005;
      }
    });

    const soltar = e => {
      this._punteros.delete(e.pointerId);
      if (this._punteros.size < 2) this._distPrev = 0;
      if (this._punteros.size === 0) this.arrastrando = false;
      this.ultimoToque = performance.now();
    };
    el.addEventListener('pointerup', soltar);
    el.addEventListener('pointercancel', soltar);
    el.addEventListener('pointerleave', soltar);

    el.addEventListener('wheel', e => {
      e.preventDefault();
      this.radio = Math.max(this.radioMin, Math.min(this.radioMax, this.radio * (1 + Math.sign(e.deltaY) * 0.08)));
      this.ultimoToque = performance.now();
    }, { passive: false });
  }

  /** Lleva la vista a un ángulo concreto (en radianes) de forma suave. */
  irA(theta, phi) {
    this._destino = { theta, phi };
    this.ultimoToque = performance.now();
  }

  actualizar() {
    if (this._destino) {
      const dt = this._destino.theta - this.theta, dp = this._destino.phi - this.phi;
      this.theta += dt * 0.12;
      this.phi += dp * 0.12;
      if (Math.abs(dt) < 0.002 && Math.abs(dp) < 0.002) this._destino = null;
    } else {
      this.theta += this.vTheta;
      this.phi += this.vPhi;
      if (!this.arrastrando) {
        this.vTheta *= 0.93;
        this.vPhi *= 0.93;
        const quieto = performance.now() - this.ultimoToque > this.esperaAuto;
        if (this.autoGiro && quieto && Math.abs(this.vTheta) < 0.0015) {
          this.theta += 0.0022;
          this.phi += (0 - this.phi) * 0.02;
        }
      }
    }

    this.phi = Math.max(-1.25, Math.min(1.25, this.phi));

    const c = this.camera;
    c.position.set(
      this.centro.x + this.radio * Math.cos(this.phi) * Math.sin(this.theta),
      this.centro.y + this.radio * Math.sin(this.phi),
      this.centro.z + this.radio * Math.cos(this.phi) * Math.cos(this.theta)
    );
    c.lookAt(this.centro);
  }
}

export { THREE };
