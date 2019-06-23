export class Plant {

    _sprite;
    _body;
    _isFalling = false;
    bigSuspend;

    constructor() {
        game.load.spritesheet('potfleur', 'assets/escape/potfleur.png', 16, 16, 2);
        game.load.image('bigSuspend', 'assets/alchemy/bigSuspend.png');
    }

    // create(x, y) {

    //     game.physics.startSystem(Phaser.Physics.P2JS);

    //     this._sprite = game.add.sprite(x, y, 'potfleur');
    //     game.physics.arcade.enable(this._sprite);
    //     this._sprite.body.gravity.y = 300;
    //     this._sprite.body.collideWorldBounds = true;

    //     this.bigSuspend = game.add.sprite(145, 55, 'bigSuspend');
    //     game.physics.arcade.enable(this.bigSuspend);
    //     this.bigSuspend.body.immovable = true;


    //     game.physics.arcade.collide(this._sprite, this.bigSuspend);

    //     game.debug.body(this._sprite);
    //     game.debug.body(this.bigSuspend);
    // }

    create(x, y) {
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.gravity.y = 500;

        this._sprite = game.add.sprite(x, y, 'potfleur');
        this.bigSuspend = game.add.sprite(145, 55, 'bigSuspend');

        game.physics.box2d.enable(this._sprite);
        this._sprite.body.angle = 30;
        game.physics.box2d.enable(this.bigSuspend);
        this.bigSuspend.body.angle = 30;
    }
    

    update() {
        // if (this._isFalling) {
        //     this._sprite.y++;
        //     this._sprite.angle++;
        // }
        game.physics.arcade.collide(this._sprite, this.bigSuspend);
        this._sprite.body.velocity.x = 0;
    }

    fall() {
        console.log('plant falling');
        this._isFalling = true;
    }
}