# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lan2015', '0003_comment_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='color',
            field=models.CharField(max_length=9, default='#FFFFFF'),
            preserve_default=False,
        ),
    ]
