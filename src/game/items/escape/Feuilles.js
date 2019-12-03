import {openBook} from '../../utils/book';
import { closeBook } from '../../utils/book';

export class Feuilles {

    sprite;
    backdrop;
    page = 1;

    constructor() {
        game.controls.ACTION.onPress(() => closeBook())
    }

    create(x, y) {
        this.backdrop = game.add.image(0, 0, 'backdrop');
        this.backdrop.width = game.width;
        this.backdrop.height = game.height;
        this.backdrop.inputEnabled = true;
        this.backdrop.events.onInputDown.add(() => {
            this.backdrop.visible = false;
            closeBook();
        });
        this.backdrop.visible = false;

        this.sprite = game.add.image(x, y, 'escape_feuilles', 0);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputOver.add(() => this.sprite.frame = 1);
        this.sprite.events.onInputOut.add(() => this.sprite.frame = 0);
        this.sprite.events.onInputDown.add(() => this.openBook());
    }

    openBook() {
        if (game.book)
            return

        this.backdrop.visible = true;
        openBook('book_escape', this.page);  
    }

    nextPage() {
        this.page++;
    }
}