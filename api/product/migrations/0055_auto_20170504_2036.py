# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-04 20:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0054_auto_20170504_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productrelated',
            name='prl_cross_identification',
            field=models.ForeignKey(blank=True, default=None, help_text='Foreign key between the product and the related product', null=True, on_delete=django.db.models.deletion.CASCADE, to='product.ProductContent', verbose_name='Cross Identification'),
        ),
    ]
