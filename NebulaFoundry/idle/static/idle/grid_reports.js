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

export async function app_reporting_manager(app) {
    if (isEmpty(app.reporting_management.actual_report)) {
        app.reporting_management.synchronisation_pending = true;
        var system_reports = await get_system_report();
        var date_start = new Date(system_reports.actual_report.time_start);
        var date_stop = new Date(system_reports.actual_report.time_stop);
        app.reporting_management.tic_duration = (date_stop - date_start) / 1000;
        app.reporting_management.actual_report = system_reports.actual_report;
        console.log(app.reporting_management.actual_report);
        //console.log(app.reporting_management.tic_duration);
        app.reporting_management.next_report = system_reports.next_report;
        app.reporting_management.synchronisation_pending = false;
    }

    else if (isEmpty(app.reporting_management.next_report)) {
        app.reporting_management.synchronisation_pending = true;
        //console.log('start synch');
        var system_reports = await get_system_report();
        console.log(system_reports, system_reports.actual_report);
        app.reporting_management.next_report = system_reports.next_report;
        //console.log('app.reporting_management.synchronisation_pending = true;');
        app.reporting_management.synchronisation_pending = false;
    }
}


export function control_reports(app, timestampSec) {
    var report_stop_date = new Date(app.reporting_management.actual_report.time_stop);
    var stop_timestampSec = Math.floor(report_stop_date / 1000);
    //console.log(Math.floor(time_now / 1000), report_date);
    //console.log(Math.floor(time_now / 1000) == report_date);
    if (stop_timestampSec < timestampSec) {
        app.reporting_management.actual_report = app.reporting_management.next_report;
        app.reporting_management.next_report = {};
    }
}


export function read_report_tic(app, timestampSec) {
    var report_stop_date = new Date(app.reporting_management.actual_report.time_stop);
    var stop_timestampSec = Math.floor(report_stop_date / 1000);
    //console.log(Math.floor(time_now / 1000), report_date);
    //console.log(Math.floor(time_now / 1000) == report_date);
    if (stop_timestampSec < timestampSec) {
        app.reporting_management.actual_report = app.reporting_management.next_report;
        app.reporting_management.next_report = {};
    }
}


// Gestion du tic
export function animate_with_report(app) {
    var time_now = new Date();
    var timestampSec = Math.floor(time_now / 1000);
    if (app.reporting_management.tic_number != timestampSec) {
        //console.log(tic_number, new Date());
        control_reports(app, timestampSec);
        read_report_tic(app, timestampSec);



        app.reporting_management.tic_number = timestampSec;
    }
}


//export function animate_with_report(app) {
//    if (isEmpty(app.reporting_management.report) == false) {
//        var player_rst = app.reporting_management.report.rst_ships[app.game_items.player.django.id];
//        if (app.reporting_management.tic_number in player_rst) {
//            player_rst = player_rst[app.reporting_management.tic_number];
//            app.game_items.player.pixi.x = player_rst.pos_x;
//            app.game_items.player.pixi.y = player_rst.pos_y;
//        }
//    }
//
//
//
//}
