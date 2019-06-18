export class Plant {

    _sprite;
    _body;
    _isFalling = false;

    constructor() {
        game.load.spritesheet('potfleur', 'assets/escape/potfleur.png', 16, 16, 2);
    }

    create(x, y) {

        // player = game.add.sprite(x, y, 'potfleur');

        // game.physics.arcade.enable(player);

        // player.anchor.setTo(0.5)
        // player.body.setSize(16, 26, 8, 5)
        // player.body.gravity.y = 1400;

        // this._sprite = game.add.image(x, y, 'potfleur', 0);
        this._sprite = game.add.sprite(x, y, 'potfleur');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this._sprite);
        // this._sprite.body.setSize(16, 26, 8, 5)
        this._sprite.body.gravity.y = 300;

        // player.body.setSize(16, 26, 8, 5)
        // player.body.gravity.y = 1400;
        // player.body.collideWorldBounds = true;
    }

    update() {
        if (this._isFalling) {
            this._sprite.y++;
            this._sprite.angle++;
        }
    }

    fall() {
        console.log('plant falling');
        this._isFalling = true;
    }
}