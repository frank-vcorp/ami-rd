# PROYECTO: RD-AMI (Cliente: AMI)

## Flujo de estados
- [x] Pendiente
- [x] En Progreso (Planeación y scaffolding)
- [ ] Hecho
- [ ] Aprobado

## Objetivo general
Implementar el **Residente Digital con IA (RD-AMI)** para automatizar la ingesta, procesamiento y emisión de expedientes médicos ocupacionales, alineado con el ecosistema de Google Cloud y los hitos comprometidos con Alan (CEO de AMI).

## Entregables clave por fase
| Fase | Objetivo | Entregables de salida | Estado |
|------|----------|-----------------------|--------|
| FASE 0 – MVS (Sem 1-4) | Validar extremo a extremo con 1 expediente completo | Ingesta manual, pipeline OCR/normalizador inicial, panel médico básico, emisión PDF con folio y QR | Planeado |
| FASE 1 – Piloto (Sem 5-12) | Procesar 10 expedientes reales con ajustes clínicos | Ingesta automatizada (carpeta/SFTP), motor de reglas semafórico, dashboard médico, bitácora y métricas iniciales | Planeado |
| FASE 2 – Consolidación (Sem 12-24) | Versión institucional lista para operación | Integraciones ECG/Campimetría/Toxicológico, roles multi-sede, dashboard ejecutivo, documentación y despliegue estable en GCP | Planeado |
| FASE 3 – Producción (24+) | Operación comercial y SLA | Monitoreo 24/7, mantenimiento evolutivo, roadmap de mejoras | Planeado |

## Backlog técnico priorizado (Integra Evolucionada)

El backlog se alinea al cronograma comprometido con Alan (MVS semanas 1‑4, Piloto semanas 5‑12) y se estructura por épicas/US con criterios de aceptación (CA) y checklists de calidad (CQ). Cada historia debe registrar bitácora y pruebas asociadas antes de moverse a “Done”.

### FASE 0 – MVS (Semanas 1‑4)
| Epic | User Story | Descripción | CA/CQ principales | ETA |
|------|------------|-------------|-------------------|-----|
| E0.1 Infraestructura lista | US0.1 – Como arquitecto quiero provisionar proyecto GCP/Firebase con IaC | Terraform + GitHub Actions crean proyecto, habilitan Firestore/Storage/Pub/Sub, IAM mínimo | CA: Terraform plan/apply aprobado, Firestore en modo native con reglas básicas, buckets con CMEK; CQ: checklist seguridad inicial (cifrado, etiquetas de costo) | Semana 1 |
| | US0.2 – Como dev necesito emuladores locales | Configurar Firebase Emulator Suite (Auth/Firestore/Functions) + contenedores OCR para dev offline | CA: scripts `npm run dev:emulators`, documentación en README; CQ: pruebas smoke locales | Semana 1 |
| E0.2 Ingesta manual controlada | US0.3 – Como operador quiero subir PDFs y generar folio | UI/CLI que sube a GCS, calcula hash y emite evento Pub/Sub con metadatos Empresa→Paciente→Orden→Estudio→Fecha | CA: folio único en Firestore, duplicado bloqueado, bitácora del evento; CQ: prueba con expediente demo AMI | Semana 2 |
| E0.3 Parsing + Normalización base | US0.4 – Como sistema necesito extraer datos Lab/RX/Audiometría/Espirometría de PDFs nativos | Servicio Python (Document AI/pdfminer) que aplica plantillas Manus y genera JSON normalizado | CA: ≥85 % campos cubiertos en dataset demo, logs por ancla, versionado de plantilla; CQ: pruebas unitarias por extractor usando `02_MAPEO` | Semana 2 |
| | US0.5 – Como médico quiero ver semáforos preliminares | Motor JSON Rules (umbrales Manus) genera semáforos por parámetro + dictamen sugerido | CA: reglas Hb/FVC/RX/Riesgo CV cargadas; CQ: simulaciones documentadas (verde/ámbar/rojo) | Semana 3 |
| E0.4 Panel médico v0 | US0.6 – Como médico validador quiero revisar y editar datos extraídos | Next.js + Firebase Auth muestra PDF vs datos y permite ajustes/observaciones | CA: login médico habilitado, edición con bitácora, estado `Validación pendiente`; CQ: pruebas E2E Playwright (flujo single expediente) | Semana 3 |
| E0.5 Emisión y Papeleta | US0.7 – Como médico quiero emitir reporte + papeleta con QR | Servicio Node/Cloud Run genera PDFs institucional y papeleta (especificación Manus) tras firma | CA: QR apunta a URL caducable, reimpresión registrada, templates responsive; CQ: checklist Papeleta (`PAPELETA_spec.md`) | Semana 4 |
| E0.6 Observabilidad mínima | US0.8 – Como líder quiero rastrear cada expediente | Bitácora estructurada (Firestore/BigQuery) con traceId=folio, export a Looker sheet | CA: logs ingestion→emisión, alerta básica (Pub/Sub DLQ); CQ: reporte diario MVS | Semana 4 |

