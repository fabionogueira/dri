Ext.define('Sky.view.dataset.Dataset', {
    extend: 'Ext.panel.Panel',

    xtype: 'dataset',

    requires: [
        'Sky.view.dataset.Visiomatic',
        'Sky.view.dataset.DatasetController',
        'Sky.view.dataset.DatasetModel'
    ],

    controller: 'dataset',

    viewModel: 'dataset',

    config: {
        dataset: null,
        coordinate: null,
        fov: null,
        radec: null
    },

    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            items: [
                {
                    xtype: 'sky-visiomatic',
                    reference: 'visiomatic'
                }
            ]
        });

        me.callParent(arguments);
    },

    loadPanel: function (arguments) {
        var me = this,
            dataset = me.getDataset(),
            coordinate = me.getCoordinate(),
            fov = me.getFov(),
            vm = this.getViewModel(),
            radec, coordinates;

        if (dataset > 0) {

            vm.set('dataset', dataset);

            me.setParameters(coordinate, fov);

            me.setLoading(true);

            this.fireEvent('loadpanel', dataset, this);
        }
    },

    updatePanel: function (arguments) {
        var me = this,
            old = me.getDataset(),
            dataset = arguments[1],
            coordinate = arguments[2],
            fov = arguments[3],
            vm = this.getViewModel(),
            visiomatic = me.down('sky-visiomatic');

        me.setParameters(coordinate, fov);

        // Remover a ImageLayer do Visiomatic
        visiomatic.removeImageLayer();

        if ((dataset > 0) && (dataset != old)) {
            me.setDataset(dataset);

            vm.set('dataset', dataset);

            this.fireEvent('updatePanel', dataset, this);

        } else {
            this.fireEvent('updatePosition', dataset, this);

        }
    },

    setParameters: function (coordinate, fov) {
        var me = this,
            coordinates, radec;

        coordinate = decodeURIComponent(coordinate);
        if (coordinate.includes('+')) {
            coordinates = coordinate.split('+');

        } else {
            coordinates = coordinate.split('-');

        }

        radec = {
            ra: coordinates[0].replace(',', '.'),
            dec: coordinates[1].replace(',', '.')
        };

        me.setRadec(radec);

        me.setFov(fov.replace(',', '.'));

        coordinate = radec.ra + ', ' + radec.dec;
        me.setCoordinate(coordinate);

    }
});