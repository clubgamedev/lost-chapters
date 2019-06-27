import { books } from "../dialogs"

export function openBook(bookName) {
    let pages = books[bookName]
    if (!pages) return;
    if (game.player) game.player.stopMoving();
    game.paused = true;

    let bgSprite = game.add.sprite(35, 4, "book-bg");
    let color = "black"
    bgSprite.fixedToCamera = true;

    let bookFont = {
        font: "12px Alagard",
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

    game.book = { pages: [...pages], color, textSpriteLeft, textSpriteRight, bgSprite };

    nextPage();

    return new Promise((resolve) => {
        game.book.onClose = resolve
    });
}

export function nextPage() {
    if (!game.book) return;

    let pageLeft = game.book.pages.shift();
    let pageRight = game.book.pages.shift();

    if (!pageLeft && !pageRight) return closeBook();

    game.book.textSpriteLeft.text = pageLeft || '';
    game.book.textSpriteRight.text = pageRight || '';

}


export function closeBook() {
    if (game.book) {
        game.book.textSpriteLeft.destroy();
        game.book.textSpriteRight.destroy();
        game.book.bgSprite.destroy();
        game.book.onClose();
        delete game.book;
        game.paused = false;
    }
}