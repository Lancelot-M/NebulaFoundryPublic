export function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

//Appel des rapports systems
export async function get_system_report() {
    try {
        var response = await fetch('http://localhost:8000/system_report/1', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        });
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        var reporting_management = await response.json();
//        async function log_response(reporting_management) {
//            var serverTime = new Date(reporting_management.serv_now);
//            var localTime = new Date();
//            var drift = localTime - serverTime;
//            console.log(localTime.getUTCHours(), localTime.getUTCMinutes(), localTime.getUTCSeconds());
//            console.log(`Décalage: ${drift}ms`);
//        }
        //await log_response(reporting_management);
        return reporting_management
    }
    catch (error) {
        console.error('Erreur lors du fetch:', error);
    }
}

//Appel des rapports systems
export async function get_system_next_report() {
    try {
        var response = await fetch('http://localhost:8000/system_next_report/1', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        });
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        var reporting_management = await response.json();
//        async function log_response(reporting_management) {
//            var serverTime = new Date(reporting_management.serv_now);
//            var localTime = new Date();
//            var drift = localTime - serverTime;
//            console.log(localTime.getUTCHours(), localTime.getUTCMinutes(), localTime.getUTCSeconds());
//            console.log(`Décalage: ${drift}ms`);
//        }
        //await log_response(reporting_management);
        return reporting_management
    }
    catch (error) {
        console.error('Erreur lors du fetch:', error);
    }
}

export async function app_reporting_manager(app, delta) {
    if (isEmpty(app.reporting_management.actual_report)) {
        console.log('isEmpty >> actual_report', );
        app.reporting_management.synchronisation_pending = true;
        var system_reports = await get_system_report();
        var date_start = new Date(system_reports.time_start);
        var date_stop = new Date(system_reports.time_stop);
        app.reporting_management.tic_duration = (date_stop - date_start) / 1000;
        app.reporting_management.actual_report = system_reports;
        //console.log(app.reporting_management.actual_report);

        //app.reporting_management.next_report = system_reports.next_report;
        app.reporting_management.synchronisation_pending = false;
        //console.log('FETCH');
    }

    else if (isEmpty(app.reporting_management.next_report)) {
        app.reporting_management.synchronisation_pending = true;
        app.reporting_management.next_report = await get_system_next_report();
        app.reporting_management.synchronisation_pending = false;
        //console.log('FETCH');
    }
}


export function control_reports(app, time_now) {
    var report_stop_date = new Date(app.reporting_management.actual_report.time_stop);
    //var stop_timestampSec = Math.floor(report_stop_date / 1000);
    //console.log(Math.floor(time_now / 1000), report_date);
    //console.log(Math.floor(time_now / 1000) == report_date);

    if (report_stop_date < time_now) {
        app.reporting_management.actual_report = app.reporting_management.next_report;
        app.reporting_management.next_report = {};
    }
}

export function load_player_rst_data(app) {
    const playerId = app.game_items.player?.django?.id;
    if (!playerId) return;

    const currentTic = app.reporting_management.tic_number;
    const nextTic = currentTic + 1;

    // Données du tic actuel
    const currentRst = app.reporting_management.actual_report?.rst_ships?.[playerId]?.[currentTic];
    if (currentRst) {
        app.reporting_management.player_rst_on_tic = currentRst;
    }

    // Données du tic suivant (pour interpolation)
    let nextRst = app.reporting_management.actual_report?.rst_ships?.[playerId]?.[nextTic];

    // Si pas dans actual_report, chercher dans next_report
    if (!nextRst) {
        nextRst = app.reporting_management.next_report?.rst_ships?.[playerId]?.[nextTic];
    }

    if (nextRst) {
        app.reporting_management.player_rst_next_tic = nextRst;
   }
   }

