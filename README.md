# Catálogo 3D — Odemás Angelópolis (HES 1217)

**En línea:** <https://angeljesus8-blip.github.io/showroom-hes1217/>
· QR para abrirlo en las tablets: `QR_showroom.png`

Muestra en 3D para las **tablets de piso**: el cliente gira el equipo con el dedo
y le cambia el color, aunque no haya pieza física en exhibición.

La vista 3D es el **visor oficial de HUAWEI**, embebido tal cual desde su propio
proveedor. No se copia nada: es el mismo visor que Huawei publica en su página, así
que el equipo se ve exactamente como es. Trae su propio selector de modelo y de
color, en español.

Las características salen como **nubes flotando junto al equipo**: el cliente toca
"Ver características" y van apareciendo una tras otra. Van a los lados, nunca encima
del producto, y se pueden seguir girando el equipo con ellas puestas.

**Por qué a los lados y no ancladas a cada pieza:** el visor es de otro sitio, así que
no se puede saber dónde está el equipo dentro ni hacia dónde lo giró el cliente. Lo que
sí se sabe es que queda centrado y gira sobre su eje — por eso el centro siempre está
libre y ahí es donde no se ponen nubes.

---

## ⚠️ Necesita internet

El visor viene de la página de HUAWEI, así que **sin wifi no hay 3D**. La app abre
igual y muestra un aviso pidiendo revisar la conexión, en vez de quedarse en blanco.

## ⚠️ La dirección del visor va a cambiar

La dirección del visor pertenece a una campaña (`project-h-2026q204-alpha`: trae el
trimestre y la palabra "alpha"). **Cuando Huawei cambie de campaña, va a dejar de
cargar.** Si eso pasa:

1. Entra a la ficha del equipo en `consumer.huawei.com`
2. Abre el visor 3D (el botón que dice **3D**)
3. Mira el `src` del iframe que se abre
4. Cambia `VISOR_3D` en `index.html` por esa dirección
5. Súbele la versión a `sw.js` y haz push

---

## Actualizar la ficha o agregar equipos

Todo vive en **`catalogo.js`**. Es el único archivo que se toca para contenido.
Arriba del archivo están las instrucciones completas.

Las nubes salen del campo **`nubes`** de cada equipo: máximo 5, y son **ganchos de
venta**, no la ficha completa. Texto corto, que se lea de lejos ("200 MP", no "Cámara
principal de 200 megapíxeles con apertura f/2.6"). Si un equipo no trae `nubes`, se
usan las primeras 5 de `specs`.

**Ojo:** el selector de arriba (el del visor 3D) es de Huawei y **no se puede
sincronizar** con nuestra ficha — el visor no acepta que le digan qué modelo mostrar.
Por eso el selector de la ficha va rotulado "FICHA TÉCNICA", para que se entienda que
son dos cosas distintas.

Después de cualquier cambio, **sube el número de versión en `sw.js`**
(`const VERSION = 'showroom-v3'` → `'showroom-v4'`). Si no, las tablets siguen
mostrando lo viejo porque lo tienen guardado.

### Precios

No se muestran, por decisión de Ángel: la app dice *"Pregunta el precio a tu asesor"*,
así ninguna promo vencida contradice al mostrador.

---

## Instalar en las tablets de tienda

1. Abre el link en Chrome de la tablet.
2. Menú ⋮ → **Agregar a pantalla de inicio**.
3. Ábrelo desde el icono: entra a pantalla completa, sin barra de navegador.

Si nadie la toca por ~1.5 minutos, el visor **se reinicia solo**, para que el
siguiente cliente no lo encuentre girado y en otro color.

---

## Estructura

| Archivo | Qué es |
|---|---|
| `catalogo.js` | **Los datos.** Equipos, medidas, colores, características. |
| `index.html` | La pantalla: visor embebido + ficha. `VISOR_3D` es la dirección del visor. |
| `sw.js` | Hace que el cascarón abra rápido. Súbele la versión al actualizar. |
| `modelo3d.js` + `vendor/` | **Respaldo, hoy sin usar.** Motor que dibuja los equipos por código a partir de sus medidas. Quedó de la versión anterior: si el visor de Huawei desaparece y no hay reemplazo, se puede reactivar. |

## Probar en la computadora

```powershell
cd "C:\Users\bladi\CLAUDE ANGEL\showroom-hes1217"
python -m http.server 5599
```

Y abre <http://127.0.0.1:5599>. No sirve abrir el archivo con doble clic.
