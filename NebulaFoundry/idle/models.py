from django.db import models
import random
from django.core import serializers
import logging
import json
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import math

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

    def station_data(self):
        """ Pour le moment on ne prend qu une station plus tard all"""
        stations = Station.objects.filter(system_id=self.pk)
        for station in stations:
            return {
                'id': station.pk,
                'pos_x': station.pos_x,
                'pos_y': station.pos_y,
            }

    def ores_data(self):
        """ Pour le moment on ne prend qu une station plus tard all"""
        ores = Ore.objects.filter(system_id=self.pk)
        ores_data = {}
        for ore in ores:
            ores_data.update({
                str(ore.pk): {
                    'id': ore.pk,
                    'pos_x': ore.pos_x,
                    'pos_y': ore.pos_y,
                },
            })
        return ores_data


class Station(models.Model):
    name = models.CharField('Nom')
    storage = models.IntegerField(default=0)
    system_location = models.CharField('Cible')
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)
    system_id = models.ForeignKey(System, on_delete=models.CASCADE, default=1)


class Ship(models.Model):
    """
       Un ship suit un ordre donnée par le joueur ( miner, explorer, combattre, transporter ...)
       Un ordre peut etre donnée depuis une station
       Un ordre peut être annulé >>> le ship revient en station
   """
    storage_max = models.IntegerField(default=0)
    storage_now = models.IntegerField(default=0)
    minning_speed = models.IntegerField(default=0)
    speed = models.IntegerField(default=0)
    action_order = models.CharField('Ordre donné', default="")
    action_now = models.CharField('Action en cours', default="")


    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)
    system_fk = models.ForeignKey(System, on_delete=models.CASCADE, default=1)
    station_fk = models.ForeignKey(Station, on_delete=models.CASCADE, default=1)
    # Target générique - peut pointer vers Ore, Station, Ship, etc.
    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='targeted_by_ships'
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')

    # DELETE
    home_station = models.CharField('Home', default="")
    system_target = models.CharField('Cible', default="")

    def player_data(self):
        return {
                'id': self.pk,
                'pos_x': self.pos_x,
                'pos_y': self.pos_y,
        }

    def play_tic(self):
        if self.action_order == 'moving':
            self.action_move()
        elif self.action_order == 'mining':
            self.action_move()
        elif self.action_order == 'landing':
            pass
#        self.save()

    def calcul_action_now(self):
        # self.action_order == 'minning':
        # TEST
        if self.storage_now == 0:
            self.target = self.station_fk
            self.storage_now = self.storage_max
        else:
            self.target = self.get_first_ore()
            self.storage_now = 0

    def get_first_ore(self):
        """Retourne le premier cailloux trouvé dans le systeme"""
        ore = Ore.objects.filter(system_id=self.system_fk.pk)[0]
        return ore



    def action_move(self):
        if not self.target or (self.target.pos_x == self.pos_x and self.target.pos_y == self.pos_y):
            self.calcul_action_now()
        else:
            self.move_ship()
        if self.action_now != 'moving':
            self.action_now = 'moving'

    def move_ship(self):
        """
        Déplace le ship en direction de sa cible.
        """
        delta_x = self.target.pos_x - self.pos_x
        delta_y = self.target.pos_y - self.pos_y
        vecteur_x = delta_x / math.hypot(delta_x, delta_y)
        vecteur_y = delta_y / math.hypot(delta_x, delta_y)
        step_x = round(vecteur_x * self.speed)
        step_y = round(vecteur_y * self.speed)
        if (step_x > 0 and self.pos_x + step_x > self.target.pos_x) or \
                (step_x < 0 and self.pos_x + step_x < self.target.pos_x):
            self.pos_x = self.target.pos_x
        else:
            self.pos_x += step_x
        if (step_y > 0 and self.pos_y + step_y > self.target.pos_y) or \
                (step_y < 0 and self.pos_y + step_y < self.target.pos_y):
            self.pos_y = self.target.pos_y
        else:
            self.pos_y += step_y



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


class ReportSystem(models.Model):
    """
    Représente les actions déroulées dans le système lors du dernier tic.
    Ne générer des rapport que s'il se passe qqchose
    Pour le moment le rapport suit les actions d'un ship voir comment on evolue ( npc / evenement ? )
    """
    name = models.CharField('Nom', null=True)
    system_fk = models.ForeignKey(System, on_delete=models.CASCADE, null=True)
    # Juste le dict pré-calculé, c'est suffisant !
    cached_dict = models.JSONField(null=True)

    @classmethod
    def create_report(cls, system_fk):
        report_system = cls(system_fk=System.objects.get(pk=system_fk))
        report_system.save()
        report_system._generate_report()
        return report_system

    def _generate_report(self):
        for tic in range(0, 15):
            ships = Ship.objects.filter(system_fk=self.system_fk.pk)
            for ship in ships:
                ship.play_tic()
                ship.save()
                self.reportsystemtic_set.create(
                    number=tic,
                    ship_fk=ship,
                    pos_x=ship.pos_x,
                    pos_y=ship.pos_y,
                    action_now=ship.action_now,
                    storage=ship.storage_now,
                    target_model=ship.target_content_type.model,
                    target_id=ship.target_object_id,
                )



        # ores = Ore.objects.filter(system_id=self.system_fk)

    def data_dict(self):
        if self.cached_dict is None:
            cached_dict = {
                'id': self.pk,
                'system_fk': self.system_fk.pk,
                'name': self.name,
                'rst_ships': {},
            }
            for rst in self.reportsystemtic_set.all():
                if rst.ship_fk.pk not in cached_dict['rst_ships']:
                    cached_dict['rst_ships'][rst.ship_fk.pk] = {
                        rst.number : {
                            'pos_x': rst.pos_x,
                            'pos_y': rst.pos_y,
                            'action_now': rst.action_now,
                            'storage': rst.storage,
                            'target_model': rst.target_model,
                            'target_id': rst.target_id,
                        }
                    }
                else:
                    cached_dict['rst_ships'][rst.ship_fk.pk].update({
                        rst.number: {
                            'pos_x': rst.pos_x,
                            'pos_y': rst.pos_y,
                            'action_now': rst.action_now,
                            'storage': rst.storage,
                            'target_model': rst.target_model,
                            'target_id': rst.target_id,
                        }
                    })
            self.cached_dict = cached_dict
        return self.cached_dict

    # def scheduling_reporting(self):
    #
    #     while True:
    #         # Code executed here
    #         time.sleep(60)


class ReportSystemTic(models.Model):
    """
    Représente une faction d'un rapport pour un ship ( 1 sec / fracction / ship ?)

    Format d'un tic: {
        "pos_x": x,
        "pos_y": y,
        "action_now": "moving/mining/loading/docking...."
    }
    """
    number = models.IntegerField('Numero de tic pour le meme ship / rapport', null=True)
    report_fk = models.ForeignKey(ReportSystem, on_delete=models.CASCADE, null=True)
    ship_fk = models.ForeignKey(Ship, on_delete=models.CASCADE, null=True)
    pos_x = models.IntegerField(null=True)
    pos_y = models.IntegerField(null=True)
    action_now = models.CharField(null=True)
    storage = models.IntegerField(null=True)
    target_model = models.CharField(null=True)
    target_id = models.IntegerField(null=True)


    @classmethod
    def create_rst(cls, ship):
        return cls(
            ship_fk=ship.ship_fk,
            pos_x=ship.pos_x,
            pos_y=ship.pos_y,
            action_now=ship.action_now
        )







