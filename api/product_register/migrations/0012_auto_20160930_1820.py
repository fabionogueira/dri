# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-09-30 18:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_register', '0011_auto_20160930_1413'),
    ]

    operations = [
        migrations.AlterField(
            model_name='externalprocess',
            name='epr_end_date',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='End Date'),
        ),
        migrations.AlterField(
            model_name='externalprocess',
            name='epr_start_date',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='Start Date'),
        ),
    ]
