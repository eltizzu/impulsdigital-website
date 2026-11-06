# Estado de las aplicaciones en la web de Impuls Digital

**Fecha de revisión:** 2026-11-06
**Hecho por:** auditoría asistida, contrastando la web contra la fuente canónica de cada proyecto.

> Este documento registra cómo se deben presentar en `impulsdigital.es` las cinco aplicaciones
> propias. La web **no** es la fuente de verdad sobre las apps: la fuente es el `docs/ESTADO_ACTUAL.md`
> de cada proyecto. Si un proyecto cambia, primero se actualiza su fuente canónica y después esta web.

---

## Cotiza

- **Proyecto fuente:** `C:\Users\titus\Desktop\Cotiza - App de presupuestos`
- **Documento canónico consultado:** `docs/ESTADO_ACTUAL.md` (2026-11-06)
- **Estado real:** demo funcional local en preparación para una prueba privada con tres pintores. 0 de 3 demostraciones registradas.
- **Funciones demostrables:** crear presupuestos de reformas/oficios, plantillas, exportar a PDF, historial, recorrido guiado, ayuda y panel (dashboard) basado en presupuestos guardados. Persistencia local en el navegador.
- **Límites:** no calcula precios automáticamente desde fuentes externas; la nube (Supabase) no está operativa; las mejoras locales nuevas no están desplegadas.
- **Estado comercial:** sin piloto, sin clientes, sin ingresos, sin validación.
- **Estado de identidad:** identidad azul y dorada aprobada, integrada localmente, **no publicada**.
- **Estado de publicación:** hay una versión antigua publicada; la actual local no está desplegada.
- **Afirmaciones permitidas:** "demo funcional", "en preparación para validación con pintores", "hecha por Impuls".
- **Afirmaciones prohibidas:** "validado", "en producción", "con clientes", "SaaS", "disponible para contratar".
- **Enlace usado por la web:** `https://cotiza-app-de-presupuestos-y9qm.vercel.app` (muestra una versión anterior).

## BrasaFlow

- **Proyecto fuente:** `C:\Users\titus\Desktop\BrasaFlow - Gestion Hostelera`
- **Documento canónico consultado:** `docs/ESTADO_ACTUAL.md` (2026-11-06)
- **Estado real:** demo web local (se abre con un iniciador de Windows, Node + SQLite). En preparación para una prueba privada centrada en inventario y pedidos.
- **Funciones demostrables:** inventario base de productos habituales, faltantes, preparación de pedidos, apertura manual de WhatsApp, recepción e historial. Pantallas adicionales (equipo, turnos, fichajes, etc.) son demostrables pero fuera de la prueba actual.
- **Límites:** no hace conteo exacto de stock; abrir WhatsApp no demuestra que el pedido se envió; sin nube ni acceso multiusuario remoto; los empleados no pueden guardar cambios (solo empresa/encargados guardan snapshots). Reservas, Comandas y Connect son propuestas futuras, no funciones integradas.
- **Estado comercial:** sin pilotos, sin restaurantes clientes, sin ingresos, sin validación.
- **Estado de identidad:** identidad "Brasa 2A" integrada localmente.
- **Estado de publicación:** no consta una URL pública operativa verificada de esta versión.
- **Afirmaciones permitidas:** "demo local", "gestión de inventario y pedidos para restaurantes", "en preparación para una prueba privada".
- **Afirmaciones prohibidas:** "ecosistema completo", "suite", "multi-sede", "en producción", "con restaurantes clientes", "stock exacto en tiempo real".
- **Enlace usado por la web:** `https://brasaflow-gestion-hostelera.vercel.app` (estado de operatividad no verificado en esta auditoría — revisar antes de publicar).

## Turnia

- **Proyecto fuente:** `C:\Users\titus\Desktop\Turnia - Citas`
- **Documento canónico consultado:** `docs/ESTADO_ACTUAL.md` (2026-11-06)
- **Estado real:** demo pública funcional con datos ficticios y persistencia local. El enlace público de reserva guarda de verdad (RPC). Orientada a peluquerías, barberías y belleza.
- **Funciones demostrables:** agenda diaria/semanal, clientes, servicios, equipo, bloqueos, reportes; reserva pública real; preparación/apertura de WhatsApp.
- **Límites:** el panel del negocio todavía no guarda correctamente todas sus acciones; WhatsApp prepara/abre mensajes pero no envía de forma automática; fisioterapia/salud quedan fuera del piloto.
- **Estado comercial:** sin piloto, sin clientes, sin ingresos, ningún negocio real usándola.
- **Estado de identidad:** identidad "Turnia — A Encuentro" aprobada e integrada localmente, **no publicada**.
- **Estado de publicación:** demo pública publicada y verificada; identidad nueva aún no publicada.
- **Afirmaciones permitidas:** "demo funcional", "reserva pública real", "para peluquerías/barberías/estética".
- **Afirmaciones prohibidas:** "confirmación automática por WhatsApp", "panel completo que guarda todo", "con clientes/negocios reales", "en producción".
- **Enlace usado por la web:** `https://turnia-citas.vercel.app` (demo pública funcional).

## StockFlow

