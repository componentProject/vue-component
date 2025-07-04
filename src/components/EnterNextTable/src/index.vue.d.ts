import type { noNextInputParams } from '@/components/EnterNextTable/_types';
interface noSelectValueParams {
    row: any;
    rowIndex: number;
    colIndex: number;
}
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    data: {
        type: ArrayConstructor;
        default: () => never[];
    };
    allowSelectNextInEmpty: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    refreshRows: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    noNextInput: (args_0: noNextInputParams) => any;
    noSelectValue: (args_0: noSelectValueParams) => any;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    data: {
        type: ArrayConstructor;
        default: () => never[];
    };
    allowSelectNextInEmpty: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onNoNextInput?: ((args_0: noNextInputParams) => any) | undefined;
    onNoSelectValue?: ((args_0: noSelectValueParams) => any) | undefined;
}>, {
    data: unknown[];
    allowSelectNextInEmpty: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
