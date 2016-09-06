# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-09-01 18:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coadd', '0023_auto_20160826_1512'),
        ('product', '0014_mask_msk_release'),
    ]

    operations = [
        migrations.AddField(
            model_name='mask',
            name='msk_tag',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='coadd.Tag', verbose_name='Tag'),
        ),
    ]