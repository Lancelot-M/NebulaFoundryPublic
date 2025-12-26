const { Sprite, Texture, Container } = PIXI;


export function addSystemElement(app) {
    // create an empty container
    app.gameState.system_container = new Container();
    app.stage.addChild(app.gameState.system_container);
    addAstero(app);
    addStation(app);
}

export function addPlanets(systemContainer) {
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


export function addAstero(app) {

    const oreData = JSON.parse(
        document.getElementById("ore-data").textContent
    );

    for (var ore of oreData) {
          var pixi_ore = Sprite.from('ore_s');
          pixi_ore.anchor.set(0.5);
          pixi_ore.pk = ore.pk;
          pixi_ore.x = ore.fields.pos_x;
          pixi_ore.y = ore.fields.pos_y;
          pixi_ore.django_ore = ore;
          pixi_ore.storage = ore.fields.storage;
          pixi_ore.scale = 1;
          pixi_ore.action_possible = ['moving', 'mining'];
          pixi_ore.eventMode = 'static';
          pixi_ore.cursor = 'pointer';
         // pixi_ore.on('pointerdown', onClick);

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

          app.gameState.system_container.addChild(pixi_ore);
          app.gameState.ores.set(ore.pk.toString(), pixi_ore);
        }
}

export function addStation(app) {


    const stationData = JSON.parse(
        document.getElementById("stations-data").textContent
    );

    var station = stationData[0];
    var pixi_station = Sprite.from('station');
    pixi_station.name = station.fields.name;
    pixi_station.x = station.fields.pos_x;
    pixi_station.y = station.fields.pos_y;
    pixi_station.django_station = station;
    pixi_station.anchor = 0.5;
    pixi_station.storage = station.storage;
    pixi_station.scale = 1;
    pixi_station.action_possible = ['moving', 'docking'];
    app.gameState.system_container.addChild(pixi_station);
    app.gameState.station = pixi_station;
}
