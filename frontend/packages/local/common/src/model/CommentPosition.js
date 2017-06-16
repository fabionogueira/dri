Ext.define('common.model.CommentPosition', {
    extend: 'Ext.data.Model',

    fields: [
        {name:'id', type:'int', persist: false},
        {name:'owner', type:'string'},
        {name:'pst_dataset', type:'int'},
        {name:'pst_filter', type:'int'},
        {name:'pst_ra', type:'float'},
        {name:'pst_dec', type:'float'},
        {name:'pst_date', type:'date'},
        {name:'pst_comment', type:'string'},
        {name:'is_owner', type:'boolean'}
    ]

});
