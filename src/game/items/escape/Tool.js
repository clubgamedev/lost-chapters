
export class Tool {

    sprite = null;
    spriteOutline;
    isToolDroping = false;
    isToolClicked = false;
    positionInitX;
    animationActivatePositionFinaleX = 50;
    animationActivatePositionFinaleY = 31;
    animationActivateDeltaX;
    animationActivateDeltaY;
    animationActivateDuration = 30;

    create(x, y) {
        this.positionInitX = x;

        this.spriteOutline = game.add.image(x - 1, y - 1, 'escape_outil_outline');
        this.spriteOutline.visible = false;

        this.sprite = game.add.image(x, y, 'escape_outil');
        this.sprite.inputEnabled = true;
        this.sprite.onOver = () => this.spriteOutlineEnable();
        this.sprite.onOut = () => this.spriteOutlineDisable();

        this.isToolDroping = true;
    }

    update() {
        if (!this.sprite) return;

        if (this.isToolDroping) {
            this.sprite.x--;
            if (this.sprite.x % 5 === 0) this.sprite.y--;
            if (this.sprite.x <= this.positionInitX - 15) {
                this.isToolDroping = false;
                this.animationActivateDeltaX = (this.sprite.x - this.animationActivatePositionFinaleX) / this.animationActivateDuration;
                this.animationActivateDeltaY = (this.sprite.y - this.animationActivatePositionFinaleY) / this.animationActivateDuration;
                this.sprite.events.onInputDown.add(() => this.onClick());
            }
        }

        if (this.isToolClicked) {
            if (this.sprite.x <= this.animationActivatePositionFinaleX || this.sprite.y <= this.animationActivatePositionFinaleY) {
                this.isToolClicked = false;
                this.spriteOutlineDisable();
                this.onActivate(); // defined in parent
            } else {
                this.sprite.x -= this.animationActivateDeltaX;
                this.sprite.y -= this.animationActivateDeltaY;
                this.spriteOutline.x -= this.animationActivateDeltaX;
                this.spriteOutline.y -= this.animationActivateDeltaY;
            }
        }
    }

    onClick() {
        this.isToolClicked = true;
        this.sprite.events.onInputDown.removeAll();
    }

    spriteOutlineEnable() {
        this.spriteOutline.x = this.sprite.x - 1;
        this.spriteOutline.y = this.sprite.y - 1;
        this.spriteOutline.visible = true;
    }

    spriteOutlineDisable() {
        this.spriteOutline.visible = false
    }
}