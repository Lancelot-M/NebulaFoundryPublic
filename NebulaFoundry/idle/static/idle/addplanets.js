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

    const oreData = JSON.parse(
        document.getElementById("ore-data").textContent
    );

    var astero_array = [];
    for (var ore of oreData) {
          var pixi_ore = Sprite.from('ore_s');
          pixi_ore.anchor.set(0.5);
          pixi_ore.x = ore.fields.pos_x;
          pixi_ore.y = ore.fields.pos_y;
          pixi_ore.django_ore = ore;
          pixi_ore.storage = ore.fields.storage;
          pixi_ore.scale = 1;
          pixi_ore.action_possible = ['moving', 'mining'];
          pixi_ore.eventMode = 'static';
          pixi_ore.cursor = 'pointer';
          pixi_ore.on('pointerdown', onClick);

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

          systemContainer.addChild(pixi_ore);
          astero_array.push(pixi_ore);
        }
        sprites.ore_array = astero_array
    return sprites
}

export function addStation(systemContainer, sprites) {


    const stationData = JSON.parse(
        document.getElementById("stations-data").textContent
    );
    var stations_array = [];

    for (var station of stationData) {
            var pixi_station = Sprite.from('station');
            pixi_station.name = station.fields.name;
            pixi_station.x = station.fields.pos_x;
            pixi_station.y = station.fields.pos_y;
            pixi_station.django_station = station;
            pixi_station.anchor = 0.5;
            pixi_station.storage = station.storage;
            pixi_station.scale = 1;
            pixi_station.action_possible = ['moving', 'docking'];
            systemContainer.addChild(pixi_station);
            stations_array.push(pixi_station);
        }
        sprites.stations_array = stations_array
    return sprites


}