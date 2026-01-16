from django.db import models
import random
from django.core import serializers
import logging
import json
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

import math
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)



