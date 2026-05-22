// Configuración principal de Phaser

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);