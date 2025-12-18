

export function displayMenus(app) {
    showShipMenu(app);
    showSelectedItemMenu(app);
}

export function showActionMenu(app) {

    document.getElementById("moving").onclick = () => {
        app.gameState.ship.action = 'moving';
        app.gameState.ship.target = app.gameState.selected;
    };

    document.getElementById("mining").onclick = () => {
        app.gameState.ship.action = 'mining';
        app.gameState.ship.action_status = 'go_to';
        app.gameState.ship.target = app.gameState.selected;
    };

    document.getElementById("docking").onclick = () => {
        app.gameState.ship.action = 'docking';
        app.gameState.ship.target = app.gameState.selected;
    };

}

export function showShipMenu(app) {
    document.getElementById("ship_state").innerHTML =  'Etat: ' + app.gameState.ship.action;
    document.getElementById("ship_action_status").innerHTML =  'Sous Etat: ' + app.gameState.ship.action_status;
    var ship_home = '';
    if (app.gameState.ship.home == null) {
        ship_home = 'Home: Non définie';
    }
    else {
        ship_home = 'Home: ' + app.gameState.ship.home.name;
    }
    document.getElementById("ship_home").innerHTML = ship_home;
    document.getElementById("storage_ship").innerHTML = 'Storage: ' + app.gameState.ship.storage + '/' + app.gameState.ship.storage_max;

}

export function showSelectedItemMenu(app) {
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

