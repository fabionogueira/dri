Ext.define('Target.model.Bookmarked', {
    extend: 'Ext.data.Model',

    requires: [
        'common.data.proxy.Django'
    ],

    proxy: {
        type: 'django',
        url: '/dri/api/bookmarked/'
    },

    fields: [
        {name:'id', type:'int', default: null, persist: false},
        {name:'catalog_id', type:'int'},
        {name:'owner', type:'string', persist: false},
        {name:'is_starred', type:'bool', default: true},
        {name:'is_owner', type:'bool', persist: false}
    ]

});
