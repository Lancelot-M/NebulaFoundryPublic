const { Sprite, Texture, Container } = PIXI;


export function addSystemElement(app, sprites) {
    // create an empty container
    const systemContainer = new Container();
    sprites.container = systemContainer;
    app.stage.addChild(systemContainer);
    sprites = addAstero(systemContainer, sprites, app);
    sprites = addStation(systemContainer, sprites);
    sprites = addPlanets(systemContainer, sprites);
    return sprites
}

export function addPlanets(systemContainer, sprites) {
    const planet = Sprite.from('star3');
    planet.position.set(0, 0);
    planet.anchor = 0.5;
    planet.name = 'Black Hole';
    planet.amount = 69;
    planet.scale = 2;
    planet.action_possible = ['moving'];
    systemContainer.addChild(planet);
    sprites.planet = planet;
    return sprites;
}


export function addAstero(systemContainer, sprites, app) {
    var astero_array = [];
    var ore_count = 25;
    for (let i = 0; i < ore_count; i++) {
          const astero = Sprite.from('ore_s');
          astero.anchor.set(0.5);
          astero.name = 'ore_s';
            astero.amount = 200000;
            astero.scale = 0.5;
            astero.action_possible = ['moving', 'mining'];
          astero.x = Math.random() * 2000;
          astero.y = Math.random() * 1000;
          astero.eventMode = 'static';
          astero.cursor = 'pointer';
          astero.on('pointerdown', onClick);

          // Alternatively, use the mouse & touch events:
    // sprite.on('click', onClick); // mouse-only
    // sprite.on('tap', onClick); // touch-only
    function onClick() {
        app.gameState.selected = this;
        var html_collection = document.getElementsByClassName('btn-clic');
        for (var btn of html_collection) {
                btn.classList.remove('hide');
                if (this.action_possible.includes(btn.id) == false) {
                    btn.classList.add('hide');
                }
        }
    }

          systemContainer.addChild(astero);
          astero_array.push(astero);
        }
    return sprites
}

export function addStation(systemContainer, sprites) {
    const station = Sprite.from('station');
    station.name = 'Station Spatiale';
    station.position.set(400, 1200);
    station.anchor = 0.5;
    station.storage = 0;
    station.scale = 1;
    station.action_possible = ['moving', 'docking'];
    systemContainer.addChild(station);
    sprites.station = station
    return sprites
}