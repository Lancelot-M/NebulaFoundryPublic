from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.home, name="home"),
    path("hangar/<int:station_id>", views.hangar, name="hangar"),
    path("system/", views.system, name="system"),
    path("hangar/unload/<int:station_id>", views.unload, name="unload"),
    path("ore/delete/<int:ore_id>", views.delete_ore, name="delete ore"),
    path("system_station/<int:system_id>", views.system_station, name="get stations"),
    path("system_ores/<int:system_id>", views.system_ores, name="get ores"),
    path("my_ship/", views.my_ship, name="player data"),
]