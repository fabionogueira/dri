# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-28 20:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0003_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rating',
            name='rating',
            field=models.IntegerField(verbose_name='Rating'),
        ),
    ]