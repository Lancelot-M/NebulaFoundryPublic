from django.db import models

# Create your models here.
class Ship(models.Model):
    storage_max = models.IntegerField(default=0)
    storage_now = models.IntegerField(default=0)
    speed = models.IntegerField(default=0)
    action_order = models.CharField('Ordre donné')
    action_now = models.CharField('Action en cours')
    home_station = models.CharField('Home')
    system_target = models.CharField('Cible')
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)



class Station(models.Model):
    name = models.CharField('Nom')
    storage = models.IntegerField(default=0)
    system_location = models.CharField('Cible')
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)
