declare var __VLS_14: string, __VLS_15: {};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_14>]?: (props: typeof __VLS_15) => any;
};
declare const __VLS_component: import("vue").DefineComponent<globalThis.ExtractPropTypes<{
    tabCard: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabList: {
        type: {
            (arrayLength: number): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            (...items: {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[]): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            new (arrayLength: number): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            new (...items: {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[]): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
            from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
            from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
            of<T>(...items: T[]): T[];
            fromAsync<T>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>;
            fromAsync<T, U>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>, mapFn: (value: Awaited<T>, index: number) => U, thisArg?: any): Promise<Awaited<U>[]>;
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
    };
    modelValue: {
        type: globalThis.PropType<string>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    tabChange: (...args: any[]) => void;
    "update:modelValue": (value: string) => void;
}, string, import("vue").PublicProps, Readonly<globalThis.ExtractPropTypes<{
    tabCard: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabList: {
        type: {
            (arrayLength: number): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            (...items: {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[]): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            new (arrayLength: number): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            new (...items: {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[]): {
                id: string;
                label: string;
                slot?: string;
                lazy?: boolean;
                show?: (item: any) => boolean;
            }[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
            from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
            from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
            of<T>(...items: T[]): T[];
            fromAsync<T>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>;
            fromAsync<T, U>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>, mapFn: (value: Awaited<T>, index: number) => U, thisArg?: any): Promise<Awaited<U>[]>;
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
    };
    modelValue: {
        type: globalThis.PropType<string>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onTabChange?: ((...args: any[]) => any) | undefined;
}>, {
    tabCard: boolean;
    tabList: {
        id: string;
        label: string;
        slot?: string;
        lazy?: boolean;
        show?: (item: any) => boolean;
    }[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
