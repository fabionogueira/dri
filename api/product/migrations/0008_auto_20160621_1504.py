# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-21 15:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('product', '0007_productcontentassociation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='table',
            name='tbl_schema',
            field=models.CharField(blank=True, max_length=128, null=True, verbose_name='Schema name'),
        ),
    ]
