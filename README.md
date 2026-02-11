# MO-211 Simulator

Simulador de certificación Excel MOS (MO-211) construido con **Next.js 14 + Tailwind CSS**.

---

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

```bash
# Build para producción
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```
mo211-simulator/
├── app/
│   ├── globals.css          # Estilos globales + tema
│   ├── layout.js            # Layout raíz
│   ├── page.js              # Página de inicio (selector de modo)
│   └── simulator/
│       └── page.js          # Simulador principal
│
├── data/
│   └── questions.json       # ← AQUÍ EDITAS LAS PREGUNTAS
│
├── public/
│   └── projects/            # ← Tus archivos .xlsx/.xlsm aquí
│
├── tailwind.config.js
└── next.config.js
```

---

## ✏️ Cómo editar preguntas

Todas las preguntas están en **`data/questions.json`**. El formato es simple:

```json
{
  "practice": [
    {
      "id": "project1",
      "name": "Nombre del Proyecto",
      "file": "./projects/miarchivo.xlsx",
      "questions": [
        {
          "id": "p1q1",
          "variants": [
            "Variante A de la pregunta (se elige al azar)",
            "Variante B de la pregunta",
            "Variante C de la pregunta"
          ]
        }
      ]
    }
  ],
  "challenges": [
    {
      "id": "challenge1",
      "name": "Challenge 1 — Nombre",
      "file": "./projects/archivo.xlsx",
      "questions": [
        {
          "id": "c1q1",
          "variants": [
            "Texto de la pregunta"
          ]
        }
      ]
    }
  ]
}
```

### Reglas:
- **`practice`** → sección Practice (proyectos 1-6)
- **`challenges`** → sección Challenges (aparte)
- Cada pregunta puede tener **1 o más variantes** — se elige una al azar en cada sesión
- Usa `*texto*` para resaltar nombres de hojas en **azul** (ej: `*Videojuegos*`)
- Los `id` deben ser únicos

---

## 🎨 Personalización Visual

El tema está en `tailwind.config.js` bajo `theme.extend.colors`:

```js
'sim-accent':  '#00d4ff',    // Azul - modo Practice
'challenge-accent': '#f97316', // Naranja - modo Challenges
'sim-bg': '#0a0e1a',         // Fondo principal
```

---

## 📂 Archivos Excel — Dónde pegar tu carpeta `projects`

Copia tu carpeta `projects` (con todos los `.xlsx` / `.xlsm`) dentro de **`public/`**:

```
mo211-simulator/
└── public/
    └── projects/              ← pega tu carpeta aquí
        ├── Games_Sales.xlsx
        ├── PivoteTable.xlsx
        ├── Formating.xlsx
        ├── Proyecto_Excel_Charts_And_Formulas.xlsx
        ├── Advanced_Excel_Features.xlsx
        ├── Macros.xlsm
        └── CERTIFICACION MO-211/
            ├── Analytical Computing.xlsx
            ├── First_Up_Consultants.xlsx
            └── Cruise Bookings.xlsm
```

Los paths en `questions.json` ya están configurados correctamente:
```json
"file": "./projects/Games_Sales.xlsx"
```

Al hacer clic en **Submit Project**, el archivo Excel del proyecto actual se descargará automáticamente en tu computadora.

También puedes descargarlo manualmente en cualquier momento con el botón ⬇ en la barra superior.

---

## Creado por Irvin Pineda · © 2024
