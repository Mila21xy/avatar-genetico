# 🧬 Avatar Evolucionario — Algoritmos Genéticos

![GitHub repo size](https://img.shields.io/github/repo-size/Mila21xy/avatar-genetico)
![GitHub last commit](https://img.shields.io/github/last-commit/Mila21xy/avatar-genetico)
![License](https://img.shields.io/badge/license-MIT-green)
![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow)
![Phaser](https://img.shields.io/badge/Phaser-3-blue)

Proyecto universitario que implementa un **algoritmo genético** para que agentes virtuales aprendan automáticamente a superar obstáculos mediante selección natural y evolución simulada. Funciona completamente en el navegador, sin instalación de backend.

---

## 🎮 Demo

Ejecutar localmente con las instrucciones de instalación abajo, luego abrir `http://localhost:8080`.

### Vista de la aplicación

| Elemento | Descripción |
|---|---|
| Agentes de colores | 30 individuos con DNA único cada uno |
| Obstáculos rojos | Barreras que deben aprender a saltar |
| Panel derecho | Estadísticas y gráfica de evolución en tiempo real |
| Agentes grises | Murieron al chocar con un obstáculo |
| Agentes dorados | Completaron el recorrido exitosamente |

---

## 🚀 Instalación y ejecución

### Requisitos

- Node.js 12 o superior
- npm
- Navegador moderno (Chrome, Firefox, Edge)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Mila21xy/avatar-genetico.git
cd avatar-genetico

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor local
npm run dev

# 4. Abrir en navegador
# http://localhost:8080
```

---

## 📁 Estructura del proyecto

```
avatar-genetico/
├── index.html                  # Interfaz web principal
├── package.json                # Dependencias Node.js
├── src/
│   ├── game.js                 # Configuración de Phaser 3
│   ├── scenes/
│   │   └── MainScene.js        # Escena principal (mundo + física)
│   ├── genetics/
│   │   ├── Individual.js       # Agente con genoma (DNA)
│   │   └── GeneticAlgorithm.js # Selección, crossover, mutación
│   └── ui/
│       └── Stats.js            # Gráfica de fitness y panel HTML
└── README.md
```

---

## 🧠 Fundamentos Teóricos

### 1. Formulación del problema

El problema consiste en encontrar una **secuencia óptima de decisiones de salto** que permita a un agente recorrer la mayor distancia posible superando obstáculos. Es un problema de optimización combinatoria donde el espacio de búsqueda es enorme (2^200 combinaciones posibles), lo que hace inviable una búsqueda exhaustiva y justifica el uso de un algoritmo evolutivo.

---

### 2. Representación de la solución (Genoma)

Cada agente posee un **genoma** (array de 200 valores reales entre 0 y 1):

```
DNA = [0.23, 0.81, 0.04, 0.76, 0.55, ...]
        ↑     ↑     ↑     ↑
       no    sí    no    sí   ← decisión de saltar en cada frame
```

- **Longitud del genoma:** 200 genes
- **Tipo de gen:** número real ∈ [0, 1]
- **Umbral de decisión:** si `DNA[frame] > 0.5` → el agente salta

Esta representación continua permite aplicar crossover y mutación de forma natural y eficiente.

---

### 3. Inicialización de la población

La primera generación se crea con **DNA completamente aleatorio**:

```javascript
static randomDNA() {
    return Array.from({ length: 200 }, () => Math.random());
}
```

Esto garantiza **diversidad máxima** al inicio, explorando ampliamente el espacio de búsqueda antes de converger hacia soluciones buenas.

- **Tamaño de población:** 30 individuos
- **Diversidad inicial:** alta (valores uniformemente distribuidos en [0,1])

---

### 4. Función de Fitness

El fitness mide qué tan bien se desempeñó un agente durante la simulación:

```javascript
fitness = (posición_x - 50) / 10        // distancia recorrida (normalizada)
fitness += 100                           // bonus si completa el recorrido
```

| Situación | Fitness aproximado |
|---|---|
| Agente muere en el primer obstáculo | ~21 |
| Agente llega a la mitad del mapa | ~50 |
| Agente supera todos los obstáculos | ~93 |
| Agente completa todo el recorrido | ~143 |

El fitness guía la evolución: los agentes que llegan más lejos tienen mayor probabilidad de reproducirse y transmitir su DNA a la siguiente generación.

---

### 5. Selección (Ruleta + Elitismo)

Se usa una combinación de dos estrategias complementarias:

**Elitismo:** el mejor individuo de cada generación pasa intacto a la siguiente. Esto garantiza que la mejor solución encontrada nunca se pierde por azar.

**Selección por ruleta (Roulette Wheel Selection):** cada individuo tiene una probabilidad de ser elegido como padre proporcional a su fitness:

```
P(individuo_i) = fitness_i / suma_total_fitness
```

Un individuo con fitness 80 tiene el doble de probabilidad de ser elegido que uno con fitness 40. Esto simula la selección natural: los más aptos se reproducen más.

---

### 6. Crossover (Recombinación)

Se usa **crossover de un punto** ubicado en la mitad exacta del genoma (posición 100):

```
Padre A: [0.3, 0.8, 0.1, 0.9 | 0.4, 0.2, 0.7, 0.6]
Padre B: [0.6, 0.2, 0.5, 0.3 | 0.9, 0.1, 0.8, 0.4]
                              ↑ punto de corte
Hijo:    [0.3, 0.8, 0.1, 0.9 | 0.9, 0.1, 0.8, 0.4]
          ←── genes Padre A ──→←── genes Padre B ──→
```

Esto combina las estrategias exitosas de dos padres en un solo hijo, permitiendo que los comportamientos beneficiosos de distintos individuos se fusionen.

---

### 7. Mutación

Con una probabilidad del **5% por gen**, cada gen del hijo se reemplaza por un valor aleatorio nuevo:

```javascript
for (let i = 0; i < dna.length; i++) {
    if (Math.random() < 0.05) {
        dna[i] = Math.random(); // gen nuevo aleatorio
    }
}
```

La mutación cumple dos funciones clave:

- **Diversificación:** introduce genes que no existían en ninguno de los padres, permitiendo explorar zonas nuevas del espacio de búsqueda.
- **Escape de óptimos locales:** evita que la población quede atrapada en una solución subóptima al introducir variación continua.

---

### 8. Intensificación vs Diversificación

| Mecanismo | Rol | Implementación |
|---|---|---|
| Elitismo | Intensificación | Conserva el mejor individuo exacto |
| Selección por ruleta | Intensificación | Favorece a los mejores padres |
| Crossover | Intensificación | Combina buenas soluciones existentes |
| Mutación (5%) | Diversificación | Introduce variación nueva en cada generación |
| Población inicial aleatoria | Diversificación | Explora ampliamente el espacio de búsqueda |

El balance entre ambas es crítico: demasiada intensificación lleva a **convergencia prematura** (todos los individuos idénticos); demasiada diversificación impide que la población mejore de forma consistente.

---

### 9. Generaciones y convergencia

Cada generación dura **7 segundos** de simulación. Al terminar:

1. Se calcula el fitness final de los 30 agentes
2. Se aplica el algoritmo genético (selección + crossover + mutación)
3. Se crea una nueva generación de 30 agentes con el nuevo DNA evolucionado
4. Se reinicia la simulación con los agentes nuevos

Con los parámetros actuales, la convergencia notable ocurre entre las **generaciones 5 y 15**, dependiendo de la aleatoriedad de la población inicial.

---

### 10. Problemas encontrados y soluciones

| Problema | Causa | Solución aplicada |
|---|---|---|
| Pantalla negra al cargar | Orden incorrecto de scripts JS | Cargar en orden: `Individual.js` → `GeneticAlgorithm.js` → `MainScene.js` → `game.js` |
| `Cannot set properties of null` | `getElementById` sobre elementos inexistentes | Función auxiliar `set(id, value)` con verificación previa de existencia |
| Agentes no colisionan correctamente | Referencia a `agent` antes de su declaración en el callback | Usar `sprite._agent` como referencia cruzada dentro del callback de colisión |
| Convergencia prematura | Tasa de mutación muy baja | Ajustada a 5% para mantener diversidad suficiente entre generaciones |
| Todos los agentes mueren en Gen 0 | DNA completamente aleatorio al inicio | Comportamiento correcto y esperado — la mejora ocurre con las generaciones |

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Phaser 3 | 3.x | Motor de juego, física arcade, renderizado Canvas |
| JavaScript ES6+ | — | Lógica del algoritmo genético |
| HTML5 Canvas | — | Gráfica de evolución del fitness |
| Node.js / npm | 12+ | Gestión de dependencias y servidor local |
| http-server | — | Servidor de desarrollo local |
| Git / GitHub | — | Control de versiones profesional |

### ¿Por qué Phaser 3?

- Motor de física arcade integrado (gravedad, colisiones estáticas y dinámicas)
- Renderizado eficiente con múltiples sprites simultáneos sin pérdida de rendimiento
- Sin necesidad de backend — corre completamente en el navegador
- Académicamente defendible como framework de industria real usado en producción
- Documentación extensa y comunidad activa

---

## 📊 Resultados esperados

Con 30 agentes y los parámetros por defecto, se observa la siguiente progresión típica:

| Rango de generaciones | Comportamiento observado |
|---|---|
| Gen 0 — 2 | Comportamiento caótico, la mayoría muere en el primer obstáculo |
| Gen 3 — 8 | Algunos agentes superan el primer obstáculo de forma consistente |
| Gen 10 — 20 | La mayoría supera 2 o 3 obstáculos |
| Gen 25+ | Agentes completan el recorrido regularmente |

La gráfica de fitness en el panel derecho muestra visualmente esta curva de aprendizaje en tiempo real.

---

## ✍️ Autora

**Angela Milagros Quispe Huanca** — Proyecto universitario de Inteligencia Artificial  
Universidad La Salle
