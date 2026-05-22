// Importar escena (debe estar antes que game.js en index.html)

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'phaser-game',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },  // gravedad aumentada, más natural
            debug: false          // cambia a true si quieres ver los hitboxes
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);