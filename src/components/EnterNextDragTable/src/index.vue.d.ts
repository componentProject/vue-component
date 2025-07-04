import type { VxeTableDefines } from 'vxe-table';
import type { EnterNextDragTableProps, NoNextInputParams, NoSelectValueParams } from './_types';
type __VLS_Props = EnterNextDragTableProps;
declare const tableData: import("vue").ModelRef<unknown[], string, unknown[], unknown[]>;
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: typeof tableData['value'];
};
declare var __VLS_11: string, __VLS_12: {
    [key: string]: any;
    $table: import("vxe-table").VxeTableConstructor<any>;
    $grid: import("vxe-table").VxeGridConstructor<any> | null | undefined;
    rowid: string;
    row: any;
    rowIndex: number;
    $rowIndex: number;
    _rowIndex: number;
    column: VxeTableDefines.ColumnInfo<any>;
    columnIndex: number;
    $columnIndex: number;
    _columnIndex: number;
    type: string;
    fixed: import("vxe-table").VxeColumnPropTypes.Fixed;
    checked?: boolean;
    indeterminate?: boolean;
    seq: string | number;
    level: number;
    isEdit: boolean;
    isHidden: boolean;
    field: string;
    item: any;
    data: any;
    visibleData: any[];
    items: any[];
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_11>]?: (props: typeof __VLS_12) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {
    refreshRows: () => void;
    getTableRef: () => ({
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<globalThis.ExtractPropTypes<{
            id: {
                type: StringConstructor;
            };
            border: {
                type: BooleanConstructor;
                default: boolean;
            };
            showOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            showHeaderOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            showFooterOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            resizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            autoResize: {
                type: BooleanConstructor;
                default: boolean;
            };
            resizableConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ResizableConfig>;
                default: () => {};
            };
            editable: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            editAutoFocus: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            editRules: {
                type: PropType<import("vxe-table").VxeTablePropTypes.EditRules>;
                default: null;
            };
            editConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.EditConfig>;
                default: () => {};
            };
            filterable: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            filterType: {
                type: PropType<"full" | "filter">;
                default: () => string;
            };
            filterLayout: {
                type: PropType<("input" | "checkbox" | "select")[]>;
                default: () => string[];
            };
            filterConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.FilterConfig>;
                default: () => {};
            };
            dragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowdragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            columndragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            dragType: {
                type: StringConstructor;
                default: () => string;
            };
            rowDisabledClass: {
                type: StringConstructor;
                default: () => string;
            };
            rowDragDisabledMethod: {
                type: FunctionConstructor;
            };
            rowDragEndMethod: {
                type: FunctionConstructor;
            };
            rowDragConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowDragConfig>;
                default: () => {};
            };
            columnDragDisabledMethod: {
                type: FunctionConstructor;
            };
            columnDragEndMethod: {
                type: FunctionConstructor;
            };
            columnDragConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ColumnDragConfig>;
                default: () => {};
            };
            rowId: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig["keyField"]>;
                default: () => string;
            };
            rowConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig>;
                default: () => {};
            };
            columns: {
                type: PropType<import("../DraggableTable/_types").ColumnType[]>;
                default: () => never[];
            };
            columnConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ColumnConfig>;
                default: () => {};
            };
            virtualXConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.VirtualXConfig>;
                default: () => {};
            };
            virtualYConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.VirtualYConfig>;
                default: () => {};
            };
            menuConfigColumn: {
                type: BooleanConstructor;
                default: boolean;
            };
            menuConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.MenuConfig>;
                default: () => {};
            };
            sortable: {
                type: BooleanConstructor;
                default: boolean;
            };
            sortConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.SortConfig>;
                default: () => {};
            };
            modelValue: {
                type: globalThis.PropType<unknown[]>;
            };
        }>> & Readonly<{
            "onUpdate:modelValue"?: ((value: unknown[]) => any) | undefined;
            "onUpdate:tableData"?: ((...args: any[]) => any) | undefined;
            onColumnDragend?: ((...args: any[]) => any) | undefined;
            onRowDragend?: ((...args: any[]) => any) | undefined;
            onResizableChange?: ((...args: any[]) => any) | undefined;
            onCheckboxChange?: ((...args: any[]) => any) | undefined;
            onCheckboxAll?: ((...args: any[]) => any) | undefined;
            onHeaderCellMenu?: ((...args: any[]) => any) | undefined;
        }>, {
            getTable: () => import("vxe-table").VxeGridInstance | null;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            "update:tableData": (...args: any[]) => void;
            columnDragend: (...args: any[]) => void;
            rowDragend: (...args: any[]) => void;
            resizableChange: (...args: any[]) => void;
            checkboxChange: (...args: any[]) => void;
            checkboxAll: (...args: any[]) => void;
            headerCellMenu: (...args: any[]) => void;
            "update:modelValue": (value: unknown[]) => void;
        }, import("vue").PublicProps, {
            columns: import("../DraggableTable/_types").ColumnType[];
            editable: boolean;
            resizable: boolean;
            showOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            showHeaderOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            showFooterOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            sortable: boolean;
            border: boolean;
            filterType: "filter" | "full";
            filterLayout: ("input" | "select" | "checkbox")[];
            filterable: boolean;
            autoResize: boolean;
            resizableConfig: import("vxe-table").VxeTablePropTypes.ResizableConfig<import("vxe-table").VxeTablePropTypes.Row>;
            editAutoFocus: boolean;
            editRules: import("vxe-table").VxeTablePropTypes.EditRules<any>;
            editConfig: import("vxe-table").VxeTablePropTypes.EditConfig<any>;
            filterConfig: import("vxe-table").VxeTablePropTypes.FilterConfig<import("vxe-table").VxeTablePropTypes.Row>;
            dragable: boolean;
            rowdragable: boolean;
            columndragable: boolean;
            dragType: string;
            rowDisabledClass: string;
            rowDragConfig: import("vxe-table").VxeTablePropTypes.RowDragConfig<any>;
            columnDragConfig: import("vxe-table").VxeTablePropTypes.ColumnDragConfig<any>;
            rowId: string | undefined;
            rowConfig: import("vxe-table").VxeTablePropTypes.RowConfig<any>;
            columnConfig: import("vxe-table").VxeTablePropTypes.ColumnConfig<any>;
            virtualXConfig: import("vxe-table").VxeTablePropTypes.VirtualXConfig;
            virtualYConfig: import("vxe-table").VxeTablePropTypes.VirtualYConfig;
            menuConfigColumn: boolean;
            menuConfig: import("vxe-table").VxeTablePropTypes.MenuConfig<any>;
            sortConfig: import("vxe-table").VxeTablePropTypes.SortConfig<import("vxe-table").VxeTablePropTypes.Row>;
        }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<globalThis.ExtractPropTypes<{
            id: {
                type: StringConstructor;
            };
            border: {
                type: BooleanConstructor;
                default: boolean;
            };
            showOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            showHeaderOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            showFooterOverflow: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
                default: boolean;
            };
            resizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            autoResize: {
                type: BooleanConstructor;
                default: boolean;
            };
            resizableConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ResizableConfig>;
                default: () => {};
            };
            editable: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            editAutoFocus: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            editRules: {
                type: PropType<import("vxe-table").VxeTablePropTypes.EditRules>;
                default: null;
            };
            editConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.EditConfig>;
                default: () => {};
            };
            filterable: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            filterType: {
                type: PropType<"full" | "filter">;
                default: () => string;
            };
            filterLayout: {
                type: PropType<("input" | "checkbox" | "select")[]>;
                default: () => string[];
            };
            filterConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.FilterConfig>;
                default: () => {};
            };
            dragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowdragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            columndragable: {
                type: BooleanConstructor;
                default: boolean;
            };
            dragType: {
                type: StringConstructor;
                default: () => string;
            };
            rowDisabledClass: {
                type: StringConstructor;
                default: () => string;
            };
            rowDragDisabledMethod: {
                type: FunctionConstructor;
            };
            rowDragEndMethod: {
                type: FunctionConstructor;
            };
            rowDragConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowDragConfig>;
                default: () => {};
            };
            columnDragDisabledMethod: {
                type: FunctionConstructor;
            };
            columnDragEndMethod: {
                type: FunctionConstructor;
            };
            columnDragConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ColumnDragConfig>;
                default: () => {};
            };
            rowId: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig["keyField"]>;
                default: () => string;
            };
            rowConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig>;
                default: () => {};
            };
            columns: {
                type: PropType<import("../DraggableTable/_types").ColumnType[]>;
                default: () => never[];
            };
            columnConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.ColumnConfig>;
                default: () => {};
            };
            virtualXConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.VirtualXConfig>;
                default: () => {};
            };
            virtualYConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.VirtualYConfig>;
                default: () => {};
            };
            menuConfigColumn: {
                type: BooleanConstructor;
                default: boolean;
            };
            menuConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.MenuConfig>;
                default: () => {};
            };
            sortable: {
                type: BooleanConstructor;
                default: boolean;
            };
            sortConfig: {
                type: PropType<import("vxe-table").VxeTablePropTypes.SortConfig>;
                default: () => {};
            };
            modelValue: {
                type: globalThis.PropType<unknown[]>;
            };
        }>> & Readonly<{
            "onUpdate:modelValue"?: ((value: unknown[]) => any) | undefined;
            "onUpdate:tableData"?: ((...args: any[]) => any) | undefined;
            onColumnDragend?: ((...args: any[]) => any) | undefined;
            onRowDragend?: ((...args: any[]) => any) | undefined;
            onResizableChange?: ((...args: any[]) => any) | undefined;
            onCheckboxChange?: ((...args: any[]) => any) | undefined;
            onCheckboxAll?: ((...args: any[]) => any) | undefined;
            onHeaderCellMenu?: ((...args: any[]) => any) | undefined;
        }>, {
            getTable: () => import("vxe-table").VxeGridInstance | null;
        }, {}, {}, {}, {
            columns: import("../DraggableTable/_types").ColumnType[];
            editable: boolean;
            resizable: boolean;
            showOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            showHeaderOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            showFooterOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
            sortable: boolean;
            border: boolean;
            filterType: "filter" | "full";
            filterLayout: ("input" | "select" | "checkbox")[];
            filterable: boolean;
            autoResize: boolean;
            resizableConfig: import("vxe-table").VxeTablePropTypes.ResizableConfig<import("vxe-table").VxeTablePropTypes.Row>;
            editAutoFocus: boolean;
            editRules: import("vxe-table").VxeTablePropTypes.EditRules<any>;
            editConfig: import("vxe-table").VxeTablePropTypes.EditConfig<any>;
            filterConfig: import("vxe-table").VxeTablePropTypes.FilterConfig<import("vxe-table").VxeTablePropTypes.Row>;
            dragable: boolean;
            rowdragable: boolean;
            columndragable: boolean;
            dragType: string;
            rowDisabledClass: string;
            rowDragConfig: import("vxe-table").VxeTablePropTypes.RowDragConfig<any>;
            columnDragConfig: import("vxe-table").VxeTablePropTypes.ColumnDragConfig<any>;
            rowId: string | undefined;
            rowConfig: import("vxe-table").VxeTablePropTypes.RowConfig<any>;
            columnConfig: import("vxe-table").VxeTablePropTypes.ColumnConfig<any>;
            virtualXConfig: import("vxe-table").VxeTablePropTypes.VirtualXConfig;
            virtualYConfig: import("vxe-table").VxeTablePropTypes.VirtualYConfig;
            menuConfigColumn: boolean;
            menuConfig: import("vxe-table").VxeTablePropTypes.MenuConfig<any>;
            sortConfig: import("vxe-table").VxeTablePropTypes.SortConfig<import("vxe-table").VxeTablePropTypes.Row>;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<globalThis.ExtractPropTypes<{
        id: {
            type: StringConstructor;
        };
        border: {
            type: BooleanConstructor;
            default: boolean;
        };
        showOverflow: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
            default: boolean;
        };
        showHeaderOverflow: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
            default: boolean;
        };
        showFooterOverflow: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ShowOverflow>;
            default: boolean;
        };
        resizable: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoResize: {
            type: BooleanConstructor;
            default: boolean;
        };
        resizableConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ResizableConfig>;
            default: () => {};
        };
        editable: {
            type: BooleanConstructor;
            default: () => boolean;
        };
        editAutoFocus: {
            type: BooleanConstructor;
            default: () => boolean;
        };
        editRules: {
            type: PropType<import("vxe-table").VxeTablePropTypes.EditRules>;
            default: null;
        };
        editConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.EditConfig>;
            default: () => {};
        };
        filterable: {
            type: BooleanConstructor;
            default: () => boolean;
        };
        filterType: {
            type: PropType<"full" | "filter">;
            default: () => string;
        };
        filterLayout: {
            type: PropType<("input" | "checkbox" | "select")[]>;
            default: () => string[];
        };
        filterConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.FilterConfig>;
            default: () => {};
        };
        dragable: {
            type: BooleanConstructor;
            default: boolean;
        };
        rowdragable: {
            type: BooleanConstructor;
            default: boolean;
        };
        columndragable: {
            type: BooleanConstructor;
            default: boolean;
        };
        dragType: {
            type: StringConstructor;
            default: () => string;
        };
        rowDisabledClass: {
            type: StringConstructor;
            default: () => string;
        };
        rowDragDisabledMethod: {
            type: FunctionConstructor;
        };
        rowDragEndMethod: {
            type: FunctionConstructor;
        };
        rowDragConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.RowDragConfig>;
            default: () => {};
        };
        columnDragDisabledMethod: {
            type: FunctionConstructor;
        };
        columnDragEndMethod: {
            type: FunctionConstructor;
        };
        columnDragConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ColumnDragConfig>;
            default: () => {};
        };
        rowId: {
            type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig["keyField"]>;
            default: () => string;
        };
        rowConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.RowConfig>;
            default: () => {};
        };
        columns: {
            type: PropType<import("../DraggableTable/_types").ColumnType[]>;
            default: () => never[];
        };
        columnConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.ColumnConfig>;
            default: () => {};
        };
        virtualXConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.VirtualXConfig>;
            default: () => {};
        };
        virtualYConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.VirtualYConfig>;
            default: () => {};
        };
        menuConfigColumn: {
            type: BooleanConstructor;
            default: boolean;
        };
        menuConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.MenuConfig>;
            default: () => {};
        };
        sortable: {
            type: BooleanConstructor;
            default: boolean;
        };
        sortConfig: {
            type: PropType<import("vxe-table").VxeTablePropTypes.SortConfig>;
            default: () => {};
        };
        modelValue: {
            type: globalThis.PropType<unknown[]>;
        };
    }>> & Readonly<{
        "onUpdate:modelValue"?: ((value: unknown[]) => any) | undefined;
        "onUpdate:tableData"?: ((...args: any[]) => any) | undefined;
        onColumnDragend?: ((...args: any[]) => any) | undefined;
        onRowDragend?: ((...args: any[]) => any) | undefined;
        onResizableChange?: ((...args: any[]) => any) | undefined;
        onCheckboxChange?: ((...args: any[]) => any) | undefined;
        onCheckboxAll?: ((...args: any[]) => any) | undefined;
        onHeaderCellMenu?: ((...args: any[]) => any) | undefined;
    }>, {
        getTable: () => import("vxe-table").VxeGridInstance | null;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:tableData": (...args: any[]) => void;
        columnDragend: (...args: any[]) => void;
        rowDragend: (...args: any[]) => void;
        resizableChange: (...args: any[]) => void;
        checkboxChange: (...args: any[]) => void;
        checkboxAll: (...args: any[]) => void;
        headerCellMenu: (...args: any[]) => void;
        "update:modelValue": (value: unknown[]) => void;
    }, string, {
        columns: import("../DraggableTable/_types").ColumnType[];
        editable: boolean;
        resizable: boolean;
        showOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
        showHeaderOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
        showFooterOverflow: import("vxe-table").VxeTablePropTypes.ShowOverflow;
        sortable: boolean;
        border: boolean;
        filterType: "filter" | "full";
        filterLayout: ("input" | "select" | "checkbox")[];
        filterable: boolean;
        autoResize: boolean;
        resizableConfig: import("vxe-table").VxeTablePropTypes.ResizableConfig<import("vxe-table").VxeTablePropTypes.Row>;
        editAutoFocus: boolean;
        editRules: import("vxe-table").VxeTablePropTypes.EditRules<any>;
        editConfig: import("vxe-table").VxeTablePropTypes.EditConfig<any>;
        filterConfig: import("vxe-table").VxeTablePropTypes.FilterConfig<import("vxe-table").VxeTablePropTypes.Row>;
        dragable: boolean;
        rowdragable: boolean;
        columndragable: boolean;
        dragType: string;
        rowDisabledClass: string;
        rowDragConfig: import("vxe-table").VxeTablePropTypes.RowDragConfig<any>;
        columnDragConfig: import("vxe-table").VxeTablePropTypes.ColumnDragConfig<any>;
        rowId: string | undefined;
        rowConfig: import("vxe-table").VxeTablePropTypes.RowConfig<any>;
        columnConfig: import("vxe-table").VxeTablePropTypes.ColumnConfig<any>;
        virtualXConfig: import("vxe-table").VxeTablePropTypes.VirtualXConfig;
        virtualYConfig: import("vxe-table").VxeTablePropTypes.VirtualYConfig;
        menuConfigColumn: boolean;
        menuConfig: import("vxe-table").VxeTablePropTypes.MenuConfig<any>;
        sortConfig: import("vxe-table").VxeTablePropTypes.SortConfig<import("vxe-table").VxeTablePropTypes.Row>;
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
        $slots: {
            [x: string]: ((props: {
                [key: string]: any;
                $table: import("vxe-table").VxeTableConstructor<any>;
                $grid: import("vxe-table").VxeGridConstructor<any> | null | undefined;
                rowid: string;
                row: any;
                rowIndex: number;
                $rowIndex: number;
                _rowIndex: number;
                column: VxeTableDefines.ColumnInfo<any>;
                columnIndex: number;
                $columnIndex: number;
                _columnIndex: number;
                type: string;
                fixed: import("vxe-table").VxeColumnPropTypes.Fixed;
                checked?: boolean;
                indeterminate?: boolean;
                seq: string | number;
                level: number;
                isEdit: boolean;
                isHidden: boolean;
                field: string;
                item: any;
                data: any;
                visibleData: any[];
                items: any[];
            }) => any) | undefined;
        };
    })) | null;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: unknown[]) => any;
} & {
    toggleTreeExpand: (params: VxeTableDefines.ToggleRowExpandEventParams<any>) => any;
    noNextInput: (params: NoNextInputParams) => any;
    noSelectValue: (params: NoSelectValueParams) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: unknown[]) => any) | undefined;
    onToggleTreeExpand?: ((params: VxeTableDefines.ToggleRowExpandEventParams<any>) => any) | undefined;
    onNoNextInput?: ((params: NoNextInputParams) => any) | undefined;
    onNoSelectValue?: ((params: NoSelectValueParams) => any) | undefined;
}>, {
    allowSelectNextInEmpty: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
