const { Application, Assets, Container } = PIXI;
import { addBackground } from './addbackground.js';
import { get_ships_methods } from './grid_ships.js';
import { get_stations } from './grid_stations.js';
import { get_ores } from './grid_ores.js';
import { isEmpty, animate_with_report, app_reporting_manager } from './grid_reports.js';


var app = new Application();

// Initialisation de la scene
async function init_scene() {
    await app.init({ background: '#1099bb', resizeTo: document.getElementById('scene-container')});
    document.getElementById('scene-container').appendChild(app.canvas);
    app.stage.sortableChildren = true;
    // PIXI PART
    app.game_items = {};
    app.game_items.grid = new Container();
    app.game_items.grid.zIndex = 100;
    app.game_items.grid.sortableChildren = true;
    app.stage.addChild(app.game_items.grid);

    // SYNCH PART
    app.reporting_management = {}
    app.reporting_management.actual_report = {};
    app.reporting_management.next_report = {};
    app.reporting_management.synchronisation_pending = false;
    app.reporting_management.tic_duration = 2;
    app.reporting_management.tic_number = 0;
}
// Chargement des assets
async function load_assets() {
  const assets = [
    {alias: 'background_star', src: image_asset },
    {alias: 'background_aste', src: background_aste },
    {alias: 'star1', src: image_asset_star1 },
    {alias: 'ore_s', src: image_asset_ore_s },
    {alias: 'star3', src: image_asset_star3 },
    {alias: 'ship', src: image_asset_ship },
    {alias: 'station', src: image_asset_station },
   ];
  await Assets.load(assets);
}
// Ajout d'un zoom
function load_zoom(app) {
    var zoom = 1;
    var zoomStep = 0.1;
    var minZoom = 0.1;
    var maxZoom = 3;
    var player = app.game_items.player.pixi;
    // Empêche le scroll de la page quand on utilise la molette sur le canvas
    app.view.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    // Zoom avec centrage sur la souris
    app.view.addEventListener("wheel", (event) => {
        var oldZoom = zoom;
        // Direction de la molette
        if (event.deltaY < 0) zoom += zoomStep;     // zoom in
        else zoom -= zoomStep;                     // zoom out
        // Contraintes
        zoom = Math.min(maxZoom, Math.max(minZoom, zoom));
        // Ne rien faire si le zoom n’a pas changé
        if (zoom === oldZoom) return;
        var shipScreenBefore = player.getGlobalPosition();
        // Appliquer le zoom
        app.stage.scale.set(zoom);
        // Position écran du ship APRÈS zoom
        var shipScreenAfter = player.getGlobalPosition();
        console.log(shipScreenAfter);
        // Décalage induit par le zoom
        var dx = shipScreenAfter.x - shipScreenBefore.x;
        var dy = shipScreenAfter.y - shipScreenBefore.y;
        // On corrige la caméra pour ramener le ship au même pixel
        app.stage.x -= dx;
        app.stage.y -= dy;
    });
}
// Centrage du grid sur le joueur
function center_grid(app) {
    app.game_items.grid.x = -app.game_items.player.pixi.x + app.screen.width / 2;
    app.game_items.grid.y = -app.game_items.player.pixi.y + app.screen.height / 2;
}


// --------------------------------------------
// Affichage de l'interface en Asynchronous IIFE
// --------------------------------------------
(async () => {
    // On charge l'app avant d'ajouter les elements
    await init_scene();
    await load_assets();
    // On ajouter tous les elements de l'app en emem temps
    await addBackground(app);
    await get_ships_methods(app);
    await get_stations(app);
    await get_ores(app);
    load_zoom(app);

    // Add the animation callback to the application's ticker.
    app.reporting_delta = 0
    app.ticker.add(
        (delta) => {
            // Incrémentation du ticker
            // manage_tics(app);
            center_grid(app);
            if (app.reporting_management.synchronisation_pending == false) {
                //console.log("synchronisation_pending : pas encore set")
                app_reporting_manager(app);
            }
            else {
                //console.log("synchronisation_pending : escape app_reporting_manager")
            }
            if (isEmpty(app.reporting_management.actual_report) == false) {
                animate_with_report(app);
            }
            else {
                //console.log("Rapport vide !");
            }
        }
    );
})();
// --------------------------------------------