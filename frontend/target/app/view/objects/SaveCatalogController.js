Ext.define('Target.view.objects.SaveCatalogController', {
    extend: 'Ext.app.ViewController',

    requires: [

    ],

    alias: 'controller.savecatalog',

    listen: {
        component: {
            'target-savecatalog': {
                changecatalog: 'onChangeCatalog'
            }
        }
    },

    onChangeCatalog: function (currentCatalog) {
        var me = this,
            vm = me.getViewModel(),
            filterSets = vm.getStore('filterSets'),
            contents = Ext.data.StoreManager.lookup('multiselectColumnsStore');

        filterSets.addFilter({
            property: 'product',
            value: currentCatalog.get('id')
        });

        contents.addFilter({
            property: 'pcn_product_id',
            value: currentCatalog.get('id')
        });
        contents.load();

    },

    onSaveCatalog: function () {
        var me = this,
            vm = me.getViewModel(),
            currentCatalog = vm.get('currentCatalog'),
            filterSet = vm.get('filterSet'),
            form = me.lookup('SaveAsForm').getForm(),
            values;

        console.log(form.getValues());

        console.log('filterSet: ',filterSet)
        if (form.isValid()) {
            values = form.getValues();

            Ext.Ajax.request({
                url: '/dri/api/save_product_as/',
                scope: this,
                params: {
                    'product': parseInt(currentCatalog.get('id')),
                    'name': values.name,
                    'filter': parseInt(filterSet.get('id')),
                    'description': values.description
//                    'columns': values.columns
                },
                success: function (response) {
                    // Recuperar a resposta e fazer o decode no json.
                    var obj = Ext.decode(response.responseText);

                    me.onCancel();
                },
                failure: function (response, opts) {
                    // TODO: Mostrar mensagem de falha
                    var msg = response.status + ' ' + response.statusText;
                    Ext.Msg.show({
                        title: 'Sorry',
                        msg: msg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            });
        }
    },

    onCancel: function () {
        this.getView().close();

    }

});
