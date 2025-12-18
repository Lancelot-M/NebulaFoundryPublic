const { Sprite, Texture, Graphics } = PIXI;



export function addShip(app) {

    const shipData = JSON.parse(
        document.getElementById("ship-data").textContent
    );


    // pour x et y = target - origin
    //atan2(y, x) >>> donne un angle en rad dans le sens inverse des aiguilles
    // Sprite.rotation fait tourner dans le sens des aiguilles donc radiant * -1 pour inverser
    // Sprte départ verticale + 90° pour compenser (Math.PI / 2)

    const ship = Sprite.from('ship');
    ship.anchor = 0.5;
    ship.speed = shipData.speed;
    ship.minning_speed = shipData.minning_speed;
    ship.position.set(app.screen.width / 2, app.screen.height / 2);
    ship.inGameX = shipData.pos_x;
    ship.inGameY = shipData.pos_y;
    ship.action = 'spawned';
    ship.action_status = 'spawned';
    ship.home = null;
    ship.storage_max = shipData.storage_max;
    ship.storage = shipData.storage;
    ship.scale = 0.8;
    app.stage.addChild(ship);
    app.gameState.ship = ship;
}

export function makeShipMove(app) {

    var ship = app.gameState.ship;
    var home_station = app.gameState.station

    ship.home = home_station
    // Opt-in to interactivity
    home_station.eventMode = 'static';
    home_station.eventMode = 'static';

    // Shows hand cursor
    home_station.cursor = 'pointer';
   // app.gameState.planet.cursor = 'pointer';

    // Pointers normalize touch and mouse (good for mobile and desktop)
    //app.gameState.planet.on('pointerdown', onClick);
    home_station.on('pointerdown', onClick);

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
}



export function animateShip(app, time) {
    if (app.gameState.ship.action == 'moving') {
        travelingTarget(app, time);
    }
    else if (app.gameState.ship.action == 'mining') {
        miningShip(app, time);
    }
    else if (app.gameState.ship.action == 'docking') {
        dockingShip(app, time);
    }
}

export function dockingShip(app, time) {
    if (app.gameState.ship.x != app.gameState.ship.target.x || app.gameState.ship.y != app.gameState.ship.target.y) {
        travelingStation(app, time);
    }
    if (app.gameState.ship.storage < 1) {
        app.gameState.ship.action = 'inactif';
        app.gameState.ship.storage = 0;
    }
    else {
        app.gameState.ship.storage = app.gameState.ship.storage - 1;
        console.log('Unloading');
        app.gameState.ship.home.storage = app.gameState.ship.home.storage +  1;
    }


}

export function miningShip(app, time) {



// COOOOOK
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }


    if (app.gameState.ship.action_status == 'go_to') {
        if (app.gameState.ship.inGameX != app.gameState.ship.target.x || app.gameState.ship.inGameY != app.gameState.ship.target.y) {
            travelingTarget(app, time);
        }
        else {
            app.gameState.ship.action_status = 'actif';
        }
    }
    else if (app.gameState.ship.action_status == 'actif') {
        if (app.gameState.ship.storage + app.gameState.ship.minning_speed >= app.gameState.ship.storage_max) {
            app.gameState.ship.action_status = 'go_back';
        }
        else {
            app.gameState.ship.storage = app.gameState.ship.storage + app.gameState.ship.minning_speed;
            app.gameState.ship.target.storage = app.gameState.ship.target.storage - app.gameState.ship.minning_speed;

            if (app.gameState.ship.target.storage <= 0) {
                    app.gameState.ship.action_status = 'inactif';
                    var ore_pk = app.gameState.ship.target.pk
                    var removed = app.gameState.system_container.removeChild(app.gameState.ship.target);
                    app.gameState.ship.target = null;
                    var csrftoken = getCookie('csrftoken');
                    var del_url = `http://localhost:8000/ore/delete/${ore_pk}`;
                    var reponse = fetch(del_url, {
                      method: "DELETE",
                      headers: {
                           "X-CSRFToken": csrftoken,
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                    });
                    console.log(reponse);
                    console.log(ore_pk);
                    console.log(removed);

            }
        }
    }
    else if (app.gameState.ship.action_status == 'go_back') {
        if (app.gameState.ship.inGameX != app.gameState.ship.home.x || app.gameState.ship.inGameY != app.gameState.ship.home.y) {
            travelingStation(app, time);
        }
        else {
            app.gameState.ship.action_status = 'landing';
        }
    }
    else if (app.gameState.ship.action_status == 'landing') {
        if (app.gameState.ship.storage == 0) {
            app.gameState.ship.action_status = 'go_to';
            console.log('go_to');
        }

        var unload_qty = app.gameState.ship.storage;
        app.gameState.ship.storage = 0;
        // VIDE SOUTE DANS STATION
        var csrftoken = getCookie('csrftoken');
        var payload = JSON.stringify({
                'storage_max': unload_qty,
            });
        var rawResponse = fetch('http://localhost:8000/hangar/unload/1', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: payload,
          });

        console.log(rawResponse);



    }
    else if (app.gameState.ship.action_status == 'inactif') {

        var new_ore = null;
        for (var ore of app.gameState.ores) {
                app.gameState.ship.target = ore[1];
                app.gameState.ores.delete(ore[0])
                break;
        }
        if (app.gameState.ship.target) {
                app.gameState.ship.action_status = 'go_to';
        }

    }
    else {
        app.gameState.ship.action_status = 'inactif'
    }
}



export function travelingStation(app, time) {
    var dest = app.gameState.station;
    travelingShip(app, dest, time);
}

export function travelingTarget(app, time) {
    var dest = app.gameState.ship.target;
    travelingShip(app, dest, time);
}

export function travelingShip(app, dest, time) {
    var ship = app.gameState.ship;
    var system = app.gameState.container;

    var x1 = ship.inGameX;
    var x2 = dest.x;

    var y1 = ship.inGameY;
    var y2 = dest.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    var rotation = Math.atan2(dy, dx) + Math.PI / 2
    const len = Math.hypot(dx, dy);

    // vecteur direction normalisé
    const ux = dx / len;
    const uy = dy / len;

    // déplacement par étape
    const stepX = ux * ship.speed;
    const stepY = uy * ship.speed;

    // Déplacement avec gestion du signe
    if ((stepX > 0 && x1 + stepX <= x2) || (stepX < 0 && x1 + stepX >= x2)) {

        ship.rotation = rotation;
        ship.inGameX = ship.inGameX + stepX;


    }
    else {
        ship.inGameX = x2
    }



    

    if ((stepY > 0 && y1 + stepY <= y2) || (stepY < 0 && y1 + stepY >= y2)) {
        ship.inGameY = ship.inGameY + stepY;
    }
    else {
        ship.inGameY = y2
    }


}
