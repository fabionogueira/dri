Ext.define('Explorer.view.coadd.CoaddController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.coadd',

    listen: {
        component: {
            'coadd-objects': {
                loadpanel: 'onLoadPanel'
            },
            'coadd-visiomatic': {
                changedataset: 'onChangeDataset',
                changeimage: 'onChangeImage'
            }
        },
        store: {
            '#coaddObject': {
                load: 'onLoadObject'
            },
            '#datasets': {
                load: 'onLoadDatasets'
            }
        }
    },

    onLoadPanel: function (source, object_id) {
        this.loadObject();

    },

    loadObject: function () {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('coaddObject'),
            source = vm.get('source'),
            object_id = vm.get('object_id'),
            view = me.getView();

        view.setLoading(true);

        store.addFilter([
            {
                'property': 'source',
                'value': source
            },
            {
                'property': 'coadd_object_id',
                'value': object_id
            }
        ]);

        store.load();

    },

    onLoadObject: function (store) {
        var me = this,
            vm = me.getViewModel(),
            grid = me.lookupReference('properties-grid'),
            properties = vm.getStore('properties'),
            datasets = vm.getStore('datasets'),
            aladin = me.lookupReference('aladin'),
            view = me.getView(),
            coaddObject, data, position;

        // Setar as propriedades
        properties.removeAll();

        if (store.count() == 1) {
            coaddObject = store.first();
            data = coaddObject.data;

            for (var property in data) {
                var prop = property.toLowerCase();

                // nao incluir as propriedades _meta
                if (prop.indexOf('_meta_') === -1) {
                    properties.add([
                        [property.toLowerCase(), data[property]]
                    ]);
                }
            }

            vm.set('coaddObject', data);

        }

        grid.setStore(properties);


        // descobrir as tiles do objeto usando as coordenadas do objeto
        position = String(data._meta_ra) + ',' + String(data._meta_dec);

        datasets.addFilter([{
            property: 'position',
            value: position
        }]);

        // Aladin
        aladin.showDesFootprint();
        aladin.goToPosition(position);
        aladin.plotObject(data);

        view.setLoading(false);

    },

    onLoadDatasets: function (store) {
        var me = this,
            visiomatic = me.lookupReference('visiomatic'),
            cmb = visiomatic.lookupReference('cmbCurrentDataset');

        // Apenas uma tile na coordenada do objeto,
        if (store.count() == 1) {
            // setar essa tile no imagepreview
            me.changeImage(store.first());

            cmb.select(store.first());

            // Desabilitar a combobox Image
            cmb.setReadOnly(true);

        } else if (store.count() > 1) {
            me.changeImage(store.first());

            // Seleciona a primeira tile disponivel
            cmb.select(store.first());

            // Habilitar a combobox Image
            cmb.setReadOnly(false);

        } else {
            console.log('Nenhuma tile encontrada para o objeto');
        }

    },

    changeImage: function (dataset) {
        var me = this,
            visiomatic = me.lookupReference('visiomatic'),
            url = dataset.get('image_src_ptif');

        if (dataset) {
            if (url !== '') {
                visiomatic.setImage(url);

            } else {
                visiomatic.removeImageLayer();

            }

        } else {
            console.log('dataset nao encontrado');
        }
    },

    onChangeDataset: function (dataset) {
        var me = this;
        me.changeImage(dataset);
    },

    onChangeImage: function () {
        var me = this,
            vm = me.getViewModel(),
            object = vm.get('coaddObject'),
            visiomatic = me.lookupReference('visiomatic'),
            fov = 0.05;

        visiomatic.setView(
            object._meta_ra,
            object._meta_dec,
            fov);

        // map = visiomatic.getMap();
        // libL = visiomatic.libL;
        // wcs = map.options.crs;
        // console.log('---------------------------------');
        // var latLng = wcs.eqToCelsys(object.DEC, object.RA);
        // latlng = libL.latLng(latLng.lat, latLng.lng);
        // console.log(latlng);
        // var path = libL.ellipseMarker(latlng, {
        //     majAxis: object.A_IMAGE / 3600.0,
        //     minAxis: object.B_IMAGE / 3600.0,
        //     posAngle: 90 - object.THETA_IMAGE,
        //     color: '#FFFF00'
        // }).addTo(map);

        // feature = libL.ellipse(latlng, {
        //     majAxis: object.A_IMAGE / 3600.0,
        //     minAxis: object.B_IMAGE / 3600.0,
        //     posAngle: 90 - object.THETA_IMAGE
        // });

        // feature.addTo(map);

    },

    onSearch: function (value) {
        var me = this,
            vm = me.getViewModel(),
            properties = vm.getStore('properties');

        if (value !== '') {
            properties.filter([
                {
                    property: 'property',
                    value: value
                }
            ]);

        } else {
            me.onSearchCancel();
        }

    },

    onSearchCancel: function () {
        var me = this,
            vm = me.getViewModel(),
            properties = vm.getStore('properties');

        properties.clearFilter();

    }

});
