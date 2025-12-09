

export function displayMenus(app, sprites) {
    showShipMenu(app, sprites);
    showSelectedItemMenu(app, sprites);
}

export function showActionMenu(app, sprites) {

    document.getElementById("moving").onclick = () => {
        sprites.ship.action = 'moving';
        sprites.ship.target = app.gameState.selected;
    };

    document.getElementById("mining").onclick = () => {
        sprites.ship.action = 'mining';
        sprites.ship.action_status = 'go_to';
        sprites.ship.target = app.gameState.selected;
    };

    document.getElementById("docking").onclick = () => {
        sprites.ship.action = 'docking';
        sprites.ship.target = app.gameState.selected;
    };

}

export function showShipMenu(app, sprites) {
    document.getElementById("ship_state").innerHTML =  'Etat: ' + sprites.ship.action;
    document.getElementById("ship_action_status").innerHTML =  'Sous Etat: ' + sprites.ship.action_status;
    var ship_home = '';
    if (sprites.ship.home == null) {
        ship_home = 'Home: Non définie';
    }
    else {
        ship_home = 'Home: ' + sprites.ship.home.name;
    }
    document.getElementById("ship_home").innerHTML = ship_home;
    document.getElementById("storage_ship").innerHTML = 'Storage: ' + sprites.ship.storage + '/' + sprites.ship.storage_max;

}

export function showSelectedItemMenu(app, sprites) {
    //Vide la balise
    document.getElementById('selection-info').innerHTML = '';

    if (app.gameState.selected) {
        var para = document.createElement("p");
        para.innerHTML = app.gameState.selected.name;
        document.getElementById('selection-info').appendChild(para);
        para = document.createElement("p");
        para.innerHTML = app.gameState.selected.storage;
        document.getElementById('selection-info').appendChild(para);
    };
}

