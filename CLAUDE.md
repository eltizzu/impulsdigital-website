# Impuls Digital — Website (contexto de trabajo)

Web comercial de Impuls Digital (Málaga). El archivo que genera la web visible es **`index.html`**
(en la raíz). Los archivos `index-v2.html`, `index-v3.html`, `index-backup.html` e
`index-backup-v2.html` son **copias históricas**: no se editan salvo razón documentada.

## Regla permanente sobre las aplicaciones propias

> **Antes de modificar logos, textos, funciones, estados, enlaces o afirmaciones de una aplicación
> (Cotiza, BrasaFlow, Turnia, StockFlow, StayFlow), se debe releer su `docs/ESTADO_ACTUAL.md` dentro
> del proyecto fuente.** La web de Impuls Digital **no** es la fuente de verdad sobre las
> aplicaciones. Si un proyecto cambia, primero se actualiza su fuente canónica y después esta web.

El resumen vigente de cómo presentar cada app está en
[`docs/ESTADO_APLICACIONES.md`](docs/ESTADO_APLICACIONES.md): estado real, funciones demostrables,
límites, estado comercial, de identidad y de publicación, y qué se puede y qué no se puede afirmar.

Proyectos fuente:

- Cotiza → `C:\Users\titus\Desktop\Cotiza - App de presupuestos`
- BrasaFlow → `C:\Users\titus\Desktop\BrasaFlow - Gestion Hostelera`
- Turnia → `C:\Users\titus\Desktop\Turnia - Citas`
- StockFlow → `C:\Users\titus\Desktop\StockFlow`
- StayFlow → `C:\Users\titus\Desktop\StayFlow - Gestion vacacional`

## No presentar como real lo que no lo es

No usar "disponible", "en producción", "validado", "con clientes/usuarios", "tiempo real",
"API pública", "automático" o "listo para contratar" sobre las apps propias sin evidencia en la
fuente canónica. Distinguir siempre demo, prototipo, desarrollo local, prueba privada en
preparación e integración parcial de un producto comercial terminado.

## Deploy

El hosting es Vercel y publica al hacer push a la rama principal. **Nunca** hacer push, commit o
deploy sin permiso explícito de Marcos.
