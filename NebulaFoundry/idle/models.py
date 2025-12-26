from django.db import models
import random
from django.core import serializers
import logging
import json

logger = logging.getLogger(__name__)




class System(models.Model):
    name = models.CharField('Nom')
    width = models.IntegerField('Largeur du system')
    height = models.IntegerField('Hauteur du system')


    def generate_ore(self):
        """
        Ajouter un astéroide dans le système.
        Chaque Systeme a un nb défini d'ore qui repop tout les 15 min ?
        """
        # TODO: Ajouter des logiques en fonction des systemes ( minier / indus / battle fields ... )
        # TODO: Faire pop les asteroides par grappes et par point d'interet
        center_x = self.width // 2
        center_y = self.height // 2
        new_ore = Ore.objects.create(
            name="ORE",
            storage=10,
            system_id=self,
            pos_x=random.randrange(center_x + 500, center_x + 10000),
            pos_y=random.randrange(center_y + 500, center_y + 10000),
        )
        new_ore.save()

    def check_ore_n_create_missing(self):
        while Ore.ore_nb_in_system(self.pk) < 9:
            self.generate_ore()
        self.delete_empty_ore()

    def delete_empty_ore(self):
        try:
            empty_ores = Ore.objects.filter(system_id=self.pk, storage=0)
            logger.warning(f"{len(empty_ores)} ores supprimés dans le système {self.name}")
            empty_ores.delete()
        except Ore.DoesNotExist:
            logger.warning("Aucun ore supprimé dans le system")

    def get_data(self):
        ship = Ship.objects.get(pk=5)
        return {
            'ore': serializers.serialize('json', Ore.objects.filter(system_id=self.pk)),
            'stations': serializers.serialize('json', Station.objects.filter(system_id=self.pk)),
            'ship': json.dumps({
                'speed': 5,
                'minning_speed': ship.minning_speed,
                'pos_x': ship.pos_x,
                'pos_y': ship.pos_y,
                'action': ship.action_order,
                'action_status': ship.action_now,
                'storage_max': ship.storage_max,
                'storage': ship.storage_now,
            }),
        }


# Create your models here.
class Ship(models.Model):
    storage_max = models.IntegerField(default=0)
    storage_now = models.IntegerField(default=0)
    minning_speed = models.IntegerField(default=0)
    speed = models.IntegerField(default=0)
    action_order = models.CharField('Ordre donné', default="")
    action_now = models.CharField('Action en cours', default="")
    home_station = models.CharField('Home', default="")
    system_target = models.CharField('Cible', default="")
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)



class Station(models.Model):
    name = models.CharField('Nom')
    storage = models.IntegerField(default=0)
    system_location = models.CharField('Cible')
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)
    system_id = models.ForeignKey(System, on_delete=models.CASCADE, default=1)



class Ore(models.Model):
    name = models.CharField('Nom')
    storage = models.IntegerField(default=0)
    system_id = models.ForeignKey(System, on_delete=models.CASCADE, default=1)
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)

    @staticmethod
    def ore_nb_in_system(system_id):
        """Retourn le nombre d'ore dans le system"""
        try:
            ores = Ore.objects.filter(system_id=system_id)
            Ore_number = len(ores)
        except Ore.DoesNotExist:
            Ore_number = 0
        return Ore_number