- **Proyecto fuente:** `C:\Users\titus\Desktop\StockFlow`
- **Documento canónico consultado:** `docs/ESTADO_ACTUAL.md` (2026-11-06)
- **Estado real:** sistema de inventario para comercios con productos con variantes. Tiene código/arquitectura amplia (API, Realtime, RLS, RPC, PWA), pero gran parte depende de Supabase, cuyo último estado documentado es inactivo/pausado.
- **Funciones demostrables:** cargar productos y variantes, registrar entradas/ventas/ajustes, ver stock, costo/precio/margen, alertas de faltantes (comprobado a nivel local).
- **Límites:** API, Realtime, RLS, RPC y sincronización **no verificados en producción**; la nube no está operativa; las pruebas son principalmente locales; GORI es una demostración, no un cliente real.
- **Estado comercial:** sin comercios reales, sin pilotos, sin clientes pagos, sin ingresos, precios no validados.
- **Estado de identidad:** símbolo "S" azul y violeta integrado localmente, **no publicado**. El logo del propio comercio tiene prioridad sobre la marca de plataforma.
- **Estado de publicación:** app publicada en una URL, pero la nube no está operativa.
- **Afirmaciones permitidas:** "app de inventario en desarrollo", "demo", "control de stock, entradas, ventas y faltantes".
- **Afirmaciones prohibidas:** "stock en tiempo real verificado", "API pública y operativa", "disponible/contratable", "en producción", "con comercios usándola".
- **Enlaces usados por la web:** tarjeta → `stockflow.html` (con aviso de estado); dentro de esa página → `https://stockflow-marcos-projects2.vercel.app`.

## StayFlow

- **Proyecto fuente:** `C:\Users\titus\Desktop\StayFlow - Gestion vacacional`
- **Documento canónico consultado:** `CLAUDE.md` + `docs/ESTADO_ACTUAL.md` (2026-11-06)
- **Estado real:** demo funcional local para gestión de alquiler vacacional. Nadie la ha probado todavía.
- **Funciones demostrables:** panel de entradas, salidas, limpiezas, responsables e incidencias, con datos ficticios. Persistencia local.
- **Límites:** sin Supabase conectado; la publicación técnica existente no equivale a un producto validado; los cambios locales nuevos (incluida la identidad) no constan desplegados.
- **Estado comercial:** sin gestores reales, sin pilotos, sin clientes, sin ingresos.
- **Estado de identidad:** símbolo "S" en azul marino y verde agua, aprobado e integrado localmente (raíz y `public/`), **no confirmado como desplegado**.
- **Estado de publicación:** existe una publicación técnica previa, fuera de buscadores; no es un producto comercial.
- **Afirmaciones permitidas:** "demo funcional en local", "en preparación para validar con gestores".
- **Afirmaciones prohibidas:** "validado", "en producción", "con gestores/clientes", "nube conectada", "disponible".
- **Enlace usado por la web:** `https://stayflow-gestion-vacacional.vercel.app` (publicación técnica previa, no producto).

---

## Contradicciones corregidas en esta revisión

1. **BrasaFlow** se presentaba como "ecosistema completo / suite" con reservas, comandas y proveedores integrados → corregido a demo local centrada en inventario y pedidos, en preparación para prueba privada.
2. **Cotiza** decía "en validación con profesionales reales" → corregido: 0 de 3 demostraciones, demo funcional en preparación.
3. **Turnia** prometía "confirmación automática por WhatsApp" (no existe) y mencionaba "masajes" (fuera del piloto) → corregido.
4. **StockFlow** se presentaba con "stock en tiempo real" y "API para conectar con tu web" como operativos, y la sección de tiendas prometía sincronización automática y un "Pack 699€ + 29€/mes" → corregido a "en desarrollo"; se retiró el pack con precio; se añadió un aviso de estado en `stockflow.html`.
5. **StayFlow** decía "en validación con gestores reales" (nadie la probó) → corregido a demo local en preparación para validar.

## Ronda final (2026-11-06) — decisiones aplicadas

**`stockflow.html` reescrita** como presentación de un proyecto en desarrollo, no como servicio contratable. Se eliminaron todos los precios (99€, 29€/mes, pack 699€+29€/mes), el "empezás en 48 hs", los botones de compra ("Empezar ahora", "Solicitar acceso beta", "Consultar pack") y el pack ecosistema. La sección de precios se reemplazó por **"Estado del proyecto"**. API, Realtime y sincronización quedaron marcados como "en desarrollo, no verificados como servicio". `title`, meta description, hero, funciones, FAQ, CTA final y footer corregidos. CTA vigentes: "Consultar sobre su desarrollo", "Estado del proyecto", "Conocer el proyecto".

**Enlaces de las tarjetas** (para no enviar a versiones antiguas):

- **Cotiza, BrasaFlow, StayFlow** → botón **"Consultar →"** a WhatsApp. Ya **no** enlazan su demo pública antigua (no hay página interna propia que sí represente la versión local).
- **StockFlow** → **"Conocer el proyecto →"** a `stockflow.html` (interna, ya honesta).
- **Turnia** → **"Ver la demo →"** a `turnia-citas.vercel.app`. Es el único enlace público conservado, porque su reserva pública está documentada como funcional.

**Archivos temporales:** `_audit_*.png`, `_antes_*.png`, `_final_*.png` quedaron en la carpeta; no se pudieron borrar por permisos, pero **no están enlazadas en ningún HTML**, así que no se publican. Conviene borrarlas a mano.
