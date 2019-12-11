import { books } from "../books"
import { sounds } from "../audio"

export function openBook(bookName, page = 1) {
    let pages = books[bookName]
    if (!pages) return;
    if (game.player) game.player.stopMoving();

    let bgSprite = game.add.sprite(35, 4, "book-bg");
    let color = "black"
    bgSprite.fixedToCamera = true;

    let bookFont = {
        font: "10px Alagard",
        fill: "black",
        boundsAlignH: "left",
        boundsAlignV: "bottom",
        wordWrap: true,
        wordWrapWidth: 76
    }

    let textSpriteLeft = game.add.text(44, 12, "", bookFont);
    //textSpriteLeft.setShadow(1, 1, '#280900', 0);
    textSpriteLeft.lineSpacing = -10;
    textSpriteLeft.fixedToCamera = true;

    let textSpriteRight = game.add.text(135, 12, "", bookFont);
    //textSprite2.setShadow(1, 1, '#280900', 0);
    textSpriteRight.lineSpacing = -10;
    textSpriteRight.fixedToCamera = true;

    game.book = { page: page - 1, pages: [...pages], color, textSpriteLeft, textSpriteRight, bgSprite };

    for (let i = 0; i < page; i++) {
        nextPage();
    }

    return new Promise((resolve) => {
        game.book.onClose = resolve
    });
}

export function nextPage() {
    if (!game.book) return;
    game.book.page++;

    let pageLeft = game.book.pages.shift();
    let pageRight = game.book.pages.shift();

    if (!pageLeft && !pageRight) return closeBook();

    if (game.book.page === 1) sounds.OPEN_BOOK.play()
    else sounds.PAGE.play();
    game.book.textSpriteLeft.text = pageLeft || '';
    game.book.textSpriteRight.text = pageRight || '';
}


export function closeBook() {
    if (game.book) {
        game.book.textSpriteLeft.destroy();
        game.book.textSpriteRight.destroy();
        game.book.bgSprite.destroy();
        game.book.onClose();
        sounds.CLOSE_BOOK.play();
        delete game.book;
    }
}