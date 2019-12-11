export const sounds = {}

export function loadAudio() {
    game.load.audio("music_forest", ["assets/sound/ForestV1.mp3"]);
    game.load.audio("music_school", ["assets/sound/Song_Mistery.ogg"]);
    game.load.audio("music_sanctuary", ["assets/sound/Song_VisitingHerForest.ogg"]);
    game.load.audio("music_cave", ["assets/sound/Song_PainfulMemories_Loop.ogg"]);
    game.load.audio("music_autel", ["assets/sound/Music_6_EvilBattle_Loop.ogg"]);
    game.load.audio("hurt", ["assets/sound/hurt.ogg", "assets/sound/hurt.mp3"]);
    game.load.audio("slash", [
        "assets/sound/slash.ogg",
        "assets/sound/slash.mp3"
    ]);
    game.load.audio("item", ["assets/sound/item.ogg", "assets/sound/item.mp3"]);
    game.load.audio("hallucination", ["assets/sound/hallucination.wav"]);

    game.load.audio('pick', 'assets/alchemy/sounds/pick.wav');
    game.load.audio('cook_fail', 'assets/alchemy/sounds/cook_fail.wav');
    game.load.audio('cook_success', 'assets/alchemy/sounds/cook_success.wav');
    game.load.audio('book_open', 'assets/alchemy/sounds/book_open.mp3');
    game.load.audio('book_close', 'assets/alchemy/sounds/book_close.mp3');
}

export function addSounds() {
    Object.assign(sounds, {
        HURT: game.add.audio("hurt"),
        ITEM: game.add.audio("item"),
        ENEMY_DEATH: game.add.audio("enemy-death"),
        SLASH: game.add.audio("slash"),
        HALLUCINATION: game.add.audio("hallucination"),
        PICK: game.sound.add('pick'),
        COOK_SUCCESS: game.sound.add('cook_success'),
        COOK_FAIL: game.sound.add('cook_fail'),
        OPEN_BOOK: game.sound.add('book_open'),
        CLOSE_BOOK: game.sound.add('book_close')
    })
}

export function startMusic(name) {
    if (game.music && game.music.isPlaying) {
        game.music.stop();
    }
    game.music = game.add.audio(name);
    game.music.loop = true;
    game.music.volume = 0.5;
    game.music.play();

    //game.music.onPlay.add(() => addEffects());
    game.onExit = () => game.music.stop();
}

export function addEffects() {
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