# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-08 16:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coadd', '0005_auto_20160308_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='release',
            name='rls_name',
            field=models.CharField(max_length=60, verbose_name='Internal Name'),
        ),
    ]
