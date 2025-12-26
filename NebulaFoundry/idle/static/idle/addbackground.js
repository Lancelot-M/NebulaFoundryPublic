const { TilingSprite, Texture } = PIXI;

export function addBackground(app) {

    const tilingSprite = new TilingSprite({
      texture: Texture.from('background_star'),
      width: 100000,
      height: 100000,
      anchor: 0.5,
      zIndex: 1,
    });

    app.stage.addChild(tilingSprite);
}
