Ext.define('Target.view.association.CellDragDrop', {
    extend: 'Ext.ux.CellDragDrop',
    alias: 'plugin.customcelldragdrop',

    requires: [
        'Ext.ux.CellDragDrop'
    ],

    onViewRender: function (view) {
        var me = this,
            scrollEl;

        if (me.enableDrag) {
            if (me.containerScroll) {
                scrollEl = view.getEl();
            }

            me.dragZone = new Ext.view.DragZone({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                containerScroll: me.containerScroll,
                scrollEl: scrollEl,
                getDragData: function (e) {
                    var view = this.view,
                        item = e.getTarget(view.getItemSelector()),
                        record = view.getRecord(item),
                        cell = e.getTarget(view.getCellSelector()),
                        dragEl, header;

                    if (item) {
                        dragEl = document.createElement('div');
                        dragEl.className = 'x-form-text';
                        dragEl.appendChild(document.createTextNode(cell.textContent || cell.innerText));

                        header = view.getHeaderByCell(cell);
                        return {
                            event: new Ext.EventObjectImpl(e),
                            ddel: dragEl,
                            item: e.target,
                            columnName: header.dataIndex,
                            record: record
                        };
                    }
                },

                onInitDrag: function (x, y) {
                    var self = this,
                        data = self.dragData,
                        view = self.view,
                        selectionModel = view.getSelectionModel(),
                        record = data.record,
                        el = data.ddel;

                    // Update the selection to match what would have been selected if the user had
                    // done a full click on the target node rather than starting a drag from it.
                    if (!selectionModel.isSelected(record)) {
                        selectionModel.select(record, true);
                    }

                    Ext.fly(self.ddel).update(el.textContent || el.innerText);
                    self.proxy.update(self.ddel);
                    self.onStartDrag(x, y);
                    return true;
                }
            });
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.dd.DropZone(view.el, {
                view: view,
                ddGroup: me.dropGroup || me.ddGroup,
                containerScroll: true,

                getTargetFromEvent: function (e) {
                    var self = this,
                        view = self.view,
                        cell = e.getTarget(view.cellSelector),
                        row, header;

                    // Ascertain whether the mousemove is within a grid cell.
                    if (cell) {
                        row = view.findItemByChild(cell);
                        header = view.getHeaderByCell(cell);

                        if (row && header) {
                            return {
                                node: cell,
                                record: view.getRecord(row),
                                columnName: header.dataIndex
                            };
                        }
                    }
                },

                // On Node enter, see if it is valid for us to drop the field on that type of column.
                onNodeEnter: function (target, dd, e, dragData) {
                    var self = this,
                        destType = target.record.getField(target.columnName).type.toUpperCase(),
                        sourceType = dragData.record.getField(dragData.columnName).type.toUpperCase();

                    delete self.dropOK;

                    // Return if no target node or if over the same cell as the source of the drag.
                    if (!target || target.node === dragData.item.parentNode) {
                        return;
                    }

                    // Check whether the data type of the column being dropped on accepts the
                    // dragged field type. If so, set dropOK flag, and highlight the target node.
                    if (me.enforceType && destType !== sourceType) {

                        self.dropOK = false;

                        if (me.noDropCls) {
                            Ext.fly(target.node).addCls(me.noDropCls);
                        } else {
                            Ext.fly(target.node).applyStyles({
                                backgroundColor: me.noDropBackgroundColor
                            });
                        }

                        return false;
                    }

                    // Verificar se existe a configuracao dropColumn e se a coluna e igual a coluna target.
                    if (me.dropColumn && me.dropColumn !== target.columnName) {
                        self.dropOK = false;

                        return false;
                    }

                    self.dropOK = true;

                    if (me.dropCls) {
                        Ext.fly(target.node).addCls(me.dropCls);
                    } else {
                        Ext.fly(target.node).applyStyles({
                            backgroundColor: me.dropBackgroundColor
                        });
                    }
                },

                // Return the class name to add to the drag proxy. This provides a visual indication
                // of drop allowed or not allowed.
                onNodeOver: function (target, dd, e, dragData) {
                    return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
                },

                // Highlight the target node.
                onNodeOut: function (target, dd, e, dragData) {
                    var cls = this.dropOK ? me.dropCls : me.noDropCls;

                    if (cls) {
                        Ext.fly(target.node).removeCls(cls);
                    } else {
                        Ext.fly(target.node).applyStyles({
                            backgroundColor: ''
                        });
                    }
                },

                // Process the drop event if we have previously ascertained that a drop is OK.
                onNodeDrop: function (target, dd, e, dragData) {
                    if (this.dropOK) {
                        target.record.set(target.columnName, dragData.record.get(dragData.columnName));
                        if (me.applyEmptyText) {
                            dragData.record.set(dragData.columnName, me.emptyText);
                        }

                        view.fireEvent('celldrop', target, dragData, me);
                        return true;
                    }
                },

                onCellDrop: Ext.emptyFn
            });
        }
    }
});
