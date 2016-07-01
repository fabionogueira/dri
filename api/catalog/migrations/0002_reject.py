# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-27 19:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('catalog_id', models.IntegerField(verbose_name='Catalog')),
                ('owner', models.IntegerField(verbose_name='Owner')),
                ('object_id', models.IntegerField(verbose_name='Object Id')),
                ('reject', models.BooleanField(default=False, verbose_name='Reject')),
            ],
        ),
    ]
