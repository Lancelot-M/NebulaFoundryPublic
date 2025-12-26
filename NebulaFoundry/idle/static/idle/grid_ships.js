const { Sprite, Texture, Graphics } = PIXI;


export function get_ships_methods(app) {
    /**
    Appels les fonctionnalitées liées aux spaceships
     Fonction de lancement de l'app.
    */
    get_ships_mapper(app);
    get_my_ship(app);
}

export function get_ships_mapper(app) {
    /**
    Gestion des infos/éléments systèmes, permettant la lecture des rapports
     Fonction de lancement de l'app.
    */
    app.game_items.ship_mapper = new Map();
}

export function get_my_ship(app) {
    /**
    Gestion des infos/éléments du joueur client.
    Fonction de lancement de l'app.
    */
    set_pixi_ships(app);
    set_serv_ships_vals(app);
}

export function set_pixi_ships(app) {
    /**
    Création du sprite pour pixi représentant le joueur a l'ecran
    */
    var pixi_ship = Sprite.from('ship');
    pixi_ship.position.set(50);
    pixi_ship.scale = 0.8;
    app.game_items.grid.addChild(pixi_ship);
    app.game_items.player = pixi_ship;
}

export function set_serv_ships_vals(app) {
    /**
    Création du game_items ship_data représentant les infos du joueurs
    petit get ?
    */
    // app.game_items.player.pk = get.id ?
}
