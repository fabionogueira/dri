# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-04 17:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0053_productrelated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productrelated',
            name='prl_product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.Product', verbose_name='Product'),
        ),
    ]
