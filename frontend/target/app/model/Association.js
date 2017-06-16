Ext.define('Target.model.Association', {
    extend: 'Ext.data.Model',

    requires: [
        'common.data.proxy.Django'
    ],

    fields: [
        {name:'id', type:'int', persist: false},
        {name:'pca_product', type:'int'},
        {name:'pca_class_content', type:'int'},
        {name:'pca_product_content', type:'int'},
        {name:'pcc_ucd', type:'string'},
        {name:'pcn_column_name', type:'string'}
    ],

    proxy: {
        type: 'django',
        url: '/dri/api/association/'
    }
});

