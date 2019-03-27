import { pages } from "../dialogs"

export function openPage(page) {
    game.player.stopMoving();

    let bgSprite = game.add.sprite(35, 4, "page-bg");
    let color = "black"
    bgSprite.fixedToCamera = true;

    let bookFont = {
        font: "13px Alagard",
        fill: "black",
        boundsAlignH: "left",
        boundsAlignV: "bottom",
        wordWrap: true,
        wordWrapWidth: 150
    }

    let textSprite = game.add.text(50, 14, "", bookFont);
    //textSprite.setShadow(1, 1, '#280900', 0);
    textSprite.lineSpacing = -9;
    textSprite.fixedToCamera = true;
    textSprite.text = page

    game.page = { page, color, textSprite, bgSprite };
}


export function readPage(name) {
    openPage(pages[name]);
}

export function closePage() {
    if (game.page) {
        game.page.textSprite.destroy();
        game.page.bgSprite.destroy();
        delete game.page;
    }
}