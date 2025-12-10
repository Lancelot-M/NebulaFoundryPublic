# Create your views here.
from django.shortcuts import render
from django.http import Http404, HttpResponse
import json

from .models import Station


# ...
def hangar(request, station_id):
    try:
        station = Station.objects.get(pk=station_id)
    except Station.DoesNotExist:
        raise Http404("Station does not exist")
    return render(request, "idle/hangar.html", {"station": station})

def unload(request, station_id):
    try:
        station = Station.objects.get(pk=station_id)

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        station.storage += body.get('storage_max')
        station.save()

    except Station.DoesNotExist:
        raise Http404("Station does not exist")
    return HttpResponse("Chargement déposé")



def home(request):
    #ship = SpaceShip.objects.get(player=request.user)

    ship_data = {
        "id": 1,
        "name": 'KIKOU',
        "pos_x": 400,
        "pos_y": 1200,
        "speed": 10,
        "storage": 0,
        "storage_max": 0,
        "minning_speed": 1,
    }
    return render(request, "idle/home.html", {
        "ship_json": json.dumps(ship_data),
    })

def system(request):
    return render(request, "idle/system.html", {})

