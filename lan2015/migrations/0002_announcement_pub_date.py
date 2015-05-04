# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('lan2015', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='announcement',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 21, 15, 23, 44, 121126, tzinfo=utc), verbose_name='date published'),
            preserve_default=False,
        ),
    ]
