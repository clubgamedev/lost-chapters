import { openBook, closeBook } from '../../utils/book';

export class Feuilles {

    sprite;
    page = 1;

    constructor() {
        game.controls.ACTION.onPress(() => closeBook())
    }

    create(x, y) {
        this.sprite = game.add.image(x, y, 'escape_feuilles', 0);
        this.sprite.inputEnabled = true;
        this.sprite.onOver = () => { this.sprite.frame = 1 };
        this.sprite.onOut = () => { this.sprite.frame = 0 };
        this.sprite.events.onInputDown.add(() => this.openBook());
    }

    openBook() {
        if (game.book) {
            this.onBookClose(); // declared in parent
            game.paused = false;
            return closeBook()
        }

        this.onBookOpen() // declared in parent
        openBook('book_escape', this.page);
        game.controls.ACTION.onPress(closeBook, this, true);
    }

    nextPage() {
        this.page++;
    }
}