import type { PropType } from 'vue';
import type { VxeGridInstance, VxeTableConstructor, VxeTableDefines, VxeTablePropTypes } from 'vxe-table';
import type { ColumnType } from '@/components/DraggableTable/_types';
import './renderers';
declare var __VLS_15: string, __VLS_16: {
    [key: string]: any;
    $table: VxeTableConstructor<any>;
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
    [K in NonNullable<typeof __VLS_15>]?: (props: typeof __VLS_16) => any;
};
declare const __VLS_component: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    id: {
        type: StringConstructor;
    };
    /**
     * 是否显示表格边框
     */
    border: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 表格内容溢出隐藏并显示tooltip
     */
    showOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    /**
     * 头部溢出隐藏并显示tooltip
     */
    showHeaderOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    /**
     * 底部溢出隐藏并显示tooltip
     */
    showFooterOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    resizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否自动调整列宽
     */
    autoResize: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否允许列宽拖拽
     */
    /**
     * 列宽拖拽配置
     */
    resizableConfig: {
        type: PropType<VxeTablePropTypes.ResizableConfig>;
        default: () => {};
    };
    /**
     * 是否允许编辑
     */
    editable: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    /**
     * 触发编辑后是否自动聚焦
     */
    editAutoFocus: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    /**
     * 编辑规则
     */
    editRules: {
        type: PropType<VxeTablePropTypes.EditRules>;
        default: null;
    };
    /**
     * 编辑配置
     */
    editConfig: {
        type: PropType<VxeTablePropTypes.EditConfig>;
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
    /**
     * 筛选器布局配置，支持 input, checkbox, select
     * @default ['input', 'select']
     */
    filterLayout: {
        type: PropType<("input" | "checkbox" | "select")[]>;
        default: () => string[];
    };
    filterConfig: {
        type: PropType<VxeTablePropTypes.FilterConfig>;
        default: () => {};
    };
    dragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否启用行拖拽
     * @default false
     */
    rowdragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否启用列拖拽
     * @default false
     */
    columndragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 拖拽模式
     * vxe模式下，表格数据发生变化时整个表格会刷新key重新渲染，而draggable模式下不会重新渲染
     */
    dragType: {
        type: StringConstructor;
        default: () => string;
    };
    /**
     * 需要禁用拖拽的行class
     */
    rowDisabledClass: {
        type: StringConstructor;
        default: () => string;
    };
    /**
     * 行拖拽禁用方法
     */
    rowDragDisabledMethod: {
        type: FunctionConstructor;
    };
    /**
     * 行拖拽结束回调方法
     */
    rowDragEndMethod: {
        type: FunctionConstructor;
    };
    /**
     * 行拖拽配置对象
     * @default {}
     */
    rowDragConfig: {
        type: PropType<VxeTablePropTypes.RowDragConfig>;
        default: () => {};
    };
    /**
     * 列拖拽禁用方法
     */
    columnDragDisabledMethod: {
        type: FunctionConstructor;
    };
    /**
     * 列拖拽结束回调方法
     */
    columnDragEndMethod: {
        type: FunctionConstructor;
    };
    /**
     * 列拖拽配置对象
     * @default {}
     */
    columnDragConfig: {
        type: PropType<VxeTablePropTypes.ColumnDragConfig>;
        default: () => {};
    };
    /**
     * 行的唯一标识字段
     * @default '_X_ROW_KEY'
     */
    rowId: {
        type: PropType<VxeTablePropTypes.RowConfig["keyField"]>;
        default: () => string;
    };
    /**
     * 行配置对象
     * @default {}
     */
    rowConfig: {
        type: PropType<VxeTablePropTypes.RowConfig>;
        default: () => {};
    };
    /**
     * 列配置数组
     * @default []
     */
    columns: {
        type: PropType<ColumnType[]>;
        default: () => never[];
    };
    /**
     * 列配置对象
     * @type {object}
     * @default {}
     */
    columnConfig: {
        type: PropType<VxeTablePropTypes.ColumnConfig>;
        default: () => {};
    };
    /**
     * 列虚拟滚动配置
     */
    virtualXConfig: {
        type: PropType<VxeTablePropTypes.VirtualXConfig>;
        default: () => {};
    };
    /**
     * 行虚拟滚动配置
     */
    virtualYConfig: {
        type: PropType<VxeTablePropTypes.VirtualYConfig>;
        default: () => {};
    };
    /**
     * 头部右键菜单是否允许配置列隐藏显示
     */
    menuConfigColumn: {
        type: BooleanConstructor;
        default: boolean;
    };
    menuConfig: {
        type: PropType<VxeTablePropTypes.MenuConfig>;
        default: () => {};
    };
    sortable: {
        type: BooleanConstructor;
        default: boolean;
    };
    sortConfig: {
        type: PropType<VxeTablePropTypes.SortConfig>;
        default: () => {};
    };
    modelValue: {
        type: PropType<unknown[]>;
    };
}>, {
    getTable: () => VxeGridInstance | null;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:tableData": (...args: any[]) => void;
    columnDragend: (...args: any[]) => void;
    rowDragend: (...args: any[]) => void;
    resizableChange: (...args: any[]) => void;
    checkboxChange: (...args: any[]) => void;
    checkboxAll: (...args: any[]) => void;
    headerCellMenu: (...args: any[]) => void;
    "update:modelValue": (value: unknown[]) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    id: {
        type: StringConstructor;
    };
    /**
     * 是否显示表格边框
     */
    border: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 表格内容溢出隐藏并显示tooltip
     */
    showOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    /**
     * 头部溢出隐藏并显示tooltip
     */
    showHeaderOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    /**
     * 底部溢出隐藏并显示tooltip
     */
    showFooterOverflow: {
        type: PropType<VxeTablePropTypes.ShowOverflow>;
        default: boolean;
    };
    resizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否自动调整列宽
     */
    autoResize: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否允许列宽拖拽
     */
    /**
     * 列宽拖拽配置
     */
    resizableConfig: {
        type: PropType<VxeTablePropTypes.ResizableConfig>;
        default: () => {};
    };
    /**
     * 是否允许编辑
     */
    editable: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    /**
     * 触发编辑后是否自动聚焦
     */
    editAutoFocus: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    /**
     * 编辑规则
     */
    editRules: {
        type: PropType<VxeTablePropTypes.EditRules>;
        default: null;
    };
    /**
     * 编辑配置
     */
    editConfig: {
        type: PropType<VxeTablePropTypes.EditConfig>;
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
    /**
     * 筛选器布局配置，支持 input, checkbox, select
     * @default ['input', 'select']
     */
    filterLayout: {
        type: PropType<("input" | "checkbox" | "select")[]>;
        default: () => string[];
    };
    filterConfig: {
        type: PropType<VxeTablePropTypes.FilterConfig>;
        default: () => {};
    };
    dragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否启用行拖拽
     * @default false
     */
    rowdragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否启用列拖拽
     * @default false
     */
    columndragable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 拖拽模式
     * vxe模式下，表格数据发生变化时整个表格会刷新key重新渲染，而draggable模式下不会重新渲染
     */
    dragType: {
        type: StringConstructor;
        default: () => string;
    };
    /**
     * 需要禁用拖拽的行class
     */
    rowDisabledClass: {
        type: StringConstructor;
        default: () => string;
    };
    /**
     * 行拖拽禁用方法
     */
    rowDragDisabledMethod: {
        type: FunctionConstructor;
    };
    /**
     * 行拖拽结束回调方法
     */
    rowDragEndMethod: {
        type: FunctionConstructor;
    };
    /**
     * 行拖拽配置对象
     * @default {}
     */
    rowDragConfig: {
        type: PropType<VxeTablePropTypes.RowDragConfig>;
        default: () => {};
    };
    /**
     * 列拖拽禁用方法
     */
    columnDragDisabledMethod: {
        type: FunctionConstructor;
    };
    /**
     * 列拖拽结束回调方法
     */
    columnDragEndMethod: {
        type: FunctionConstructor;
    };
    /**
     * 列拖拽配置对象
     * @default {}
     */
    columnDragConfig: {
        type: PropType<VxeTablePropTypes.ColumnDragConfig>;
        default: () => {};
    };
    /**
     * 行的唯一标识字段
     * @default '_X_ROW_KEY'
     */
    rowId: {
        type: PropType<VxeTablePropTypes.RowConfig["keyField"]>;
        default: () => string;
    };
    /**
     * 行配置对象
     * @default {}
     */
    rowConfig: {
        type: PropType<VxeTablePropTypes.RowConfig>;
        default: () => {};
    };
    /**
     * 列配置数组
     * @default []
     */
    columns: {
        type: PropType<ColumnType[]>;
        default: () => never[];
    };
    /**
     * 列配置对象
     * @type {object}
     * @default {}
     */
    columnConfig: {
        type: PropType<VxeTablePropTypes.ColumnConfig>;
        default: () => {};
    };
    /**
     * 列虚拟滚动配置
     */
    virtualXConfig: {
        type: PropType<VxeTablePropTypes.VirtualXConfig>;
        default: () => {};
    };
    /**
     * 行虚拟滚动配置
     */
    virtualYConfig: {
        type: PropType<VxeTablePropTypes.VirtualYConfig>;
        default: () => {};
    };
    /**
     * 头部右键菜单是否允许配置列隐藏显示
     */
    menuConfigColumn: {
        type: BooleanConstructor;
        default: boolean;
    };
    menuConfig: {
        type: PropType<VxeTablePropTypes.MenuConfig>;
        default: () => {};
    };
    sortable: {
        type: BooleanConstructor;
        default: boolean;
    };
    sortConfig: {
        type: PropType<VxeTablePropTypes.SortConfig>;
        default: () => {};
    };
    modelValue: {
        type: PropType<unknown[]>;
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
    columns: ColumnType[];
    editable: boolean;
    resizable: boolean;
    showOverflow: VxeTablePropTypes.ShowOverflow;
    showHeaderOverflow: VxeTablePropTypes.ShowOverflow;
    showFooterOverflow: VxeTablePropTypes.ShowOverflow;
    sortable: boolean;
    border: boolean;
    filterType: "filter" | "full";
    filterLayout: ("input" | "select" | "checkbox")[];
    filterable: boolean;
    autoResize: boolean;
    resizableConfig: VxeTablePropTypes.ResizableConfig<VxeTablePropTypes.Row>;
    editAutoFocus: boolean;
    editRules: VxeTablePropTypes.EditRules<any>;
    editConfig: VxeTablePropTypes.EditConfig<any>;
    filterConfig: VxeTablePropTypes.FilterConfig<VxeTablePropTypes.Row>;
    dragable: boolean;
    rowdragable: boolean;
    columndragable: boolean;
    dragType: string;
    rowDisabledClass: string;
    rowDragConfig: VxeTablePropTypes.RowDragConfig<any>;
    columnDragConfig: VxeTablePropTypes.ColumnDragConfig<any>;
    rowId: string | undefined;
    rowConfig: VxeTablePropTypes.RowConfig<any>;
    columnConfig: VxeTablePropTypes.ColumnConfig<any>;
    virtualXConfig: VxeTablePropTypes.VirtualXConfig;
    virtualYConfig: VxeTablePropTypes.VirtualYConfig;
    menuConfigColumn: boolean;
    menuConfig: VxeTablePropTypes.MenuConfig<any>;
    sortConfig: VxeTablePropTypes.SortConfig<VxeTablePropTypes.Row>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
