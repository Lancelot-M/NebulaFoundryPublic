const { Application, Assets } = PIXI;


// ===============================
//  Initialisation Pixi
// ===============================
const app = new Application();
await app.init({
    background: '0x000010',
    resizeTo: document.getElementById('scene-container')
});
document.getElementById('scene-container').appendChild(app.canvas);

// Centre de la scène (étoile)
const CENTER = { x: app.screen.width / 2, y: app.screen.height / 2 };

// ===============================
//  Utilitaire : création de cercle
// ===============================
function createCircle(radius, color) {
    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.drawCircle(0, 0, radius);
    g.endFill();
    return g;
}

// ===============================
//  Étoile
// ===============================
const star = createCircle(80, 0xFDB813);   // Soleil
star.x = CENTER.x;
star.y = CENTER.y;

// Ajout d’un léger halo
const glow = new PIXI.Graphics();
glow.beginFill(0xFDB813, 0.2);
glow.drawCircle(0, 0, 150);
glow.endFill();
star.addChild(glow);

app.stage.addChild(star);

// ===============================
//  Liste des planètes
// ===============================
const planets = [];

function addPlanet(options) {
    const {
        radius = 30,
        distance = 200,
        speed = 0.01,
        color = 0x3399ff,
        initialAngle = Math.random() * Math.PI * 2
    } = options;

    const planet = createCircle(radius, color);

    planet.orbit = {
        distance,
        angle: initialAngle,
        speed
    };

    planets.push(planet);
    app.stage.addChild(planet);
}

// ===============================
//  Ajout de plusieurs planètes
// ===============================
addPlanet({ radius: 20, distance: 200, speed: 0.01, color: 0x4F9EC4 }); // planète 1
addPlanet({ radius: 30, distance: 350, speed: 0.006, color: 0xC4934F }); // planète 2
addPlanet({ radius: 50, distance: 520, speed: 0.004, color: 0x904FC4 }); // planète géante

// ===============================
//  Astéroïdes (optionnel)
// ===============================
const asteroids = [];

function addAsteroidBelt(num = 80, radius = 420, spread = 40) {
    for (let i = 0; i < num; i++) {
        const a = createCircle(3 + Math.random() * 3, 0xAAAAAA);

        const angle = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() * spread - spread / 2);

        a.orbit = {
            distance: r,
            angle,
            speed: 0.0002
        };

        asteroids.push(a);
        app.stage.addChild(a);
    }
}

addAsteroidBelt();

// ===============================
//  Animation
// ===============================
app.ticker.add(() => {

    // Planètes
    planets.forEach(p => {
        p.orbit.angle += p.orbit.speed / 10;
        p.x = CENTER.x + Math.cos(p.orbit.angle) * p.orbit.distance;
        p.y = CENTER.y + Math.sin(p.orbit.angle) * p.orbit.distance;
    });

    // Astéroïdes
    asteroids.forEach(a => {
        a.orbit.angle += a.orbit.speed;
        a.x = CENTER.x + Math.cos(a.orbit.angle) * a.orbit.distance;
        a.y = CENTER.y + Math.sin(a.orbit.angle) * a.orbit.distance;
    });

});


let world = app.stage

// Paramètres de zoom
let zoom = 1;
const zoomStep = 0.1;       // vitesse de zoom
const minZoom = 0.3;
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

    // Coordonnées de la souris en position globale
    const mousePos = new PIXI.Point(
        event.clientX - app.view.getBoundingClientRect().left,
        event.clientY - app.view.getBoundingClientRect().top
    );

    // Position du monde avant zoom
    const worldPosBefore = world.toLocal(mousePos, undefined, undefined);

    // Application du zoom
    world.scale.set(zoom);

    // Position du monde après zoom
    const worldPosAfter = world.toLocal(mousePos, undefined, undefined);

    // Correction pour conserver la position du pointeur stable
    world.x += (worldPosAfter.x - worldPosBefore.x) * zoom;
    world.y += (worldPosAfter.y - worldPosBefore.y) * zoom;
});
