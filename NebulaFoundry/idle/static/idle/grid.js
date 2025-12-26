const { Application, Assets, Container } = PIXI;
import { addBackground } from './addbackground.js';
import { get_ships_methods } from './grid_ships.js';
import { get_stations } from './grid_stations.js';


var app = new Application();

// Initialisation de la scene
async function init_scene() {
    await app.init({ background: '#1099bb', resizeTo: document.getElementById('scene-container')});
    document.getElementById('scene-container').appendChild(app.canvas);
    app.stage.sortableChildren = true;
    app.game_items = {};
    app.game_items.grid = new Container();
    app.game_items.grid.zIndex = 100;
    app.game_items.grid.sortableChildren = true;
    app.stage.addChild(app.game_items.grid);
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
async function load_zoom(app) {
    var zoom = 1;
    var zoomStep = 0.1;
    var minZoom = 0.1;
    var maxZoom = 3;
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
        var shipScreenBefore = app.game_items.player.getGlobalPosition();
        // Appliquer le zoom
        app.stage.scale.set(zoom);
        // Position écran du ship APRÈS zoom
        var shipScreenAfter = app.game_items.player.getGlobalPosition();
        // Décalage induit par le zoom
        var dx = shipScreenAfter.x - shipScreenBefore.x;
        var dy = shipScreenAfter.y - shipScreenBefore.y;
        // On corrige la caméra pour ramener le ship au même pixel
        app.stage.x -= dx;
        app.stage.y -= dy;
    });
}
// Centrage du grid sur le joueur
async function center_grid(app) {
    app.game_items.grid.x = -app.game_items.player.x + app.screen.width / 2;
    app.game_items.grid.y = -app.game_items.player.y + app.screen.height / 2;
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

    get_stations(app);
    get_ships_methods(app);


    // load_zoom(app);
    // Add the animation callback to the application's ticker.
    app.ticker.add(
    (delta) => {
        center_grid(app);
    });






})();
// --------------------------------------------