import type { DatePickerProps } from 'element-plus';
import type { Moment, unitOfTime } from 'moment';
import type { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    type: {
        type: () => DatePickerProps["type"];
        default: string;
        validator: (val: string) => boolean;
    };
    format: {
        type: StringConstructor;
        default: string;
    };
    valueFormat: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    startPlaceholder: {
        type: StringConstructor;
        default: string;
    };
    endPlaceholder: {
        type: StringConstructor;
        default: string;
    };
    rangeSeparator: {
        type: StringConstructor;
        default: string;
    };
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
    defaultDatetimeRange: {
        type: BooleanConstructor;
        default: null;
    };
    defaultToday: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 日期范围，可以是数字或数组
     * 正数表示当前日期往后n天（dateRangeType）
     * 负数表示往前n天（dateRangeType）
     * 数组[n,m]表示从前n天到后m天（dateRangeType）
     */
    dateRange: {
        type: PropType<number[] | number>;
        default: null;
    };
    /**
     * 日期范围类型
     * @default day
     */
    dateRangeType: {
        type: () => unitOfTime.DurationConstructor;
        default: string;
    };
    /**
     * 日期范围的基准日期
     * @default 当前日期
     */
    dateRangeBaseDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: Moment;
    };
    minDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: null;
    };
    maxDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: null;
    };
    disabledDateRange: {
        type: ArrayConstructor;
        default: null;
    };
    /**
     * datetime的时分秒禁用规则
     */
    datetimeDisableTypes: {
        type: ArrayConstructor;
        default: () => string[];
    };
    shortcuts: {
        type: (BooleanConstructor | ArrayConstructor)[];
        default: boolean;
    };
}>, {
    focus: () => any;
    blur: () => any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
    change: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    type: {
        type: () => DatePickerProps["type"];
        default: string;
        validator: (val: string) => boolean;
    };
    format: {
        type: StringConstructor;
        default: string;
    };
    valueFormat: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    startPlaceholder: {
        type: StringConstructor;
        default: string;
    };
    endPlaceholder: {
        type: StringConstructor;
        default: string;
    };
    rangeSeparator: {
        type: StringConstructor;
        default: string;
    };
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
    defaultDatetimeRange: {
        type: BooleanConstructor;
        default: null;
    };
    defaultToday: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 日期范围，可以是数字或数组
     * 正数表示当前日期往后n天（dateRangeType）
     * 负数表示往前n天（dateRangeType）
     * 数组[n,m]表示从前n天到后m天（dateRangeType）
     */
    dateRange: {
        type: PropType<number[] | number>;
        default: null;
    };
    /**
     * 日期范围类型
     * @default day
     */
    dateRangeType: {
        type: () => unitOfTime.DurationConstructor;
        default: string;
    };
    /**
     * 日期范围的基准日期
     * @default 当前日期
     */
    dateRangeBaseDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: Moment;
    };
    minDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: null;
    };
    maxDate: {
        type: (ObjectConstructor | StringConstructor)[];
        default: null;
    };
    disabledDateRange: {
        type: ArrayConstructor;
        default: null;
    };
    /**
     * datetime的时分秒禁用规则
     */
    datetimeDisableTypes: {
        type: ArrayConstructor;
        default: () => string[];
    };
    shortcuts: {
        type: (BooleanConstructor | ArrayConstructor)[];
        default: boolean;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    type: "month" | "year" | "date" | "months" | "years" | "dates" | "week" | "datetime" | "datetimerange" | "daterange" | "monthrange" | "yearrange";
    modelValue: unknown[];
    shortcuts: boolean | unknown[];
    format: string;
    valueFormat: string;
    placeholder: string;
    rangeSeparator: string;
    startPlaceholder: string;
    endPlaceholder: string;
    defaultDatetimeRange: boolean;
    defaultToday: boolean;
    dateRange: number | number[];
    dateRangeType: unitOfTime.DurationConstructor;
    dateRangeBaseDate: string | Record<string, any>;
    minDate: string | Record<string, any>;
    maxDate: string | Record<string, any>;
    disabledDateRange: unknown[];
    datetimeDisableTypes: unknown[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
