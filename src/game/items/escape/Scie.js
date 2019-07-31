export class Scie {

    sprite;

    constructor() {
        game.load.spritesheet('scie', 'assets/escape/scie.png', 52, 15, 16);
        game.load.spritesheet('digicode_cable', 'assets/escape/digicode/digicode_cable.png', 3, 19, 2);
    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'scie', 0);
        this.sprite.animations.add('open', [1, 2, 3], 10);
        this.sprite.animations.add('move', [4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ,14 ,15], 10);
    }

    openScie() {
        this.sprite.animations.play('open');
    }

    activate() {
        let anim = this.sprite.animations.play('move');
        anim.enableUpdate = true;
        anim.onUpdate(frame => (frame === 10) ? this.dropCable() : null);
    }

    dropCable() {
        game.add.image(this.sprite.x, this.sprite.y, 'digicode_cable', 1);
    }

    update() {

    }
}