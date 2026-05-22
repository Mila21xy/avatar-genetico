class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // No necesitamos assets externos — todo con gráficos primitivos
    }

    create() {
        // ─── VARIABLES GLOBALES ───────────────────────────────────────
        this.generation    = 0;
        this.populationSize = 30;
        this.population    = [];
        this.gameTime      = 0;
        this.maxGameTime   = 6000; // 6 segundos por generación

        // ─── FONDO ────────────────────────────────────────────────────
        // Cielo degradado (rectángulos apilados simulando gradiente)
        this.add.rectangle(500, 150, 1000, 300, 0x1a1a2e); // cielo oscuro
        this.add.rectangle(500, 350, 1000, 150, 0x16213e); // horizonte

        // ─── SUELO ────────────────────────────────────────────────────
        // El suelo es un objeto estático con física (no se mueve)
        this.ground = this.physics.add.staticGroup();

        // Rectángulo visual del suelo
        const groundRect = this.add.rectangle(500, 470, 1000, 30, 0x4a7c59);
        this.physics.add.existing(groundRect, true); // true = estático
        this.ground.add(groundRect);

        // Línea decorativa encima del suelo
        this.add.rectangle(500, 455, 1000, 4, 0x6abf69);

        // ─── OBSTÁCULOS ───────────────────────────────────────────────
        this.createObstacles();

        // ─── POBLACIÓN ────────────────────────────────────────────────
        this.initializePopulation();

        // ─── HUD (texto en pantalla) ──────────────────────────────────
        this.hudText = this.add.text(10, 10,
            'Generación: 0 | Tiempo: 0s', {
            fontSize: '15px',
            fill: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 8, y: 4 }
        }).setDepth(10); // setDepth asegura que quede encima de todo
    }

    // ─────────────────────────────────────────────────────────────────
    update() {
        this.gameTime += 16;

        // Actualizar cada agente vivo
        this.population.forEach(agent => {
            if (agent.alive) {
                agent.fitness += 0.1; // Fitness básico por sobrevivir
            }
        });

        // Actualizar HUD
        const seconds = Math.floor(this.gameTime / 1000);
        this.hudText.setText(
            `Gen: ${this.generation} | T: ${seconds}s | Vivos: ${this.population.filter(a => a.alive).length}`
        );

        // Fin de generación
        if (this.gameTime >= this.maxGameTime) {
            this.endGeneration();
        }

        // Actualizar panel HTML
        this.updateStats();
    }

    // ─────────────────────────────────────────────────────────────────
    createObstacles() {
        this.obstacles = this.physics.add.staticGroup();

        // Obstáculos: posición x, altura desde suelo, ancho, alto
        const obstacleData = [
            { x: 280, w: 25, h: 50 },   // primer salto (fácil)
            { x: 500, w: 30, h: 70 },   // segundo salto (medio)
            { x: 730, w: 35, h: 55 },   // tercer salto
            { x: 880, w: 25, h: 90 },   // cuarto salto (difícil)
        ];

        obstacleData.forEach(data => {
            // El obstáculo se posa sobre el suelo
            const yPos = 455 - (data.h / 2); // 455 = borde superior del suelo
            const obs = this.add.rectangle(data.x, yPos, data.w, data.h, 0xe63946);
            this.physics.add.existing(obs, true);
            this.obstacles.add(obs);

            // Borde decorativo (línea encima del obstáculo)
            this.add.rectangle(data.x, yPos - (data.h / 2) - 2, data.w, 4, 0xff6b6b);
        });
    }

    // ─────────────────────────────────────────────────────────────────
    initializePopulation() {
        // Limpiar población anterior si existe
        this.population.forEach(agent => {
            if (agent.sprite) agent.sprite.destroy();
        });
        this.population = [];

        for (let i = 0; i < this.populationSize; i++) {
            // Colores diferentes para identificar agentes (HSL)
            const hue = Math.floor((i / this.populationSize) * 360);
            const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color;

            // Crear sprite del agente (rectángulo de 20x30)
            // Todos empiezan en x=50, encima del suelo (y=440 = 455 - 15)
            const sprite = this.add.rectangle(50, 440, 20, 30, color);
            this.physics.add.existing(sprite); // dinámico (se mueve)

            sprite.body.setBounce(0.0);
            sprite.body.setCollideWorldBounds(true);
            sprite.body.setMaxVelocityY(400);

            // Colisión con suelo y obstáculos
            this.physics.add.collider(sprite, this.ground);
            this.physics.add.collider(sprite, this.obstacles, () => {
                // Al chocar con obstáculo → el agente muere
                agent.alive = false;
                sprite.setFillStyle(0x555555); // gris = muerto
            });

            const agent = {
                id: i,
                sprite: sprite,
                fitness: 0,
                alive: true,
                dna: null // se implementa en Fase 3
            };

            // Guardar referencia cruzada para el callback de colisión
            sprite._agent = agent;
            this.population.push(agent);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    updateStats() {
        if (this.population.length === 0) return;

        const fitnesses  = this.population.map(a => a.fitness);
        const bestFit    = Math.max(...fitnesses);
        const avgFit     = fitnesses.reduce((s, f) => s + f, 0) / fitnesses.length;

        document.getElementById('generation').textContent  = this.generation;
        document.getElementById('best-fitness').textContent = bestFit.toFixed(1);
        document.getElementById('population').textContent  = this.population.length;
        document.getElementById('avg-fitness').textContent = avgFit.toFixed(1);
    }

    // ─────────────────────────────────────────────────────────────────
    endGeneration() {
        console.log(`--- Generación ${this.generation} terminada ---`);
        console.log(`Mejor fitness: ${Math.max(...this.population.map(a => a.fitness)).toFixed(1)}`);

        this.generation++;
        this.gameTime = 0;
        this.initializePopulation();
    }
}