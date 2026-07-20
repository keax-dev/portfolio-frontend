<p align="right">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/README-Espa%C3%B1ol-1f6feb?style=for-the-badge" alt="README en Español" />
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/README-English-0e8a16?style=for-the-badge" alt="README in English" />
  </a>
</p>

# Portfolio Frontend

Aplicación frontend del portafolio público y panel administrativo, construida con Angular 22, componentes standalone, Angular Material, Vitest, Playwright y despliegue automatizado con Docker.

## Resumen funcional

Este proyecto expone dos experiencias principales:

- Portafolio público con perfil, educación, habilidades, catálogo de proyectos, redes sociales y formulario de contacto.
- Panel administrativo protegido para gestionar el contenido del portafolio y consultar el dashboard de visitantes.

Rutas principales:

- `/`: portafolio público.
- `/login`: acceso autenticado.
- `/home`: panel administrativo protegido por guard.

## Qué está implementado

### Portafolio público

- Carga del perfil principal con foto, descripción, CV localizado y enlaces sociales.
- Apertura del CV en español o inglés según el idioma activo del portafolio.
- Secciones de educación, habilidades y proyectos renderizadas desde la API.
- Catálogo unificado de proyectos presentado como acordeón, con título, tecnologías ordenadas, carrusel centrado y acciones disponibles.
- Carrusel para todos los proyectos, incluso cuando existe una sola imagen, con soporte de una a tres imágenes por proyecto.
- Modal de detalles con descripción localizada, tecnologías, links e imágenes apiladas; la ampliación de imágenes está disponible únicamente desde este modal.
- Modal de contacto con formulario reactivo, validaciones y envío al backend.
- Selector de idioma para experiencia pública en español e inglés.
- Navegación por secciones del portafolio y consumo de textos localizados desde `ui-text.ts`.
- Registro de visitas con integración de geolocalización externa.

### Panel administrativo

- Login protegido con sesión JWT.
- Gestión CRUD de:
  - instituciones
  - educación
  - habilidades
  - tecnologías
  - proyectos
  - redes sociales
  - perfil principal
- Catálogo de tecnologías administrado únicamente por nombre; su posición se define por cada relación dentro de un proyecto.
- Formulario de proyectos con una o varias tecnologías ordenadas, links tipados y ordenados, y entre una y tres imágenes.
- Edición de imágenes existentes y eliminación precisa de tecnologías o links seleccionados, conservando las relaciones restantes.
- Gestión independiente de las URLs del CV en inglés y español desde el perfil principal.
- Dashboard de visitantes para revisar métricas, países, ciudades y trazas de acceso.
- Tablas reutilizables con búsqueda, paginación, ordenamiento y estados vacíos/error/loading.
- Formularios con Angular Material y botones reutilizables con estado de carga.

### Modelo actual de proyectos

- Cada registro representa un proyecto completo; frontend y backend ya no se publican como proyectos separados.
- Los títulos y descripciones se mantienen en español e inglés, junto con una posición general del proyecto.
- `technologies` contiene una o varias tecnologías, cada una con su propia posición dentro del proyecto y sin duplicados.
- `images` es la única fuente de imágenes del proyecto y contiene entre uno y tres elementos ordenados; el campo legado `picture` ya no se utiliza.
- `links` es opcional y admite `DEPLOY`, `GITHUB`, `GITHUB_FRONTEND` y `GITHUB_BACKEND`, con posiciones únicas dentro del proyecto.

### UX y comportamiento transversal

- Interceptor HTTP con `Authorization: Bearer` para peticiones autenticadas.
- Guards para acceso invitado y acceso protegido.
- Watcher de expiración de sesión y cierre automático.
- Notificaciones visuales centralizadas para éxito, advertencia, información y error.
- Estrategia de títulos y metadatos SEO por ruta.
- Scroll restoration y anchor scrolling en la navegación.
- Configuración de API por `environment.ts` y `environment.prod.ts`.

## Stack técnico

- Angular 22
- TypeScript 6
- Angular Router
- Angular Material
- RxJS
- Bootstrap 5
- `ngx-spinner`
- Vitest para pruebas unitarias e integración
- Playwright para pruebas E2E
- ESLint + Prettier para calidad estática
- Docker + Nginx para empaquetado y despliegue
- GitHub Actions + GHCR para CI/CD

