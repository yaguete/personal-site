<img src="/public/cover.jpg" alt="Portada de ThinkMakeTest.ai" width="100%" />

# ThinkMakeTest.ai

Esta es mi web personal y campo de pruebas: portfolio, blog y playground de side-projects, todo en uno.  
Desarrollada en Next.js 15, React 19 y Tailwind CSS 4.

**Demo online:** [https://thinkmaketest.ai](https://thinkmaketest.ai)

---

## Características

- Portfolio profesional (experiencia, proyectos, bio)
- Blog integrado (MDX)
- Experimentos/miniapps (AI playground, PDF audit, generador de recomendaciones, etc.)
- Diseño responsive y minimalista
- Animaciones suaves con Motion-Primitives

## Instalación y desarrollo

```bash
git clone https://github.com/yaguete/personal-site.git
cd personal-site
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Documentacion

- Documentacion general: `docs/INDEX.md`
- Guia para Claude Code: `docs/CLAUDE.md`
- Estandares de estructura: `docs/PROJECT_STRUCTURE_STANDARDS.md`
- Documentacion tecnica: `docs/TECHNICAL_DOCUMENTATION.md`

## Proyectos incluidos

### 🎯 LinkedIn Recommendation Generator
Generador de recomendaciones personalizadas para LinkedIn usando IA.

### 📄 Preprint Audit Tool
Herramienta para analizar y auditar preprints académicos.

### 🎨 Portfolio & Blog
Portfolio profesional con blog integrado en MDX.

## Tecnologías

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de UI
- **Tailwind CSS 4** - Framework CSS
- **Motion-Primitives** - Animaciones
- **MDX** - Blog con Markdown + JSX

## Sobre mí

Design strategist specializing in AI-driven product development. I turn complex data into clear, actionable digital products at the intersection of tech, design & business.

---

## Repos independientes del playground

Este monorepo es el hub y la fuente de verdad. Cada herramienta de `app/playground/` tiene además su propio repo público, exportado con `git subtree split` (conserva el historial de su carpeta):

| Herramienta | Repo | Remoto en este repo |
|---|---|---|
| Preprint Audit | [yaguete/preprint-audit](https://github.com/yaguete/preprint-audit) | `preprint-audit` |
| Profile Analyzer | [yaguete/profile-analyzer](https://github.com/yaguete/profile-analyzer) | `profile-analyzer` |
| LinkedIn Recommendation | [yaguete/linkedin-recommendation](https://github.com/yaguete/linkedin-recommendation) | `linkedin-recommendation` |

**Los repos de las tools NO se actualizan solos.** Para refrescar uno tras tocar la herramienta aquí:

```bash
git subtree split --prefix=app/playground/<tool> -b export/<tool>
git push <tool> export/<tool>:main --force-with-lease
```

Notas:
- El `--force-with-lease` es necesario porque cada split genera commits sintéticos nuevos; es seguro mientras nadie trabaje directamente sobre el repo de la tool (el flujo de trabajo es siempre monorepo → export, nunca al revés).
- Si la tool usa rutas fuera de su carpeta (p. ej. una API route en `app/api/<tool>` o un backend en `heroku-deploy/`), hay que copiarlas al export antes de hacer push, como se hizo en la exportación inicial.
- Este repo es **público**: los `.env*` están en `.gitignore`, pero cualquier cosa commiteada se ve. Regla: si no lo pondrías en LinkedIn, no va al repo.

---

*Desarrollado con ❤️ usando [Nim](https://github.com/ibelick/nim) como base.*
