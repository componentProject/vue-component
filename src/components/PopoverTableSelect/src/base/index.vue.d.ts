import type { InputInstance } from 'element-plus';
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';
import type { VxeTablePropTypes } from 'vxe-table';
import type { ColumnType } from '@/components/DraggableTable/_types';
declare var __VLS_6: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_6) => any;
};
declare const __VLS_component: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    virtualRef: {
        type: () => ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null;
        required: true;
    };
    placement: {
        type: StringConstructor;
        default: string;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    id: {
        type: StringConstructor;
        default: string;
    };
    columns: {
        type: () => ColumnType[];
        default: () => never[];
    };
    data: {
        type: () => VxeTablePropTypes.Data;
        default: () => never[];
    };
    modelValue: {
        type: globalThis.PropType<boolean>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    select: (row: VxeTablePropTypes.Row) => any;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    virtualRef: {
        type: () => ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null;
        required: true;
    };
    placement: {
        type: StringConstructor;
        default: string;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    id: {
        type: StringConstructor;
        default: string;
    };
    columns: {
        type: () => ColumnType[];
        default: () => never[];
    };
    data: {
        type: () => VxeTablePropTypes.Data;
        default: () => never[];
    };
    modelValue: {
        type: globalThis.PropType<boolean>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onSelect?: ((row: VxeTablePropTypes.Row) => any) | undefined;
}>, {
    id: string;
    width: string | number;
    data: VxeTablePropTypes.Data<VxeTablePropTypes.Row>;
    placement: string;
    columns: ColumnType[];
    height: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
