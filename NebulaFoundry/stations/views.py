# Create your views here.
from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
import json

from idle.models import Station


# ...
def hangar(request, station_id):
    try:
        station = Station.objects.get(pk=station_id)
    except Station.DoesNotExist:
        raise Http404("Station does not exist")
    return render(request, "stations/space_station_ui.html", {"station": station})
