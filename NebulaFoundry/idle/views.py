# Create your views here.
from django.shortcuts import render
from django.http import Http404, HttpResponse
import json

from .models import Station, System


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
    system = System.objects.get(pk=1)
    system.check_ore_n_create_missing()
    data = system.get_data()
    data.update({
        "ship_json": json.dumps({
            "id": 1,
            "name": 'KIKOU',
            "pos_x": system.width // 2,
            "pos_y": system.height // 2,
            "speed": 10,
            "storage": 0,
            "storage_max": 0,
            "minning_speed": 1,
        }),
    })

    return render(request, "idle/home.html", data)

def system(request):
    return render(request, "idle/system.html", {})

