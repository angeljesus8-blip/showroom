# Catálogo — Odemás Angelópolis (HES 1217)

**En línea:** <https://angeljesus8-blip.github.io/showroom/>
· QR para abrirlo en las tablets: `QR_showroom.png`

> El repo se llamaba `showroom-hes1217` y se renombró a `showroom` el 3-ago-2026.
> La dirección vieja quedó en **404, GitHub no la redirige**: cualquier QR impreso
> antes de esa fecha hay que reemplazarlo por el nuevo.

Catálogo para las **tablets de piso**: el cliente ve el equipo, le cambia el color,
compara memorias y ve el precio, aunque no haya pieza en exhibición.

## ⚠️ Aquí se cobra en tienda

Esta pantalla es para **mostrar** y que la venta se cierre en el mostrador. **Nunca**
meter enlaces a la tienda en línea de HUAWEI ni de nadie, y **los precios salen de las
fuentes de la tienda** (tabla de preventa del tablero, reportes del POS), nunca
copiados de la web del fabricante: esos son los precios de ellos.

---

## Cómo funciona

Al elegir **modelo** o **color** cambian juntas las fotos, el precio, las memorias
disponibles y las características. Todo sale de `catalogo.js`.

- **Fotos:** los renders oficiales de HUAWEI, guardados en `fotos/`. Cada color trae
  sus vistas (dorso, ángulos, perfil, detalle) y se pasan arrastrando.
- **Características:** salen como nubes flotando junto al equipo al tocar
  *"Ver características"*. Van a los lados, nunca encima del producto.
- **Girarlo en 3D:** abre el visor oficial de HUAWEI a pantalla completa. Está
  revisado: no trae enlaces ni botones de compra.

---

## Actualizar precios o agregar equipos

Todo vive en **`catalogo.js`**, con las instrucciones arriba del archivo.

Después de cualquier cambio, **sube el número de versión en `sw.js`**
(`const VERSION = 'showroom-v9'` → `'showroom-v10'`). Si no, las tablets siguen
mostrando lo viejo porque lo tienen guardado.

### Agregar las fotos de un color

En la página del equipo en `consumer.huawei.com`, elige ese color y guarda las 5 fotos
del carrusel (las de 800×800 que vienen del CDN de la tienda). Se nombran
`modelo-color-1.webp` … `-5.webp` y se listan en el campo `fotos` de ese color.

Si un color no tiene las 5, no pasa nada: el visor muestra las que haya. El
**Tornasol** del Pro Max, por ejemplo, trae una sola: en la web de HUAWEI aparece
agotado y no publican su carrusel.

---

## Instalar en las tablets

1. Abre el link en Chrome de la tablet.
2. Menú ⋮ → **Agregar a pantalla de inicio**.
3. Ábrelo desde el icono: entra a pantalla completa, sin barra de navegador.

Si nadie la toca ~1.5 minutos, vuelve sola al primer equipo, lista para el siguiente
cliente.

**Sin wifi el catálogo funciona completo** (las fotos están guardadas en la tablet).
Lo único que necesita señal es el botón de girar en 3D.

---

## Estructura

| Archivo | Qué es |
|---|---|
| `catalogo.js` | **Los datos.** Equipos, precios, colores, fotos, características. Lo único que se toca. |
| `index.html` | La pantalla completa: visor, selectores, nubes y el 3D. |
| `fotos/` | Renders oficiales, uno por color y vista. |
| `sw.js` | Hace que abra sin internet. Súbele la versión al actualizar. |

## Probar en la computadora

```powershell
cd "C:\Users\bladi\CLAUDE ANGEL\showroom-hes1217"
python -m http.server 5599
```

Y abre <http://127.0.0.1:5599>. No sirve abrir el archivo con doble clic.