**Checklist Fase 0:** expediente demo procesado end-to-end, métricas base (TAT, precisión extracción), walkthrough con AMI agendado.

### FASE 1 – Piloto Operativo (Semanas 5‑12)
| Epic | User Story | Descripción | CA/CQ principales | ETA |
|------|------------|-------------|-------------------|-----|
| E1.1 Ingesta automatizada | US1.1 – Como operador quiero watchers SFTP/carpeta | Cloud Functions/Eventarc detectan nuevos archivos, aplican control de duplicados y encolan trabajo | CA: soporte SFTP + carpeta local, DLQ activa, alertas de falla; CQ: prueba con >5 archivos simultáneos | Sem 5 |
| E1.2 Normalizador & reglas avanzadas | US1.2 – Como especialista quiero mapear todos los módulos (incl. risco CV, toxicológico) | Diccionarios de unidades y catálogos cargados desde `Mapa_Campos_Sistema_AMI_RD.xlsx` | CA: 100 % campos críticos mapeados; CQ: reportes de cobertura por módulo | Sem 6 |
| | US1.3 – Como médico deseo calibrar reglas clínicamente | UI para versionar reglas y simular cambios antes de publicar | CA: historial de versiones, rollback, semáforo global; CQ: aprobación médico líder | Sem 6 |
| E1.3 Panel médico v1 | US1.4 – Como médico necesito bandeja de expedientes y filtros | Dashboard Next.js con estados (Ingesta→Entrega), filtros por empresa/sede, comentarios | CA: cola con SLA visual, edición colaborativa; CQ: pruebas de concurrencia | Sem 7 |
| E1.4 Dashboard & métricas | US1.5 – Como dirección quiero ver KPIs (TAT, rechazo, precisión) | ETL Firestore→BigQuery→Looker Studio con panel operativo | CA: KPIs diarios, export PDF semanal; CQ: validación con Alan | Sem 8 |
| E1.5 Entrega segura y bitácora | US1.6 – Como cliente quiero recibir enlaces caducables | Signed URLs + SendGrid, registro IP/usuario/fecha | CA: caducidad configurable, reenvíos auditados; CQ: prueba antifraude (QR) | Sem 8 |
| E1.6 QA/Mantenimiento | US1.7 – Como equipo necesito suites de pruebas y runbooks | Playwright E2E, Jest/Pytest unit, runbook incidentes, checklist Integra Evolucionada | CA: pipelines CI con coverage report, runbook publicado; CQ: simulacro de incidente | Sem 9-10 |
| E1.7 Dataset real | US1.8 – Como médico quiero validar con 10 expedientes reales | Carga anonimizada, seguimiento de ajustes post-validación, métricas de concordancia identidad | CA: 10 expedientes con dictamen final firmado; CQ: reporte comparativo (IA vs humano) | Sem 11-12 |

**Checklist Fase 1:** 10 expedientes reales procesados, métricas piloto entregadas a AMI, retroalimentación clínica integrada.

### FASE 2 y 3 (resumen)
- **Fase 2 – Consolidación (Sem 12‑24):** integrar ECG/Campimetría/Toxicológico, roles multi-sede, DRP/RPO 24 h, documentación NOM/LFPDPPP, observabilidad avanzada, CI/CD completo.  
- **Fase 3 – Producción (24+):** SLA 24/7, FinOps, roadmap evolutivo (feature flags, mobile Expo), soporte comercial.

### Backlog auxiliar permanente
- (Integra) Módulo de Dashboard de Avances: Crear un dashboard web auto-actualizable que refleje el estado de `PROYECTO.md`.
- Sitio ligero de seguimiento para AMI (estado de módulos + carga de evidencia).  
- Documentación continua (`context/04_Documentacion_Sintetica`, `RD-AMI_Paquete_MANUS`).  
- Estrategia de QA y despliegue (checkpoints, plan de pruebas, runbooks).  
- Requests de legales/comerciales (contratos `context/03`, acuerdos con Alan).

### Fase 0: Infraestructura y Visibilidad
- [✓] (Integra) Crear un dashboard de progreso web.
- [✓] (Integra) Configurar el parser de `PROYECTO.md` para generar datos de progreso.
- [✓] (Integra) Implementar el frontend del dashboard con Tailwind CSS.
- [✓] (Integra) Configurar la acción de GitHub para actualizar automáticamente los datos del dashboard.
- [✓] (Integra) Configurar el despliegue automático en el servidor de Plesk.

