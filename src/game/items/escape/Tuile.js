export class Tuile {

    sprite;
    angleCible = 0;
    angleSolution;
    checkable;
    callbackCheck;

    constructor(tuile, x, y, callbackCheck) {
        if (tuile.s === 'A') {
            this.sprite = game.add.sprite(x, y, 'escape_labyrinthe_angle');
        } else if (tuile.s === 'D') {
            this.sprite = game.add.sprite(x, y, 'escape_labyrinthe_droite');
        }

        this.callbackCheck = callbackCheck;
        this.angleSolution = tuile.a;
        this.sprite.x += 2;
        this.sprite.y += 2;
        this.sprite.anchor.setTo(0.5);
        // this.sprite.angle = Math.floor(Math.random() * 4) * 90;
        this.sprite.angle = tuile.a ? tuile.a[0] : null;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => {
            if (this.angleCible <= 0) {
                this.checkable = true;
                this.angleCible = 90;
            }
        });
    }

    update() {
        if (this.angleCible > 0) {
            this.sprite.angle += 18;
            this.angleCible -= 18;
        } else if (this.checkable) {
            this.callbackCheck();
            this.checkable = false;
        }
    }

    isAngleSolutionOk() {
        return !this.angleSolution || this.angleSolution.indexOf(this.sprite.angle) !== -1;
    }
}