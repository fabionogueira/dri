# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-09-30 14:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_register', '0010_auto_20160926_2030'),
    ]

    operations = [
        migrations.AlterField(
            model_name='externalprocess',
            name='epr_original_id',
            field=models.CharField(help_text='original process id on your instances of origin.', max_length=128, null=True, verbose_name='Original Id'),
        ),
    ]
