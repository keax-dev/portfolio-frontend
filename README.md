<p align="right">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/README-Espa%C3%B1ol-1f6feb?style=for-the-badge" alt="README en Español" />
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/README-English-0e8a16?style=for-the-badge" alt="README in English" />
  </a>
</p>

# Portfolio Frontend

Aplicación frontend del portafolio y panel administrativo construida con Angular 22, componentes standalone, Signals, Vitest y Playwright.

## Resumen

Este proyecto expone dos experiencias principales:

- Portafolio público con perfil, educación, habilidades, tecnologías, proyectos, redes sociales y formulario de contacto.
- Panel administrativo protegido para gestionar el contenido del portafolio y consultar el dashboard de visitantes.

## Stack técnico

- Angular 22
- TypeScript 6
- Angular Router
- Angular CDK Dialog
- RxJS
- Bootstrap 5
- `ngx-spinner`
- Vitest para pruebas unitarias e integración
- Playwright para pruebas E2E
- ESLint + Prettier para calidad estática

## Arquitectura

La aplicación está organizada por capas y features:

- `src/app/core`: servicios transversales, guards, interceptor, notificaciones y utilidades de sesión.
- `src/app/shared`: componentes reutilizables, directivas e interfaces compartidas.
- `src/app/features/auth`: flujo de autenticación.
- `src/app/features/portfolio`: experiencia pública del portafolio.
- `src/app/features/admin`: formularios, tablas y dashboard administrativo.
- `src/app/integration`: pruebas de integración con `HttpClient`, Router y servicios reales.
- `e2e`: flujos end-to-end con Playwright.

Rutas principales:

- `/`: portafolio público.
- `/login`: acceso autenticado.
- `/home`: panel administrativo protegido por guard.

## Comportamiento de sesión

- El token se adjunta automáticamente a las solicitudes API mediante el interceptor de autenticación.
- Las rutas protegidas usan guards para redirigir usuarios no autenticados.
- Las sesiones expiradas se limpian y redirigen a `/login`.
- El panel administrativo inicia un watcher para cerrar sesión cuando vence el token.

## Integración con backend

Ambientes configurados:

- Desarrollo: `http://localhost:9090/api`
- Producción: `https://www.api.keax.dev/api`

Servicio externo usado por el registro de visitas:

- Geolocalización: `https://ip.guide`

## Requisitos

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`
- npm compatible con la versión de Node instalada

## Instalación

```bash
npm install
```

## Ejecución local

Levanta el servidor de desarrollo:

```bash
npm start
```

La aplicación queda disponible en:

```text
http://localhost:4200
```

## Scripts disponibles

### Desarrollo

```bash
npm start
npm run build
npm run watch
```

### Calidad

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
```

### Pruebas

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:live
```

## Estrategia de pruebas

El proyecto separa las pruebas en tres niveles:

- Unitarias: validan componentes, servicios, guards, pipes, directivas e interceptor de forma aislada.
- Integración: validan colaboración real entre `HttpClient`, Router, guards, servicios y componentes clave.
- E2E: validan flujos completos en navegador con Playwright.

Cobertura mínima configurada:

- Statements: `80%`
- Branches: `80%`
- Functions: `80%`
- Lines: `80%`

Notas importantes:

- Las pruebas E2E son deterministas y mockean la API para no depender del backend externo.
- `npm run test:e2e:live` ejecuta un smoke separado contra el backend real y no forma parte del flujo E2E determinista por defecto.
- Las pruebas de integración usan `HttpTestingController` y piezas reales del framework cuando aporta valor.

## Build de producción

```bash
npm run build
```

Salida generada:

```text
dist/frontend
```

La build de producción incluye:

- reemplazo de `environment.ts` por `environment.prod.ts`
- `outputHashing`
- budgets de bundle y estilos

## Convenciones del proyecto

- Se usan componentes standalone por defecto.
- El estado de UI simple se maneja con Signals.
- La navegación y protección de rutas están centralizadas en `core`.
- Los contratos HTTP usan un envelope `ApiResponse<T>`.
- La calidad del código se valida con Prettier, ESLint y typecheck.

## Estructura rápida

```text
src/
  app/
    core/
    shared/
    features/
      auth/
      portfolio/
      admin/
    integration/
e2e/
public/
```

## Recomendaciones para desarrollo

- Ejecuta `npm run format:check`, `npm run lint` y `npm run typecheck` antes de subir cambios.
- Usa `npm run test:unit` para cambios locales rápidos.
- Usa `npm run test:integration` cuando toques autenticación, routing o servicios HTTP.
- Usa `npm run test:e2e` para validar flujos críticos antes de cerrar una entrega.

## Observaciones

- GitHub no tiene un selector de idioma nativo para README. La solución más práctica y estándar es mantener dos archivos y enlazarlos con badges como los de la parte superior.
- Si más adelante quieres, también se puede agregar una tabla de contenidos o badges adicionales de estado de cobertura, lint y versión.
