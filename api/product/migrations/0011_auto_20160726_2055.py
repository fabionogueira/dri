# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-26 20:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('product', '0010_auto_20160714_1535'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='catalog',
            name='ctl_num_columns',
        ),
        migrations.RemoveField(
            model_name='catalog',
            name='ctl_num_tiles',
        ),
    ]
