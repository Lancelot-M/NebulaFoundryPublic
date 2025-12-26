const { Sprite, Texture, Graphics } = PIXI;


export function get_stations(app) {
    /**
    Gestion des infos/éléments stations.
    Fonction de lancement de l'app.
    */
    set_pixi_stations(app);
    set_serv_stations_vals(app);
}

export function set_pixi_stations(app) {
    /**
    Création du sprite pour pixi représentant le joueur a l'ecran
    */
    var pixi_station = Sprite.from('station');
    pixi_station.name = "KOUKOU";
    pixi_station.x = 0;
    pixi_station.y = 0;
    pixi_station.anchor = 0.5;
    pixi_station.scale = 1;
    app.game_items.grid.addChild(pixi_station);
    // app.game_items.stations = {};
    app.game_items.stations = pixi_station;
}

export function set_serv_stations_vals(app) {
    /**
    Création du game_items ship_data représentant les infos du joueurs
    petit get ?
    */
    // app.game_items.player.pk = get.id ?
}
