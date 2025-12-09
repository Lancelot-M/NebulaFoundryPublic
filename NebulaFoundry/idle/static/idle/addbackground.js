const { TilingSprite, Texture } = PIXI;

export function addBackground(app) {

    const tilingSprite = new TilingSprite({
      texture: Texture.from('background_star'),
      width: 100000,
      height: 100000,
      anchor: 0.5,
    });

    app.stage.addChild(tilingSprite);
    //console.log(app.stage.getChildByName('TilingSprite'));
    //console.log(app.stage.getChildByName('TilingSprite').texture);
    //app.stage.getChildByName('TilingSprite').texture = null;
}
