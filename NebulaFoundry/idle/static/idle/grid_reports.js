function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

//Appel des rapports systems
export async function get_system_report(app) {
    // Tous les 60FPS * x secondes on fait un appel pour recuperer le dernier report
    if (app.reporting_management.delta  == 60 * 15) {
        console.log('Appel report', 'dela: ', app.reporting_management.delta, 'tic_number: ', app.reporting_management.tic_number)
        var reponse = await fetch('http://localhost:8000/system_report/1', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        });
        app.reporting_management.report = await reponse.json();
        app.reporting_management.delta = 0;
        console.log('Appel report', 'dela: ', app.reporting_management.delta, 'tic_number: ', app.reporting_management.tic_number)


        for (var [key, value] of Object.entries(app.reporting_management.report.rst_ships)) {
            for (var [subkey, subvalue] of Object.entries(value)) {
                console.log(subkey, subvalue);
            }
        }
    }
}


export function animate_with_report(app) {
    if (isEmpty(app.reporting_management.report) == false) {
        var player_rst = app.reporting_management.report.rst_ships[app.game_items.player.django.id];
        if (app.reporting_management.tic_number in player_rst) {
            player_rst = player_rst[app.reporting_management.tic_number];
            app.game_items.player.pixi.x = player_rst.pos_x;
            app.game_items.player.pixi.y = player_rst.pos_y;
        }
    }



}
