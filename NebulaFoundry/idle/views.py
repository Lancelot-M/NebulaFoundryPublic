# Create your views here.
from django.shortcuts import render
from django.http import Http404
import json

from .models import Station


# ...
def hangar(request, station_id):
    try:
        station = Station.objects.get(pk=station_id)
    except Station.DoesNotExist:
        raise Http404("Station does not exist")
    return render(request, "idle/hangar.html", {"station": station})


def home(request):
    #ship = SpaceShip.objects.get(player=request.user)

    ship_data = {
        "id": 1,
        "name": 'KIKOU',
        "pos_x": 400,
        "pos_y": 1200,
        "speed": 10,
        "storage": 0,
        "minning_speed": 1,
    }
    return render(request, "idle/home.html", {
        "ship_json": json.dumps(ship_data),
    })

def system(request):
    return render(request, "idle/system.html", {})

