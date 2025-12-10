const { Application, Assets } = PIXI;
import { addBackground } from './addbackground.js';
import { addSystemElement } from './addplanets.js';
import { addShip, makeShipMove, animateShip } from './addships.js';
import { displayMenus, showActionMenu } from './menuaction.js';


// Create a PixiJS application.
const app = new Application();
let sprites = {};
app.gameState = {
    selected: null,
    ship: null
};

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
  await setup();
  await preload();

  addBackground(app);
  sprites = addSystemElement(app, sprites);
  sprites = addShip(app, sprites);

  showActionMenu(app, sprites);
  makeShipMove(app, sprites);



  // Add the fish animation callback to the application's ticker.
  app.ticker.add(
    (delta) => {
        sprites.container.x = -sprites.ship.inGameX + sprites.ship.x;
        sprites.container.y = -sprites.ship.inGameY + sprites.ship.y;
        animateShip(app, sprites, delta);
        displayMenus(app, sprites);
    });

    let world = app.stage
    let ship = sprites.ship

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