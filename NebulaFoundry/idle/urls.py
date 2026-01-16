from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.home, name="home"),
    path("system/", views.system, name="system"),
    path("ore/delete/<int:ore_id>", views.delete_ore, name="delete ore"),
    path("system_station/<int:system_id>", views.system_station, name="get stations"),
    path("system_ores/<int:system_id>", views.system_ores, name="get ores"),
    path("my_ship/", views.my_ship, name="player data"),
    path("system_report/<int:system_fk>", views.system_report, name="get report"),
    path("system_next_report/<int:system_fk>", views.get_system_next_report, name="get next report"),
]