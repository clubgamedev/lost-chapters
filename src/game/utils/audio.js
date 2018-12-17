export const sounds = {}

export function loadAudio () {
    game.load.audio("music", [
        "assets/sound/ForestV1.mp3"
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

export function addSounds () {
    Object.assign(sounds, {
        HURT: game.add.audio("hurt"),
        ITEM: game.add.audio("item"),
        ENEMY_DEATH: game.add.audio("enemy-death"),
        SLASH: game.add.audio("slash")
    })
}

export function startMusic () {
    game.music = game.add.audio("music");
    game.music.loop = true;
    game.music.play();

    game.music.onPlay.add(() => addEffects());
    game.onExit = () => game.music.stop();
}

export function addEffects () {
    const context = game.music.context;
    const source = game.music._sound;
    source.disconnect(0);

    const tuna = new Tuna(context);
    const effect = new tuna.Bitcrusher({
        bits: 16,          //1 to 16
        normfreq: 0.8,    //0 to 1
        bufferSize: 1024  //256 to 16384
    });

    source.connect(effect);
    effect.connect(game.music.externalNode || game.music.gainNode);
}