import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';
interface Props {
    virtualRef?: ComponentPublicInstance | ComponentInternalInstance | HTMLElement | null;
    /**
     * 是否允许在select没有选中值时跳转
     */
    allowSelectNextInEmpty?: boolean;
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    noNextInput: (element: HTMLElement) => any;
    noSelectValue: (element: HTMLElement) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onNoNextInput?: ((element: HTMLElement) => any) | undefined;
    onNoSelectValue?: ((element: HTMLElement) => any) | undefined;
}>, {
    virtualRef: ComponentPublicInstance | ComponentInternalInstance | HTMLElement | null;
    allowSelectNextInEmpty: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
