declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & (new () => {
    $slots: S;
});
declare const __VLS_component: import("vue").DefineComponent<{}, {
    getTable: () => any;
    $emit: (event: "select" | "checkboxChange" | "checkboxAll" | "cellClick" | "selectAll" | "selectionChange" | "rowClick", ...args: any[]) => void;
    id: string;
    columns: unknown[];
    $props: {
        readonly id?: string | undefined;
        readonly columns?: unknown[] | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
type __VLS_Slots = {
    [x: string]: ((props: any) => any) | undefined;
} & {
    default?: ((props: {}) => any) | undefined;
};
