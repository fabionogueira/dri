Ext.define('Target.model.Setting', {
    extend: 'Ext.data.Model',

    fields: [
        {name:'id', type:'int', persist: false},
        {name:'cst_product', type:'int'},
        {name:'cst_display_name', type:'string'},
        {name:'cst_description', type:'string'},
        {name:'cst_is_public', type:'boolean'},
        {name:'cst_is_editable', type:'boolean'},
        {name:'owner', type:'string'},
        {name:'editable', type:'boolean', default: false, persist: false}
    ]

});
