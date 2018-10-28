export const sounds = {}

export function loadAudio() {
    game.load.audio("music", [
        "assets/sound/ancient_path.ogg",
        "assets/sound/ancient_path.mp3"
    ]);
    game.load.audio("hurt", ["assets/sound/hurt.ogg", "assets/sound/hurt.mp3"]);
    game.load.audio("slash", [
        "assets/sound/slash.ogg",
        "assets/sound/slash.mp3"
    ]);
    game.load.audio("item", ["assets/sound/item.ogg", "assets/sound/item.mp3"]);
    game.load.audio("enemy-death", [
        "assets/sound/enemy-death.ogg",
        "assets/sound/enemy-death.mp3"
    ]);
}

export function addSounds() {
    Object.assign(sounds, {
        HURT: game.add.audio("hurt"),
        ITEM: game.add.audio("item"),
        ENEMY_DEATH: game.add.audio("enemy-death"),
        SLASH: game.add.audio("slash")
    })
}

export function startMusic() {
    game.music = game.add.audio("music");
    game.music.loop = true;
    game.music.play();
    game.onExit = () => game.music.stop();
}