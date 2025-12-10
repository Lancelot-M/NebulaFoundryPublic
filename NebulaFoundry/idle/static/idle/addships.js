const { Sprite, Texture, Graphics } = PIXI;


export function addShip(app, sprites) {

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
    ship.storage_max = 10;
    ship.storage = shipData.storage;
    ship.scale = 0.8;
    app.stage.addChild(ship);
    sprites.ship = ship;
    return sprites;
}

export function makeShipMove(app, sprites) {

    let ship = sprites.ship;

    ship.home = sprites.station
    // Opt-in to interactivity
    sprites.station.eventMode = 'static';
    sprites.planet.eventMode = 'static';

    // Shows hand cursor
    sprites.station.cursor = 'pointer';
    sprites.planet.cursor = 'pointer';

    // Pointers normalize touch and mouse (good for mobile and desktop)
    sprites.planet.on('pointerdown', onClick);
    sprites.station.on('pointerdown', onClick);

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



export function animateShip(app, sprites, time) {
    if (sprites.ship.action == 'moving') {
        travelingShip(sprites, sprites.ship.target, time);
    }
    else if (sprites.ship.action == 'mining') {
        miningShip(app, sprites, time);
    }
    else if (sprites.ship.action == 'docking') {
        dockingShip(app, sprites, time);
    }
}

export function dockingShip(app, sprites, time) {
    if (sprites.ship.x != sprites.ship.target.x || sprites.ship.y != sprites.ship.target.y) {
        travelingShip(sprites, sprites.ship.target, time);
    }
    if (sprites.ship.storage < 1) {
        sprites.ship.action = 'inactif';
        sprites.ship.storage = 0;
    }
    else {
        sprites.ship.storage = sprites.ship.storage - 1;
        sprites.ship.home.storage = sprites.ship.home.storage +  1;
    }


}

export function miningShip(app, sprites, time) {
    if (sprites.ship.action_status == 'go_to') {
        if (sprites.ship.inGameX != sprites.ship.target.x || sprites.ship.inGameY != sprites.ship.target.y) {
            travelingShip(sprites, sprites.ship.target, time);
        }
        else {
            sprites.ship.action_status = 'actif';
        }
    }
    else if (sprites.ship.action_status == 'actif') {
        if (sprites.ship.storage + sprites.ship.minning_speed >= sprites.ship.storage_max) {
            sprites.ship.action_status = 'go_back';
        }
        else {
            sprites.ship.storage = sprites.ship.storage + sprites.ship.minning_speed;
        }
    }
    else if (sprites.ship.action_status == 'go_back') {
        if (sprites.ship.inGameX != sprites.ship.home.x || sprites.ship.inGameY != sprites.ship.home.y) {
            travelingShip(sprites, sprites.ship.home, time);
        }
        else {
            sprites.ship.action_status = 'landing';
        }
    }
    else if (sprites.ship.action_status == 'landing') {
        if (sprites.ship.storage == 0) {
            sprites.ship.action_status = 'go_to';



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
const csrftoken = getCookie('csrftoken');
const payload = JSON.stringify({
        'storage_max': sprites.ship.storage_max,
        'pipou': 'tout doux',
    });

(async () => {



    const rawResponse = await fetch('http://localhost:8000/hangar/unload/1', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: payload,
        credentials: "same-origin"
      });
    const content = await rawResponse.json();

    console.log(content);
})();

        }
        else {
            if (sprites.ship.storage - 1 < 0) {
                sprites.ship.storage = 0;
                }
            else {
                sprites.ship.storage = sprites.ship.storage - 1;
                sprites.ship.home.storage = sprites.ship.home.storage + 1;
            }
        }
    }




}


export function travelingShip(sprites, dest, time) {
    let ship = sprites.ship;
    let system = sprites.container;


    let x1 = ship.inGameX;
    let x2 = dest.x;

    let y1 = ship.inGameY;
    let y2 = dest.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    let rotation = Math.atan2(dy, dx) + Math.PI / 2
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
