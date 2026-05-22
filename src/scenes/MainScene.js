/**
 * MainScene.js
 * Escena principal: mundo visual + algoritmo genético integrado.
 *
 * Flujo por generación:
 *   1. create()  → inicializar mundo, crear 1ª generación aleatoria
 *   2. update()  → cada frame: mover agentes según su DNA, medir fitness
 *   3. endGeneration() → aplicar AG, crear nueva generación, reiniciar
 */

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    // ── preload ─────────────────────────────────────────────────────
    preload() {
        // Sin assets externos: todo con primitivas de Phaser
    }

    // ── create ──────────────────────────────────────────────────────
    create() {
        // Parámetros de simulación
        this.POPULATION_SIZE = 30;
        this.MAX_TIME        = 7000; // ms por generación

        // Estado de la simulación
        this.generation  = 0;
        this.frameIndex  = 0;   // contador de frames dentro de la generación
        this.gameTime    = 0;   // ms transcurridos en esta generación
        this.individuals = [];  // array de Individual (genética)

        // Construir mundo visual
        this.buildBackground();
        this.buildGround();
        this.buildObstacles();

        // Crear HUD (texto encima de todo)
        this.hudText = this.add.text(10, 10, '', {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#00000099',
            padding: { x: 8, y: 5 }
        }).setDepth(20);

        // Historia de fitness para mostrar progreso
        this.fitnessHistory = [];

        // Iniciar primera generación con DNA aleatorio
        this.startGeneration(null);
    }

    // ── update (cada frame ~16ms) ───────────────────────────────────
    update(time, delta) {
        this.gameTime  += delta;
        this.frameIndex++;

        let aliveCount = 0;

        this.population.forEach((agent, i) => {
            if (!agent.alive) return;
            aliveCount++;

            const individual = this.individuals[i];
            const sprite     = agent.sprite;

            // ── Movimiento horizontal constante ──
            sprite.body.setVelocityX(160); // siempre corre hacia la derecha

            // ── Decisión de saltar según DNA ──
            const onGround = sprite.body.blocked.down; // ¿está tocando el suelo?
            if (onGround && individual.shouldJump(this.frameIndex)) {
                sprite.body.setVelocityY(-380); // impulso hacia arriba
            }

            // ── Fitness: cuánto avanzó hacia la derecha ──
            individual.fitness = (sprite.x - 50) / 10; // normalizado

            // ── Si sale del mundo por la derecha → éxito máximo ──
            if (sprite.x > 980) {
                individual.fitness += 100; // bonus por completar
                agent.alive = false;
                sprite.setFillStyle(0xffd700); // dorado = completó
            }
        });

        // Actualizar HUD
        const stats = GeneticAlgorithm.getStats(this.individuals);
        this.hudText.setText(
            `Gen: ${this.generation}  |  ` +
            `T: ${(this.gameTime / 1000).toFixed(1)}s  |  ` +
            `Vivos: ${aliveCount}  |  ` +
            `Best: ${stats.best.toFixed(1)}`
        );
        this.updateHTMLStats(stats);

        // ── Fin de generación: tiempo agotado o todos muertos ──
        if (this.gameTime >= this.MAX_TIME || aliveCount === 0) {
            this.endGeneration();
        }
    }

    // ── startGeneration ─────────────────────────────────────────────
    // individuals: array de Individual (null = primera generación aleatoria)
    startGeneration(individuals) {
        // Limpiar sprites de generación anterior
        if (this.population) {
            this.population.forEach(a => { if (a.sprite) a.sprite.destroy(); });
        }

        this.population  = [];
        this.gameTime    = 0;
        this.frameIndex  = 0;

        // Crear individuos genéticos
        if (individuals === null) {
            // Primera generación: DNA aleatorio
            this.individuals = Array.from(
                { length: this.POPULATION_SIZE },
                () => new Individual()
            );
        } else {
            this.individuals = individuals;
        }

        // Crear sprites para cada individuo
        this.individuals.forEach((individual, i) => {
            // Color según posición en la población (arco iris)
            const hue   = (i / this.POPULATION_SIZE);
            const color = Phaser.Display.Color.HSLToColor(hue, 0.85, 0.6).color;

            // Sprite: rectángulo de 20×30 px
            const sprite = this.add.rectangle(50, 430, 20, 30, color);
            this.physics.add.existing(sprite);
            sprite.body.setBounce(0);
            sprite.body.setCollideWorldBounds(true);
            sprite.body.setMaxVelocityY(600);
            sprite.body.setGravityY(200); // gravedad extra individual

            // Colisión con suelo
            this.physics.add.collider(sprite, this.ground);

            // Colisión con obstáculos → agente muere
            this.physics.add.collider(sprite, this.obstacles, () => {
                agent.alive = false;
                sprite.setFillStyle(0x444444);      // gris = muerto
                sprite.body.setVelocityX(0);
                sprite.body.setVelocityY(-100);     // pequeño rebote visual
            });

            const agent = {
                sprite,
                alive: true
            };

            // Referencia para el callback de colisión
            sprite._agent = agent;

            this.population.push(agent);
        });
    }

    // ── endGeneration ───────────────────────────────────────────────
    endGeneration() {
        // Guardar estadísticas de esta generación
        const stats = GeneticAlgorithm.getStats(this.individuals);
        this.fitnessHistory.push(stats.best);
        console.log(
            `Gen ${this.generation} | ` +
            `Best: ${stats.best.toFixed(1)} | ` +
            `Avg: ${stats.avg.toFixed(1)} | ` +
            `Worst: ${stats.worst.toFixed(1)}`
        );

        // Aplicar algoritmo genético → obtener nueva generación
        const nextGen = GeneticAlgorithm.nextGeneration(this.individuals);

        // Avanzar generación
        this.generation++;

        // Iniciar siguiente generación con el nuevo DNA
        this.startGeneration(nextGen);
    }

    // ── buildBackground ─────────────────────────────────────────────
    buildBackground() {
        // Capas de color simulando un cielo nocturno
        this.add.rectangle(500, 125, 1000, 250, 0x0d0d1a);
        this.add.rectangle(500, 325, 1000, 200, 0x111122);

        // Estrellas (puntos blancos aleatorios)
        for (let s = 0; s < 80; s++) {
            const sx = Phaser.Math.Between(0, 1000);
            const sy = Phaser.Math.Between(0, 300);
            const sz = Phaser.Math.Between(1, 3);
            this.add.circle(sx, sy, sz, 0xffffff, 0.6);
        }
    }

    // ── buildGround ─────────────────────────────────────────────────
    buildGround() {
        this.ground = this.physics.add.staticGroup();

        // Suelo principal
        const g = this.add.rectangle(500, 472, 1000, 28, 0x3d6b4f);
        this.physics.add.existing(g, true);
        this.ground.add(g);

        // Franja decorativa
        this.add.rectangle(500, 457, 1000, 5, 0x5a9e70);
    }

    // ── buildObstacles ──────────────────────────────────────────────
    buildObstacles() {
        this.obstacles = this.physics.add.staticGroup();

        // [x, ancho, altura] — sobre el suelo (y = 457 - h/2)
        const defs = [
            [260,  22, 45],
            [460,  28, 65],
            [660,  22, 50],
            [840,  32, 80],
        ];

        defs.forEach(([x, w, h]) => {
            const y   = 458 - h / 2;
            const obs = this.add.rectangle(x, y, w, h, 0xc1121f);
            this.physics.add.existing(obs, true);
            this.obstacles.add(obs);

            // Brillo encima del obstáculo
            this.add.rectangle(x, y - h / 2 - 3, w, 5, 0xff4d6d);
        });
    }

    // ── updateHTMLStats ─────────────────────────────────────────────
    updateHTMLStats(stats) {
        document.getElementById('generation').textContent   = this.generation;
        document.getElementById('best-fitness').textContent = stats.best.toFixed(1);
        document.getElementById('population').textContent   = this.POPULATION_SIZE;
        document.getElementById('avg-fitness').textContent  = stats.avg.toFixed(1);
    }
}