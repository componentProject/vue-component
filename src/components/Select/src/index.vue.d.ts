declare const _default: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    tagType: {
        type: () => "success" | "info" | "warning" | "danger";
        default: string;
    };
    teleported: {
        type: BooleanConstructor;
        default: boolean;
    };
    clearable: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterable: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterMethod: {
        type: FunctionConstructor;
    };
    collapseTagsTooltip: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 展示下拉框的数据
     */
    label: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 下拉框选择的值
     */
    value: {
        type: StringConstructor;
        default: string;
    };
    disabledValues: {
        type: ArrayConstructor;
        default: () => never[];
    };
    disabledLabels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    disabledHandler: {
        type: FunctionConstructor;
    };
    /**
     * 下拉框数据
     */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    filterFields: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * 是否启用远程搜索
     *
     */
    serverProps: {
        type: ObjectConstructor;
    };
    modelValue: {
        type: globalThis.PropType<any>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any) => any;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    tagType: {
        type: () => "success" | "info" | "warning" | "danger";
        default: string;
    };
    teleported: {
        type: BooleanConstructor;
        default: boolean;
    };
    clearable: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterable: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterMethod: {
        type: FunctionConstructor;
    };
    collapseTagsTooltip: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 展示下拉框的数据
     */
    label: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 下拉框选择的值
     */
    value: {
        type: StringConstructor;
        default: string;
    };
    disabledValues: {
        type: ArrayConstructor;
        default: () => never[];
    };
    disabledLabels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    disabledHandler: {
        type: FunctionConstructor;
    };
    /**
     * 下拉框数据
     */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    filterFields: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * 是否启用远程搜索
     *
     */
    serverProps: {
        type: ObjectConstructor;
    };
    modelValue: {
        type: globalThis.PropType<any>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}>, {
    label: string;
    options: unknown[];
    teleported: boolean;
    clearable: boolean;
    value: string;
    tagType: "success" | "warning" | "info" | "danger";
    filterable: boolean;
    collapseTagsTooltip: boolean;
    collapseTags: boolean;
    disabledValues: unknown[];
    disabledLabels: unknown[];
    filterFields: unknown[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
