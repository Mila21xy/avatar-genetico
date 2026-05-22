class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // Aquí cargaríamos assets (imágenes, sprites)
        // De momento, usaremos formas simples
    }

    create() {
        // Inicializar variables
        this.generation = 0;
        this.populationSize = 30;
        this.population = [];
        this.gameTime = 0;
        this.maxGameTime = 5000; // 5 segundos por generación
        this.isRunning = true;

        // Crear obstáculos
        this.createObstacles();

        // Inicializar población
        this.initializePopulation();

        // Texto de depuración
        this.text = this.add.text(10, 10, 'Generación: 0', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
    }

    update() {
        if (!this.isRunning) return;

        this.gameTime += 16; // ~60 FPS

        // Actualizar cada agente
        this.population.forEach(agent => {
            if (agent.sprite && agent.sprite.active) {
                // La lógica del movimiento irá aquí
                agent.updateFitness();
            }
        });

        // Mostrar generación actual
        this.text.setText(`Gen: ${this.generation} | T: ${Math.floor(this.gameTime / 1000)}s`);

        // Si termina la generación
        if (this.gameTime >= this.maxGameTime) {
            this.endGeneration();
        }

        this.updateStats();
    }

    createObstacles() {
        this.obstacles = this.physics.add.staticGroup();
        
        // Crear algunos obstáculos de prueba
        const obstaclePositions = [
            { x: 300, y: 400, width: 80, height: 20 },
            { x: 550, y: 350, width: 100, height: 20 },
            { x: 800, y: 300, width: 80, height: 20 }
        ];

        obstaclePositions.forEach(pos => {
            const rect = this.add.rectangle(pos.x, pos.y, pos.width, pos.height, 0xff6b6b);
            this.physics.add.existing(rect, true);
            this.obstacles.add(rect);
        });
    }

    initializePopulation() {
        // De momento, crear 30 agentes ficticios
        for (let i = 0; i < this.populationSize; i++) {
            const agent = {
                id: i,
                x: 50,
                y: 400,
                fitness: 0,
                sprite: null,
                dna: null // Lo implementaremos después
            };

            // Crear visual del agente
            agent.sprite = this.add.rectangle(agent.x, agent.y, 20, 30, 0x4ecdc4);
            this.physics.add.existing(agent.sprite);
            agent.sprite.body.setBounce(0.2);
            agent.sprite.body.setCollideWorldBounds(true);

            // Colisiones con obstáculos
            this.physics.add.collider(agent.sprite, this.obstacles);

            this.population.push(agent);
        }
    }

    updateStats() {
        // Actualizar panel de estadísticas en HTML
        if (this.population.length > 0) {
            const bestFitness = Math.max(...this.population.map(a => a.fitness));
            const avgFitness = this.population.reduce((sum, a) => sum + a.fitness, 0) / this.population.length;

            document.getElementById('generation').textContent = this.generation;
            document.getElementById('best-fitness').textContent = bestFitness.toFixed(2);
            document.getElementById('population').textContent = this.population.length;
            document.getElementById('avg-fitness').textContent = avgFitness.toFixed(2);
        }
    }

    endGeneration() {
        console.log(`Generación ${this.generation} completada`);
        
        // Reiniciar para la siguiente generación
        this.generation++;
        this.gameTime = 0;
        this.population = [];
        this.initializePopulation();
    }
}