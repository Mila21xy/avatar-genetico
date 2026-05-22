# Avatar Evolucionario 🧬

Un proyecto universitario que implementa un **algoritmo genético** para que un avatar aprenda automáticamente a caminar, saltar obstáculos y sobrevivir en un entorno simulado.

## 🎯 Objetivo

Demostrar los principios de la computación evolutiva mediante la implementación de un sistema donde agentes virtuales evolucionan a través de selección natural y reproducción.

## 🚀 Tecnologías Utilizadas

- **Phaser 3**: Framework para juegos en navegador
- **JavaScript ES6+**: Lenguaje principal
- **HTML5 Canvas**: Renderizado gráfico
- **Node.js**: Gestión de dependencias

## 📋 Requisitos

- Node.js 12+
- npm o yarn
- Navegador moderno (Chrome, Firefox, Edge)

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/avatar-genetico.git
cd avatar-genetico

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Luego abre `http://localhost:8080` en tu navegador.

## 📊 Características Principales

- ✅ Población de agentes evolucionables
- ✅ Motor de física arcade integrado
- ✅ Algoritmo genético completo (selección, crossover, mutación)
- ✅ Visualización de generaciones en tiempo real
- ✅ Panel de estadísticas (fitness, generación, población)
- ✅ Obstáculos dinámicos

## 📁 Estructura del Proyecto
src/
├── game.js              # Configuración principal de Phaser
├── scenes/
│   └── MainScene.js     # Lógica del juego
├── genetics/
│   ├── Individual.js    # Agente individual
│   ├── Population.js    # Población de agentes
│   └── GeneticAlgorithm.js  # Implementación del AG
└── physics/
├── Avatar.js        # Sprite del avatar
└── Obstacle.js      # Sistema de obstáculos

## 📚 Teoría Genética

### Conceptos Implementados

- **Población Inicial**: Agentes con genomas aleatorios
- **Fitness**: Distancia recorrida + obstáculos superados
- **Selección**: Elitismo + Ruleta Genética
- **Crossover**: Recombinación de dos genomas
- **Mutación**: Cambios aleatorios en genes
- **Generaciones**: Evolución iterativa

## 🎮 Cómo Usar

1. El programa inicia automáticamente
2. Observa cómo evolucionan los agentes
3. Las estadísticas se actualizan en tiempo real
4. Cada generación dura ~5 segundos

## ❌ Problemas Conocidos y Soluciones

*Por el momento nada*


## ✍️ Autor

Angela Milagros Quispe Huanca
---

**Última actualización**: Mayo 2026