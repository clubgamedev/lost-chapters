import { pickRandomIn, range } from "../../utils/array";
import { sounds } from "../../audio";

export class Tuile {
    sprite;
    shape;
    angle;
    signalFrom;
    connected = false;
    hovered = false;

    constructor({ shape, x, y, onTurn }) {
        this.sprite = game.add.sprite(92 + x * 5, 33 + y * 5, `escape_labyrinthe_${shape === 'a' ? 'angle' : 'droite'}`);
        this.x = x;
        this.y = y;
        //this.width = 5;
        //this.height = 5;
        this.shape = shape;
        this.sprite.anchor.setTo(0.5);
        this.angle = pickRandomIn(range(0, (this.shape === "d" ? 1 : 3)))
        this.sprite.angle = this.angle * 90;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => {
            sounds.PANEL_SLIDE.play();
            this.angle = (this.angle + 1) % (this.shape === "d" ? 2 : 4);
            setTimeout(() => onTurn(this.angle), 500) // defined in parent
        });
        this.sprite.onOver = () => { this.hovered = true; }
        this.sprite.onOut = () => { this.hovered = false; }
    }

    update() {
        let angleCible = this.angle * 90;
        let maxAngle = this.shape === "d" ? 180 : 360
        let spriteAngle = (this.sprite.angle + maxAngle) % maxAngle;
        if (angleCible !== spriteAngle) {
            this.sprite.angle += 9;
        }
        this.sprite.frame = this.connected ? 1 : 0;
        this.sprite.tint = this.hovered ? 0xCCCCFF : 0xFFFFFF;
    }

    get type() {
        return `${this.shape}${this.angle}`
    }
}