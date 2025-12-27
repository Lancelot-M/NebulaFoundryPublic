const { Sprite, Texture, Graphics } = PIXI;


export async function get_ores(app) {
    /**
    Gestion des infos/éléments stations.
    Fonction de lancement de l'app.
    */
    await set_serv_ores_vals(app);
    set_pixi_ores(app);
}

export function set_pixi_ores(app) {
    /**
    Création des sprites pour pixi représentant les ores
    */
    app.game_items.ores.pixi = {};
    for (var [id, django_ore] of Object.entries(app.game_items.ores.django)) {
        var pixi_ore = Sprite.from('ore_s');
        // Ajout d'element depuis js
        pixi_ore.scale = 0.8;
        pixi_ore.zIndex = 10;
        pixi_ore.anchor = 0.5;
        // Ajout d'element depuis pyhton
        pixi_ore.x = django_ore.pos_x;
        pixi_ore.y = django_ore.pos_y;
        // Ajout a l'app
        app.game_items.grid.addChild(pixi_ore);
        app.game_items.ores.pixi[id] = pixi_ore;
    }
}


export async function set_serv_ores_vals(app) {
    /**
    Création du game_items ores représentant les cailloux
    */
    var response = await fetch('http://localhost:8000/system_ores/1', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    });
    var response_json = await response.json();
    app.game_items.ores = {};
    app.game_items.ores.django = {};
    for (var [key, value] of Object.entries(response_json)) {
        app.game_items.ores.django[key] = value;
    }
    console.log(app.game_items.ores.django);
}
