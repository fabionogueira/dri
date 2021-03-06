# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-19 17:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0058_auto_20170519_1652'),
    ]

    operations = [
        migrations.AddField(
            model_name='cutoutjob',
            name='cjb_tag',
            field=models.CharField(blank=True, max_length=60, null=True, verbose_name='Release Tag'),
        ),
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_Blacklist',
            field=models.CharField(blank=True, help_text='Exclude blacklisted ccds', max_length=10, null=True, verbose_name='Blacklist'),
        ),
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_band',
            field=models.CharField(blank=True, max_length=10, null=True, verbose_name='Filters'),
        ),
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_job_type',
            field=models.CharField(choices=[('coadd', 'Coadd Images'), ('single', 'Single Epoch')], max_length=10, verbose_name='JobType'),
        ),
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_xsize',
            field=models.CharField(default='1.0', help_text='xsize in arcmin, default is 1.0', max_length=5, verbose_name='Xsize'),
        ),
        migrations.AlterField(
            model_name='cutoutjob',
            name='cjb_ysize',
            field=models.CharField(default='1.0', help_text='ysize in arcmin, default is 1.0', max_length=5, verbose_name='ysize'),
        ),
    ]
