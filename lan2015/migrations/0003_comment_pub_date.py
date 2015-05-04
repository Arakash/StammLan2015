# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('lan2015', '0002_announcement_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 21, 16, 19, 23, 638724, tzinfo=utc), verbose_name='date published'),
            preserve_default=False,
        ),
    ]
