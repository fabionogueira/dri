# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-20 21:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('coadd', '0007_auto_20160311_1632'),
    ]

    operations = [
        migrations.CreateModel(
            name='Filters',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project', models.CharField(blank=True, max_length=20, null=True, verbose_name='Project')),
                ('filter', models.CharField(max_length=1, verbose_name='Filter')),
                ('lambda_min', models.FloatField(blank=True, null=True, verbose_name='lambda_min')),
                ('lambda_max', models.FloatField(blank=True, null=True, verbose_name='lambda_max')),
                ('lambda_mean', models.FloatField(blank=True, null=True, verbose_name='lambda_mean')),
            ],
        ),
    ]