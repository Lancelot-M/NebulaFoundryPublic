const { Sprite, Texture, Graphics } = PIXI;


export async function get_stations(app) {
    /**
    Gestion des infos/éléments stations.
    Fonction de lancement de l'app.
    */
    await set_serv_stations_vals(app);
    set_pixi_stations(app);
}

export function set_pixi_stations(app) {
    /**
    Création du sprite pour pixi représentant le joueur a l'ecran
    */
    var pixi_station = Sprite.from('station');
    // Ajout d'element depuis js
    pixi_station.name = "KOUKOU";
    pixi_station.anchor = 0.5;
    pixi_station.scale = 1;
    pixi_station.zIndex = 5;
    // Ajout d'element depuis pyhton
    pixi_station.x = app.game_items.stations.django.pos_x;
    pixi_station.y = app.game_items.stations.django.pos_y;
    // Ajout a l'app
    app.game_items.grid.addChild(pixi_station);
    app.game_items.stations.pixi = pixi_station;
}

export async function set_serv_stations_vals(app) {
    /**
    Création du game_items stations_data représentant les infos des stations ? ( future regrouépe static ? )
    */
    var reponse = await fetch('http://localhost:8000/system_station/1', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });
    app.game_items.stations = await {};
    app.game_items.stations.django = await reponse.json();
}