## Arquitectura

La aplicación está organizada por capas y features:

- `src/app/core`: interceptor, guards, sesión, notificaciones, SEO y servicios transversales.
- `src/app/shared`: componentes reutilizables, directivas e interfaces compartidas.
- `src/app/features/auth`: flujo de autenticación.
- `src/app/features/portfolio`: experiencia pública del portafolio.
- `src/app/features/admin`: formularios, tablas y dashboard administrativo.
- `src/app/**/testing/unit`: pruebas unitarias organizadas por módulo.
- `src/app/**/testing/integration`: pruebas de integración por feature.
- `e2e`: flujos end-to-end con Playwright agrupados por dominio funcional.

Decisiones técnicas relevantes:

- lazy loading por rutas para `portfolio`, `login` y `home`
- componentes standalone como estándar del proyecto
- `Signals` para estado simple de UI
- `ChangeDetectionStrategy.OnPush` en componentes clave
- componentes compartidos para botones, tablas y encabezados de página
- textos reutilizables centralizados para evitar strings duplicados

## Comportamiento de sesión e idioma

- El interceptor de autenticación adjunta automáticamente el token a las solicitudes API.
- Las rutas protegidas redirigen a `/login` cuando no existe sesión válida.
- Las sesiones expiradas se limpian automáticamente.
- La experiencia pública (`/`) soporta español e inglés.
- El área autenticada se mantiene en inglés para la gestión administrativa.

## Integración con backend

Ambientes configurados:

- Desarrollo: `http://localhost:9090/api`
- Producción: `https://www.api.keax.dev/api`

Servicio externo usado por el registro de visitas:

- Geolocalización: `https://ip.guide`

## Requisitos

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`
- npm compatible con la versión instalada de Node
- Docker Desktop o Docker Engine si vas a probar la imagen localmente

## Instalación

```bash
npm install
```

## Desarrollo local

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

### Validación completa local

```bash
npm run validate
```

Este comando replica el flujo principal del CI: formato, lint, typecheck, pruebas unitarias, integración, E2E y build de producción. Para preparar Chromium en una instalación nueva:

```bash
npx playwright install chromium
```

## Estrategia de pruebas

El proyecto separa las pruebas en tres niveles:

- Unitarias: validan componentes, servicios, guards, pipes, directivas e interceptor de forma aislada.
- Integración: validan colaboración real entre `HttpClient`, Router, servicios y componentes clave.
- E2E: validan flujos completos en navegador con Playwright.

Organización actual de pruebas:

- `src/app/core/testing/unit`
- `src/app/shared/testing/unit`
- `src/app/features/auth/testing/unit`
- `src/app/features/auth/testing/integration`
- `src/app/features/admin/testing/unit`
- `src/app/features/portfolio/testing/unit`
- `src/app/features/portfolio/testing/integration`
- `e2e/auth`
- `e2e/admin`
- `e2e/portfolio`

Cobertura mínima configurada:

- Statements: `80%`
- Branches: `80%`
- Functions: `80%`
- Lines: `80%`

Notas importantes:

- Las pruebas E2E por defecto son deterministas y mockean la API.
- `npm run test:e2e:live` ejecuta un smoke separado contra el backend real.
- Los flujos administrativos verifican la eliminación de la relación seleccionada y el payload reordenado de tecnologías del proyecto.
- En CI, Playwright conserva trazas, capturas y video solo cuando hay fallos.

## Docker local

Construcción manual:

```bash
docker build -t portfolio-frontend .
docker run --rm -p 8080:80 portfolio-frontend
```

Con Docker Compose:

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

Acceso local del contenedor:

```text
http://localhost:8080
```

## Build de producción

```bash
npm run build -- --configuration=production
```

Salida generada:

```text
dist/frontend
```

La build de producción incluye:

- reemplazo de `environment.ts` por `environment.prod.ts`
- `outputHashing`
- budgets de bundle y estilos

## CI/CD

El proyecto usa GitHub Actions con tres workflows principales:

- `ci.yml`: valida formato, lint, typecheck, pruebas unitarias, pruebas de integración, E2E y build de producción.
- `deploy-prod.yml`: publica la imagen Docker en GitHub Container Registry y actualiza el contenedor en AWS Lightsail.
- `rollback-prod.yml`: permite restaurar manualmente una imagen previa de producción usando un tag exacto.

Flujo actual:

- Push a `main`: ejecuta `ci.yml`.
- Pull request hacia `main`: ejecuta `ci.yml`.
- CI exitoso sobre `main`: dispara `deploy-prod.yml`.
- Rollback de producción: se ejecuta manualmente desde GitHub Actions con `rollback-prod.yml`.

Pipeline actual de CI:

- verificación de formato con Prettier
- lint con Angular ESLint
- typecheck de aplicación, tests y E2E
- pruebas unitarias con Vitest
- pruebas de integración con Vitest
- pruebas E2E con Playwright
- build final de producción

## Despliegue de producción

Arquitectura actual:

- GitHub Actions construye la imagen con `Dockerfile`.
- La imagen se publica en GHCR con tags `latest` y `sha-<commit>`.
- Un self-hosted runner instalado en el propio Lightsail ejecuta el despliegue localmente.
- Lightsail hace `docker compose pull` y `docker compose up -d`.
- El contenedor frontend expone `127.0.0.1:4201`.
- Nginx del host actúa como reverse proxy para `https://www.keax.dev`.
- El directorio remoto de despliegue usa `docker-compose.prod.yml` y `.env.prod`.

