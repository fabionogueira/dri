# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-19 18:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0061_auto_20170519_1812'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_display_name',
            field=models.CharField(max_length=40, verbose_name='Name'),
        ),
    ]