## Próximas acciones inmediatas
1. **Backlog → tareas JIRA/ClickUp:** crear tarjetas por US (US0.1–US0.8) con responsables y fechas comprometidas (Sem 1‑4).  
2. **Infraestructura:** correr Terraform inicial + documentar emuladores en `README.md`.  
3. **Plan con AMI:** compartir backlog y cronograma con Alan, agendar demo MVS (semana 4) y checkpoint piloto (semana 8).

### Tarjetas de trabajo (Sem 1‑4)
| ID | Descripción | Owner | Estatus |
|----|-------------|-------|---------|
| US0.1 | Provisionar proyecto GCP/Firebase con Terraform (APIs, Firestore, Storage, Pub/Sub, SA). | Sofía | En progreso |
| US0.2 | Configurar DevEx local (Firebase Emulator Suite, contenedores OCR) y documentar comandos. | Sofía | Pendiente |
| US0.3 | Ingesta manual → GCS+Pub/Sub con folio único y bitácora. | Sofía | Pendiente |
| US0.4 | Extractores OCR base (Lab/RX/Audiometría/Espirometría) con JSON normalizado. | Inés | Pendiente |
| US0.5 | Motor de reglas (Hb, FVC, RX, Riesgo CV) con simulaciones. | Inés | Pendiente |
| US0.6 | Panel médico v0 (Next.js + Auth + visor PDF/datos). | Sofía | Pendiente |
| US0.7 | Generador PDF institucional + Papeleta con QR caducable. | Inés | Pendiente |
| US0.8 | Bitácora estructurada + métricas base (TAT, precisión extracción). | Nano | Pendiente |

## Trabajo técnico por fase

### FASE 0 – MVS (Semanas 1-4)
**Objetivo:** Demostrar el flujo completo desde la ingesta manual de PDFs hasta la emisión del expediente con QR.  
**Tareas internas clave:**
- **Infraestructura GCP inicial:** crear proyecto, habilitar Firestore, Storage, Pub/Sub y Secrets Manager; definir naming convention y etiquetas de costos.
- **Config serverless:** aprovisionar Cloud Run/Firebase Functions (entorno Node/Python), definir entornos `staging` y `prod` y configurar CI para despliegues manuales.
- **Configuración de base de datos:** diseñar colecciones `expedientes`, `logs`, `templates`, índices y reglas de seguridad; cargar catálogos base (empresas, tipos de estudio).
- **Watcher de ingesta manual:** endpoint Next.js/API o script CLI que suba PDFs a Storage, calcule hash y genere eventos Pub/Sub.
- **Pipeline OCR/PDF parsing:** prototipo en Python (Document AI / `pdfminer` + `pytesseract`) empaquetado en Cloud Run; versionar plantillas por estudio.
- **Motor de reglas básico:** JSON Rules + función serverless que asigne semáforos y dicte aptitud preliminar.
- **Panel médico v0:** Next.js + Firebase Auth (correo/contraseña) con vista de validación, edición de campos y botón de emisión.
- **Generación de reportes:** servicio Node que usa plantillas (`pdfmake`/`react-pdf`) para emitir Papeleta/Expediente, incluye folio, QR y firma digital.
- **Bitácora mínima:** logging estructurado (`logs` collection) con `traceId=expedienteId` y exportación a BigQuery opcional.

### FASE 1 – Piloto Operativo (Semanas 5-12)
**Objetivo:** Procesar ≥10 expedientes reales con ingesta automatizada y tablero clínico.  
**Tareas internas clave:**
- **Automatización de ingesta:** watcher SFTP/carpeta (Eventarc + Cloud Functions) con colas Pub/Sub y DLQ.
- **Normalizador avanzado:** diccionarios de unidades, tablas de referencia en Firestore (`catalogs/rangos`) y pruebas unitarias.
- **Semaforización ampliada:** versionado de reglas clínicas, simulador para calibración y reporte de precisión por parámetro.
- **Panel médico v1:** historial de expedientes, filtros por empresa, comentarios y registro de re-trabajos.
- **Dashboard operativo:** ETL Firestore → BigQuery + Looker Studio (KPIs TAT, rechazo, reprocesos, backlog).
- **Entrega segura:** enlaces caducables (signed URLs) + bitácora de descargas y notificaciones por correo (SendGrid/Gmail API).
- **QA & datos:** dataset “golden” anonimizado, pruebas E2E (Playwright) y checklist de calidad previo a cada demostración.

