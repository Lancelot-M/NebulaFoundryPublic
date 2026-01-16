# Create your views here.
from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
import json

from .models import System, Ore, Ship, ReportSystem



def delete_ore(request, ore_id):
    try:
        ore = Ore.objects.get(pk=ore_id)

        ore.delete()

    except Ore.DoesNotExist:
        raise Http404("Ore does not exist")
    except Exception as e:
        raise e
    return HttpResponse("Ore deleted")

def home(request):
    #ship = SpaceShip.objects.get(player=request.user)
    system = System.objects.get(pk=1)
    system.check_ore_n_create_missing()
    data = system.get_data()


    return render(request, "idle/home.html", data)

def system(request):
    return render(request, "idle/system.html", {})

def system_station(request, system_id):
    system = System.objects.get(pk=system_id)
    data = system.station_data()
    return JsonResponse(data)

def system_ores(request, system_id):
    system = System.objects.get(pk=system_id)
    data = system.ores_data()
    return JsonResponse(data)

def my_ship(request):
    # ship = SpaceShip.objects.get(player=request.user)
    ship = Ship.objects.get(pk=5)
    return JsonResponse(ship.player_data())

def system_report(request, system_fk):
    system = System.objects.get(pk=system_fk)
    report_system = system.get_report_system()
    #report_system = ReportSystem.create_report(system_fk)
    return JsonResponse(report_system)

def get_system_next_report(request, system_fk):
    system = System.objects.get(pk=system_fk)
    report_system = system.get_system_next_report()
    return JsonResponse(report_system)

