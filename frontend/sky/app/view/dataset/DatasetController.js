/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Sky.view.dataset.DatasetController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.dataset',

    listen: {
        component: {
            'dataset': {
                loadpanel: 'onLoadPanel',
                updatePanel: 'onUpdatePanel',
                updatePosition: 'changeImage'
            },
            'sky-visiomatic': {
                dblclick: 'onDblClickVisiomatic',
                changeimage: 'onChangeImage'
            }
        }
    },

    onLoadPanel: function (dataset) {
        var me = this;

        me.loadData(dataset);
    },

    onUpdatePanel: function (dataset) {
        var me = this;

        me.loadData(dataset);
    },

    loadData: function (dataset) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.get('datasets');

        store.filter([{
            property: 'id',
            value: dataset
        }]);

        store.load({
            scope: this,
            callback: function (r) {
                if (r.length == 1) {
                    vm.set('currentDataset', r[0]);

                    this.afterLoad();
                }
            }
        });
    },

    afterLoad: function () {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            current = vm.get('currentDataset');

        view.setLoading(false);

        // Setar a Imagem no Visiomatic
        me.changeImage(current);
    },

    changeImage: function () {
        var me = this,
            vm = me.getViewModel(),
            visiomatic = me.lookupReference('visiomatic'),
            current = vm.get('currentDataset'),
            url = current.get('image_src_ptif');

        if (url != '') {
            visiomatic.setImage(url);

        } else {
            visiomatic.removeImageLayer();

        }
    },

    onChangeImage: function () {
        var me = this,
            view = me.getView(),
            radec = view.getRadec(),
            fov = view.getFov(),
            visiomatic = me.lookupReference('visiomatic');

        visiomatic.setView(radec.ra, radec.dec, fov);

    },

    onDblClickVisiomatic: function () {
        var me = this,
            vm = me.getViewModel(),
            current = vm.get('currentDataset'),
            release = current.get('release'),
            hash;

        hash = 'sky/' + release;

        me.redirectTo(hash);
    }

});