import type { ComponentPublicInstance, PropType } from 'vue';
import type { ColumnType } from '@/components/DraggableTable/_types';
declare const _default: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    virtualRef: {
        type: PropType<ComponentPublicInstance | HTMLElement>;
    };
    columns: {
        type: PropType<ColumnType[]>;
        default: () => never[];
    };
    modelValue: {
        type: PropType<boolean>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    menuConfirm: (...args: any[]) => void;
    "update:modelValue": (value: boolean) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    virtualRef: {
        type: PropType<ComponentPublicInstance | HTMLElement>;
    };
    columns: {
        type: PropType<ColumnType[]>;
        default: () => never[];
    };
    modelValue: {
        type: PropType<boolean>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onMenuConfirm?: ((...args: any[]) => any) | undefined;
}>, {
    columns: ColumnType[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
