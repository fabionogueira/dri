# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-19 16:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0057_auto_20170518_1319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_job_id',
            field=models.CharField(blank=True, max_length=1024, null=True, verbose_name='Job ID'),
        ),
    ]