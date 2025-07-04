declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & (new () => {
    $slots: S;
});
declare const __VLS_component: import("vue").DefineComponent<{}, {
    columns: unknown[];
    tableData: unknown[];
    fileName: string;
    buttonText: string;
    exportType: string;
    sheetName: string;
    autoWidth: boolean;
    allowEmptyExport: boolean;
    emptyMessage: string;
    $props: {
        readonly columns?: unknown[] | undefined;
        readonly tableData?: unknown[] | undefined;
        readonly fileName?: string | undefined;
        readonly buttonText?: string | undefined;
        readonly exportType?: string | undefined;
        readonly sheetName?: string | undefined;
        readonly autoWidth?: boolean | undefined;
        readonly allowEmptyExport?: boolean | undefined;
        readonly emptyMessage?: string | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
type __VLS_Slots = {
    default?: ((props: {}) => any) | undefined;
};
