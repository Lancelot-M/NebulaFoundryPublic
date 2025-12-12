from django.db import models
import random
from django.core import serializers




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
            storage=4000,
            system_id=self,
            pos_x=random.randrange(center_x + 200, center_x + 600),
            pos_y=random.randrange(center_y + 200, center_y + 600),
        )
        new_ore.save()

    def check_ore_n_create_missing(self):
        while Ore.ore_nb_in_system(self.pk) < 9:
            self.generate_ore()

    def get_data(self):
        return {
            'ore': serializers.serialize('json', Ore.objects.filter(system_id=self.pk)),
            'stations': serializers.serialize('json', Station.objects.filter(system_id=self.pk)),
        }


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
    system_id = models.ForeignKey(System, on_delete=models.CASCADE, default=1)



class Ore(models.Model):
    name = models.CharField('Nom')
    storage = models.IntegerField(default=0)
    system_id = models.ForeignKey(System, on_delete=models.CASCADE, default=1)
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)

    @staticmethod
    def ore_nb_in_system(system_id):
        """REtourn le nombre d'ore dans le system"""
        try:
            Ore_number = len(Ore.objects.filter(system_id=system_id))
        except Ore.DoesNotExist:
            Ore_number = 0
        return Ore_number


