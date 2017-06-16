# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-22 19:39
from __future__ import unicode_literals

import current_user
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('product_register', '0002_auto_20160621_1504'),
    ]

    operations = [
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sti_name', models.CharField(max_length=128, verbose_name='Site')),
                ('sti', models.ForeignKey(default=current_user.get_current_user, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.RemoveField(
            model_name='export',
            name='exp_product_id',
        ),
    ]
