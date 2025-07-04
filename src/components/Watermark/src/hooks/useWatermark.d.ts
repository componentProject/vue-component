import type { ComputedRef } from 'vue';
import type { propsType } from '../types';
export type WatermarkType = Omit<propsType, 'className' | 'style' | 'children' | 'container'>;
interface WatermarkOptions extends WatermarkType {
    container?: ComputedRef<HTMLElement | undefined> | HTMLElement;
}
export declare function isNumber(obj: any): obj is number;
/**
 * 创建水印
 * 1. 可以选择传入挂载水印的容器元素，默认是 body
 * 2. 做了水印防御，能有效防御别人打开控制台删除或隐藏水印
 */
export default function useWatermark(params?: WatermarkOptions): {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => void;
};
export {};
