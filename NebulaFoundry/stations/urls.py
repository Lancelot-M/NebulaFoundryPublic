from django.urls import path

from . import views

urlpatterns = [
    path("hangar/<int:station_id>", views.hangar, name="hangar"),
]