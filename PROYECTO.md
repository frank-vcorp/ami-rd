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

## Backlog técnico priorizado

### Núcleo Plataforma
1. **Arquitectura Google Cloud**  
   - Provisión de proyecto GCP/Firebase, Firestore, Cloud Storage y Pub/Sub.  
   - Hardening de IAM y redes, lineamientos de cifrado y ubicaciones.
2. **Ingesta inteligente**  
   - Watcher en Cloud Run/Functions para carpetas SFTP/GCS.  
   - Control de duplicados por hash y normalización de metadatos.
3. **OCR + Parsing**  
   - Canal Python (Document AI/`pdfminer`) con plantillas por estudio.  
   - Mecanismo de versionado y pruebas con PDFs reales de AMI.
4. **Normalizador y reglas clínicas**  
   - Diccionarios de unidades y rangos.  
   - Motor declarativo (JSON Rules) desplegado como servicio serverless.
5. **Panel médico Next.js**  
   - UI shadcn/ui + Tailwind.  
   - Integración con Firebase Auth (roles Médico, Calidad, Admin).
6. **Generación/entrega de PDFs**  
   - Servicio Node en Cloud Run con plantillas institucionales.  
   - Enlaces firmados y caducables vía Cloud Storage + Cloud Functions.
7. **Observabilidad y métricas**  
   - Bitácora estructurada en Firestore/BigQuery.  
   - Dashboards operativos (Looker Studio o Data Studio).

### Hitos auxiliares
- Sitio ligero de seguimiento (estado de módulos + carga de docs solicitados al cliente).  
- Documentación funcional/técnica en `context/04_Documentacion_Sintetica`.  
- Estrategia de QA y despliegue (meta/checkpoints, plan de pruebas y runbooks).

## Próximas acciones inmediatas
1. Afinar plan técnico por fase (documento en `context/Plan_Ejecucion_RD-AMI.md`).  
2. Socializar con AMI el tablero de avance y habilitarles carga de evidencia.  
3. Configurar proyecto Firebase (staging) y credenciales locales para el equipo.

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
| fase1-ingesta-automatica | Ingesta automática + Semáforos | FASE 1 – Piloto | 1 | Backend | pending | 5 | Monitoreo SFTP/Eventarc, control de duplicados y motor de reglas declarativo. | Acceso a carpeta compartida y responsables de observabilidad. |
| fase1-dashboard | Dashboard Operativo y Bitácora | FASE 1 – Piloto | 1 | Data | pending | 0 | Métricas TAT, rechazo y reprocesos con Looker Studio sobre BigQuery. | KPIs definidos y dataset de auditoría aprobado. |
| fase2-integraciones | Integraciones ECG/Campimetría/Toxicológico | FASE 2 – Consolidación | 2 | Data · Backend | pending | 0 | Nuevas plantillas de extracción, validación clínica y versionado de reglas. | Estudios de muestra y médicos líderes por especialidad. |
| fase2-roles | Gobierno de datos y roles multi-sede | FASE 2 – Consolidación | 2 | Arquitectura | pending | 0 | Custom Claims, segregación por empresa, DRP y documentación NOM/LFPDPPP. | Inventario de sedes/clientes y matriz de acceso aprobada. |
| fase3-sla | Operación comercial y SLA | FASE 3 – Producción | 3 | Operaciones | pending | 0 | SLA activo, monitoreo 24/7 y mantenimiento evolutivo. | Catálogo de incidentes y runbooks por severidad. |
<!-- progress-modules:end -->
