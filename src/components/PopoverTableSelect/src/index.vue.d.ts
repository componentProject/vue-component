import type { InputInstance, InputProps } from 'element-plus';
import type { ComponentInternalInstance, ComponentPublicInstance, PropType } from 'vue';
declare var __VLS_5: string, __VLS_6: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_5>]?: (props: typeof __VLS_6) => any;
};
declare const __VLS_component: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    debounce: {
        type: NumberConstructor;
        default: number;
    };
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    popType: {
        type: PropType<"default" | "input">;
        default: string;
    };
    inputProps: {
        type: PropType<InputProps>;
        default: () => {};
    };
    inputValue: {
        type: StringConstructor;
        default: string;
    };
    virtualRef: {
        type: () => ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null;
        default: null;
    };
    modelValue: {
        type: PropType<boolean>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: (...args: any[]) => void;
    focus: (...args: any[]) => void;
    "update:modelValue": (value: boolean) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    debounce: {
        type: NumberConstructor;
        default: number;
    };
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    popType: {
        type: PropType<"default" | "input">;
        default: string;
    };
    inputProps: {
        type: PropType<InputProps>;
        default: () => {};
    };
    inputValue: {
        type: StringConstructor;
        default: string;
    };
    virtualRef: {
        type: () => ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null;
        default: null;
    };
    modelValue: {
        type: PropType<boolean>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onInput?: ((...args: any[]) => any) | undefined;
    onFocus?: ((...args: any[]) => any) | undefined;
}>, {
    virtualRef: ComponentInternalInstance | HTMLElement | ComponentPublicInstance | InputInstance | null;
    throttle: number;
    debounce: number;
    popType: "default" | "input";
    inputProps: InputProps;
    inputValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