### FASE 2 – Consolidación Institucional (Semanas 12-24)
**Objetivo:** Versión institucional estable con integraciones clínicas avanzadas y gobierno de datos.  
**Tareas internas clave:**
- **Nuevos estudios (ECG, Campimetría, Toxicológico):** plantillas OCR dedicadas, validación con médicos especialistas y monitoreo de accuracy.
- **Gobernanza y roles:** RBAC con Custom Claims, segregación por sede/cliente, auditoría completa (quién vio/descargó).
- **Operación multi-región:** políticas de retención, backups programados (Firestore export, Storage lifecycle) y DR básico (RPO 24h, RTO 8h).
- **Documentación & cumplimiento:** manuales operativos, checklist NOM/LFPDPPP, contratos y runbooks en `context/03`.
- **CI/CD completo:** GitHub Actions → Firebase Hosting/Cloud Run con gates para staging, pruebas automatizadas y reportes de cobertura.
- **Observabilidad avanzada:** Cloud Monitoring + alertas (latencia, costos, fallas OCR), integración con Slack/email.

### FASE 3 – Producción / Comercialización (24+ semanas)
**Objetivo:** Operación comercial con SLA, monitoreo 24/7 y roadmap evolutivo.  
**Tareas internas clave:**
- **SLA y soporte:** mesa de ayuda, rotación on-call, manual de incidentes y métricas MTTR/MTTI.
- **Cost management:** dashboards FinOps (BigQuery + Looker) con costo por expediente y alertas de presupuesto.
- **Roadmap evolutivo:** feature flags, experimentos IA generativa (explicaciones automáticas, respuesta a clientes) y canal mobile (Expo) cuando aplique.
- **Escalabilidad cliente:** plantillas multi branding, onboarding guiado y documentación comercial.

## Tablero — Módulos fuente
Este listado alimenta el progress dashboard y debe mantenerse actualizado. Usa los campos `status` (`pending|progress|blocked|done`) y `progress` (0-100).

<!-- progress-modules:start -->
| id | name | phase | phaseOrder | owner | status | progress | summary | needs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fase0-arquitectura | Arquitectura GCP + Firebase | FASE 0 – MVS | 0 | Arquitectura | progress | 45 | Provisionar proyecto GCP/Firebase, Firestore, Storage e IAM base. | Aprobación de presupuesto GCP y cuentas de servicio. |
| fase0-ocr | Pipeline de Ingesta y OCR | FASE 0 – MVS | 0 | Backend · Data | progress | 30 | Watcher manual y pipeline Document AI/PyMuPDF para Laboratorio, RX, Audiometría y Espirometría. | PDFs con sello médico y rangos de referencia validados. |
| fase0-panel-medico | Panel Médico MVS | FASE 0 – MVS | 0 | Frontend | pending | 10 | Next.js + Firebase Auth con vista básica de validación y emisión de PDF. | Wireframes finales y usuarios médicos confirmados. |
| fase0-dashboard | Progreso AMI Dashboard | FASE 0 – MVS | 0 | Frontend | progress | 20 | Parser + frontend Tailwind para https://vcorp.mx/progress-ami/progressdashboard/. | Endpoint actualizado con datos reales del backlog. |
| fase1-ingesta-automatica | Ingesta automática + Semáforos | FASE 1 – Piloto | 1 | Backend | pending | 5 | Monitoreo SFTP/Eventarc, control de duplicados y motor de reglas declarativo. | Acceso a carpeta compartida y responsables de observabilidad. |
| fase1-dashboard | Dashboard Operativo y Bitácora | FASE 1 – Piloto | 1 | Data | pending | 0 | Métricas TAT, rechazo y reprocesos con Looker Studio sobre BigQuery. | KPIs definidos y dataset de auditoría aprobado. |
| fase2-integraciones | Integraciones ECG/Campimetría/Toxicológico | FASE 2 – Consolidación | 2 | Data · Backend | pending | 0 | Nuevas plantillas de extracción, validación clínica y versionado de reglas. | Estudios de muestra y médicos líderes por especialidad. |
| fase2-roles | Gobierno de datos y roles multi-sede | FASE 2 – Consolidación | 2 | Arquitectura | pending | 0 | Custom Claims, segregación por empresa, DRP y documentación NOM/LFPDPPP. | Inventario de sedes/clientes y matriz de acceso aprobada. |
| fase3-sla | Operación comercial y SLA | FASE 3 – Producción | 3 | Operaciones | pending | 0 | SLA activo, monitoreo 24/7 y mantenimiento evolutivo. | Catálogo de incidentes y runbooks por severidad. |
<!-- progress-modules:end -->
