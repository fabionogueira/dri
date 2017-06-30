Ext.define('Target.view.preview.DescutDownloadWindow', {
    extend: 'Ext.window.Window',

    xtype: 'target-download-descut',

    title: 'Download',
    width: 600,
    height: 400,
    modal: true,
    autoShow: true,

    closeAction: 'destroy',

    bodyPadding: 20,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    config: {
        currentCatalog: null
    },

    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            items: [
                {
                    xtype: 'form',
                    reference: 'DownloadForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false,
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelAlign: 'top',
                        labelWidth: 100
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Format',
                            defaults: {
                                anchor: '100%'
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    vertical: true,
                                    columns: 2,
                                    items: [
                                        {boxLabel: 'PNG', name: 'table_format', inputValue: 'png', checked: true},
                                        {boxLabel: 'FITS', name: 'table_format', inputValue: 'fits'},
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    scope: me,
                    handler: 'onCancel'
                },
                {
                    text: 'Download',
                    scope: me,
                    iconCls: 'x-fa fa-download',
                    ui: 'soft-green',
                    handler: 'onDownload'
                }
            ]
        });
        me.callParent(arguments);
    },

    setCurrentCatalog: function (currentCatalog) {
        var me = this;

        if ((currentCatalog) && (currentCatalog.get('id') > 0)) {

            me.currentCatalog = currentCatalog;

        }
    },

    onDownload: function () {
        var me = this,
            currentCatalog = me.getCurrentCatalog(),
            form = me.down('form').getForm(),
            values,
            table_format = [],
            cutouts = false,
            report_format = [];

        if (form.isValid()) {

            values = form.getValues();

            if (values.table_format) {
                table_format = values.table_format;
            }

            if (values.cutouts) {
                cutouts = values.cutouts;
            }

            if (values.report_format) {
                report_format = values.report_format;
            }

            Ext.Ajax.request({
                url: '/dri/api/product/download/',
                scope: this,
                params: {
                    'product': currentCatalog.get('id'),
                    'table_format': table_format,
                    'cutouts': cutouts,
                    'report_format': report_format
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
        this.close();
    }
});
