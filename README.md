# Catálogo 3D — Odemás Angelópolis (HES 1217)

**En línea:** <https://angeljesus8-blip.github.io/showroom-hes1217/>
· QR para abrirlo en las tablets: `QR_showroom.png`


Muestra en 3D para las **tablets de piso**: el cliente gira el equipo con el dedo,
ve los colores reales y lo compara de tamaño con otro, aunque no haya pieza física
en exhibición.

No usa archivos de modelo 3D. Cada equipo se **dibuja por código** a partir de sus
medidas en milímetros, así que agregar uno nuevo es escribir sus datos, nada más.

---

## Actualizar precios o agregar equipos

Todo vive en **`catalogo.js`**. Es el único archivo que se toca.

1. Abre `catalogo.js` — arriba están las instrucciones completas.
2. Para un equipo nuevo: copia un bloque `{ ... }` entero, pégalo antes del `]`
   final y cambia el `id` (no se puede repetir).
3. Las medidas van en **milímetros**, tal como vienen en la ficha del fabricante
   (`Dimensiones: 162.6 x 75.1 x 8.4 mm`).
4. **Sube el número de versión en `sw.js`** (`const VERSION = 'showroom-v1'` →
   `'showroom-v2'`). Si no, las tablets siguen mostrando lo viejo porque lo tienen
   guardado.
5. `git commit` + `git push`. GitHub Pages publica solo.

### Precios

**Hoy no se muestran.** Todos los equipos traen `precio: null` y la app dice
*"Pregunta el precio a tu asesor"*, así ninguna promo vencida contradice al mostrador.
Si algún día los quieres visibles:

```js
precio: 21999,          // precio de lista
promo: 19499,           // opcional; hace que el de lista salga tachado
promoHasta: '2026-08-15'  // opcional; pasada la fecha, vuelve solo al de lista
```

La fecha se compara con el **día local** de México, no con UTC: una promo de último
día sigue viva hasta la medianoche real, no desde las 6 de la tarde.

### El aviso amarillo

Un equipo con `verificar: true` muestra *"Ficha técnica por confirmar"*. Sirve para
no dejar datos sin cotejar frente a un cliente. Cuando ya validaste la ficha oficial,
borra esa línea y el aviso desaparece.

---

## Instalar en las tablets de tienda

1. Abre el link en Chrome de la tablet.
2. Menú ⋮ → **Agregar a pantalla de inicio**.
3. Ábrelo desde el icono: entra a pantalla completa, sin barra de navegador.

Si nadie la toca por ~1.5 minutos, la app **vuelve sola al primer equipo**, lista
para el siguiente cliente.

---

## Estructura

| Archivo | Qué es |
|---|---|
| `catalogo.js` | **Los datos.** Equipos, medidas, colores, precios, características. |
| `index.html` | La pantalla: ficha, colores, comparador, carrusel. |
| `modelo3d.js` | El motor 3D: convierte las medidas en un equipo dibujado. |
| `vendor/three.module.min.js` | Three.js (la librería 3D), incluida para que funcione sin internet. |
| `sw.js` | Hace que la app abra aunque se caiga el wifi. Súbele la versión al actualizar. |

---

## Probar en la computadora

```powershell
cd "C:\Users\bladi\CLAUDE ANGEL\showroom-hes1217"
python -m http.server 5599
```

Y abre <http://127.0.0.1:5599>.

No sirve abrir `index.html` con doble clic: el navegador bloquea la carga de
módulos desde archivos sueltos. Tiene que ser por servidor.