Archivos relevantes:

- `Dockerfile`: build multi-stage con Node 24 + Nginx.
- `default.conf`: configuración Nginx dentro del contenedor.
- `docker-compose.yml`: ejecución local.
- `docker-compose.prod.yml`: ejecución remota en Lightsail.
- `.github/workflows/deploy-prod.yml`: publicación y despliegue productivo.
- `.github/workflows/rollback-prod.yml`: restauración manual de versiones previas.

Validaciones útiles en producción:

```bash
docker ps
cd /opt/portfolio-frontend && docker compose --env-file .env.prod -f docker-compose.prod.yml ps
curl -I http://127.0.0.1:4201
```

Rollback manual desde GitHub Actions:

- Ir a `Actions > Rollback Prod`.
- Ejecutar `Run workflow` sobre la rama `main`.
- En `image_tag`, usar un tag inmutable publicado previamente, por ejemplo `sha-a7bc530`.

Qué hace el rollback:

- actualiza `.env.prod` con la imagen objetivo
- descarga esa imagen desde GHCR
- recrea el contenedor frontend
- valida la respuesta HTTP local con `curl`

Referencia local del despliegue actual:

```bash
cat /opt/portfolio-frontend/.env.prod
```

## Secrets requeridos para producción

El workflow de despliegue usa el environment `production` en GitHub y requiere estos secrets:

- `LIGHTSAIL_FRONTEND_PATH`
- `GHCR_READ_TOKEN`

Además, para que el despliegue funcione como está documentado, el servidor de producción debe tener:

- Docker Engine
- Docker Compose plugin
- un self-hosted runner de GitHub Actions con labels `self-hosted`, `Linux`, `X64` y `production`

Además, el repositorio debe tener habilitado:

- `Settings > Actions > General > Workflow permissions > Read and write permissions`
- protección de rama para `main` con el check requerido `validate`

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
    testing/
e2e/
public/
.github/
  workflows/
```

## Recomendaciones para desarrollo

- Ejecuta `npm run validate` antes de subir cambios para reproducir localmente las validaciones del CI.
- Usa `npm run test:unit` para iteraciones rápidas.
- Usa `npm run test:integration` cuando toques autenticación, routing o servicios HTTP.
- Usa `npm run test:e2e` para validar flujos críticos antes de cerrar una entrega.
- Si trabajas en Windows, mantén el repositorio con finales de línea LF usando `.gitattributes`.
- Si modificas despliegue, prueba primero en `development` para validar CI antes de promover a `main`.

## Notas

- GitHub no tiene un selector de idioma nativo para README; por eso se mantienen `README.md` y `README.en.md`.
- El despliegue productivo actual ya no depende de SSH abierto desde GitHub Actions; la actualización corre directamente dentro del Lightsail mediante un self-hosted runner.