export function load_rst_player(app) {
    const playerId = app.game_items.player?.django?.id;
    if (!playerId) return;

    const playerRst = app.reporting_management.actual_report?.rst_ships?.[playerId];
    if (!playerRst) return;

    // Tic actuel
    if (app.reporting_management.tic_number in playerRst) {
        app.reporting_management.player_rst_on_tic = playerRst[app.reporting_management.tic_number];
    }

    // Tic suivant
    const nextTic = app.reporting_management.tic_number + 1;

    if (nextTic in playerRst) {
        app.reporting_management.player_rst_next_tic = playerRst[nextTic];
    }
    else {
        // Chercher dans next_report
        const nextRst = app.reporting_management.next_report?.rst_ships?.[playerId]?.[nextTic];
        if (nextRst) {
            app.reporting_management.player_rst_next_tic = nextRst;
        }
    }



//    var player_rst = app.reporting_management.actual_report.rst_ships[app.game_items.player.django.id];
//    if (app.reporting_management.tic_number in player_rst) {
//        app.reporting_management.player_rst_on_tic = player_rst[app.reporting_management.tic_number];
//    }
//    if (app.reporting_management.tic_number + 1 in player_rst) {
//        app.reporting_management.player_rst_next_tic = player_rst[app.reporting_management.tic_number + 1];
//    }
//    else if (app.reporting_management.next_report && app.reporting_management.next_report.rst_ships &&
//        app.reporting_management.tic_number + 1 in app.reporting_management.next_report.rst_ships[app.game_items.player.django.id]) {
//        app.reporting_management.player_rst_next_tic = app.reporting_management.next_report.rst_ships[app.game_items.player.django.id][app.reporting_management.tic_number + 1];
//    }
    //console.log(app.reporting_management.player_rst_on_tic, app.reporting_management.player_rst_next_tic);
}

export function control_tics(app, timestampSec, time_now) {
    if (app.reporting_management.tic_number !== timestampSec) {
        console.log(`Nouveau tic: ${timestampSec}`);

        // Nouveau tic détecté
        app.reporting_management.tic_number = timestampSec;
        app.reporting_management.tic_start_time = time_now.getTime();

        // Charger les données du nouveau tic
        load_player_rst_data(app);


//    if (app.reporting_management.tic_number != timestampSec) {
//        app.reporting_management.delta_tic = 0;
//        app.reporting_management.tic_number = timestampSec;
//        load_rst_player(app);
//    }
//    else {
//        app.reporting_management.delta_tic += 1;
//    }
}
}

export function read_report_rst_player(app, delta) {
    const currentRst = app.reporting_management.player_rst_on_tic;
    const nextRst = app.reporting_management.player_rst_next_tic;

    if (!currentRst || !nextRst) {
        // Pas assez de données pour interpoler
        if (currentRst) {
            app.game_items.player.pixi.x = currentRst.pos_x;
            app.game_items.player.pixi.y = currentRst.pos_y;
        }
        return;
    }

    // Calculer le temps écoulé depuis le début du tic (en ms)
    const now = Date.now();
    const tickStartTime = app.reporting_management.tic_start_time || now;
    const elapsedMs = now - tickStartTime;

    // Progression entre 0 et 1 (0 = début du tic, 1 = fin du tic)
    const progress = Math.min(elapsedMs / 1000, 1); // 1000ms = 1 seconde

    // Interpolation linéaire (lerp)
    app.game_items.player.pixi.x = lerp(currentRst.pos_x, nextRst.pos_x, progress);
    app.game_items.player.pixi.y = lerp(currentRst.pos_y, nextRst.pos_y, progress);
}

// Fonction d'interpolation linéaire
export function lerp(start, end, progress) {
    return start + (end - start) * progress;
}




//
//    if (app.reporting_management.delta_tic == 0) {
//        var player = app.reporting_management.player_rst_on_tic;
//
//        console.log('pixi', Math.floor(app.game_items.player.pixi.x), 'report', player.pos_x, 'next report', app.reporting_management.player_rst_next_tic.pos_x);
//
//        app.game_items.player.pixi.x = player.pos_x;
//        app.game_items.player.pixi.y = player.pos_y;
//    }
//    else {
//        var player = app.reporting_management.player_rst_next_tic;
//
//        app.game_items.player.pixi.x += (player.pos_x - app.game_items.player.pixi.x) / 55;
//        app.game_items.player.pixi.y += (player.pos_y - app.game_items.player.pixi.y) / 55;
//    }


export function animate_with_report(app, delta) {
    var time_now = new Date();
    var timestampSec = Math.floor(time_now / 1000);

    control_reports(app, time_now);
    control_tics(app, timestampSec, time_now);
    read_report_rst_player(app);
}
