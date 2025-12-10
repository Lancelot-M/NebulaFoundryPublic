from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.home, name="home"),
    path("hangar/<int:station_id>", views.hangar, name="hangar"),
    path("system/", views.system, name="system"),
    path("hangar/unload/<int:station_id>", views.unload, name="unload"),
]