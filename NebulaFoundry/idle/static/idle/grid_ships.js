const { Sprite, Texture, Graphics } = PIXI;


export async function get_ships_methods(app) {
    /**
    Appels les fonctionnalitées liées aux spaceships
     Fonction de lancement de l'app.
    */
    await get_my_ship(app);
    get_ships_mapper(app);
}

export function get_ships_mapper(app) {
    /**
    Gestion des infos/éléments systèmes, permettant la lecture des rapports
     Fonction de lancement de l'app.
    */
    app.game_items.ship_mapper = new Map();
}

export async function get_my_ship(app) {
    /**
    Gestion des infos/éléments du joueur client.
    Fonction de lancement de l'app.
    */
    await set_serv_ships_vals(app);
    set_pixi_ships(app);
}

export function set_pixi_ships(app) {
    /**
    Création du sprite pour pixi représentant le joueur a l'ecran
    */
    var pixi_ship = Sprite.from('ship');
    // Ajout d'element depuis js
    pixi_ship.scale = 0.8;
    pixi_ship.zIndex = 10;
    pixi_ship.anchor = 0.5;
    // Ajout d'element depuis pyhton
    pixi_ship.x = app.game_items.player.django.pos_x;
    pixi_ship.y = app.game_items.player.django.pos_y;
    // Ajout a l'app
    app.game_items.grid.addChild(pixi_ship);
    app.game_items.player.pixi = pixi_ship;
}

export async function set_serv_ships_vals(app) {
    /**
    Création du game_items ship_data représentant les infos du joueurs
    petit get ?
    */
    var reponse = await fetch('http://localhost:8000/my_ship', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });
    app.game_items.player = {};
//    var pipou = await reponse.json();
    app.game_items.player.django = await reponse.json();
}

export function app_ship_listening(app) {
    if (app.game_items.player.is_docking && app.game_items.player.is_docking == true) {
        app.reporting_management.synchronisation_pending = true;
        window.location.replace('http://localhost:8000/hangar/1');
    }
}