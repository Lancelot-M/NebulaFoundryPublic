const { Application, Assets } = PIXI;
import { addBackground } from './addbackground.js';
import { addSystemElement } from './addplanets.js';
import { addShip, makeShipMove, animateShip } from './addships.js';
import { displayMenus, showActionMenu } from './menuaction.js';


// Create a PixiJS application.
const app = new Application();
app.gameState = new Map ();
app.gameState.selected = null;
app.gameState.ship = null;
app.gameState.system_container = null;
app.gameState.ores = new Map();
app.gameState.station = null;


// Store an array of fish sprites for animation.
async function setup() {
  const game_window = document.getElementById('scene-container');
  await app.init({ background: '#1099bb', resizeTo: game_window });
  game_window.appendChild(app.canvas);
}
async function preload() {
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


// Asynchronous IIFE
(async () => {
    // On charge l'app avant d'ajouter les elements
  await setup();
  await preload();

  // On ajouter tous les elements de l'app en emem temps
  addBackground(app);
   addSystemElement(app);
   addShip(app);
   showActionMenu(app);
  makeShipMove(app);


  // Add the animation callback to the application's ticker.
  app.ticker.add(
    (delta) => {
        app.gameState.system_container.x = -app.gameState.ship.inGameX + app.gameState.ship.x;
        app.gameState.system_container.y = -app.gameState.ship.inGameY + app.gameState.ship.y;
        animateShip(app, delta);
        displayMenus(app);
    });

    let world = app.stage
    let ship = app.gameState.ship

    // Paramètres de zoom
    let zoom = 1;
    const zoomStep = 0.1;       // vitesse de zoom
    const minZoom = 0.1;
    const maxZoom = 3;

// Empêche le scroll de la page quand on utilise la molette sur le canvas
app.view.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
// Zoom avec centrage sur la souris
app.view.addEventListener("wheel", (event) => {
    const oldZoom = zoom;
    // Direction de la molette
    if (event.deltaY < 0) zoom += zoomStep;     // zoom in
    else zoom -= zoomStep;                     // zoom out

    // Contraintes
    zoom = Math.min(maxZoom, Math.max(minZoom, zoom));


    // Ne rien faire si le zoom n’a pas changé
    if (zoom === oldZoom) return;

    const shipScreenBefore = ship.getGlobalPosition();

    // Appliquer le zoom
     world.scale.set(zoom);

    // Position écran du ship APRÈS zoom
    const shipScreenAfter = ship.getGlobalPosition();

    // Décalage induit par le zoom
    const dx = shipScreenAfter.x - shipScreenBefore.x;
    const dy = shipScreenAfter.y - shipScreenBefore.y;

    // On corrige la caméra pour ramener le ship au même pixel
    world.x -= dx;
    world.y -= dy;

});

})();