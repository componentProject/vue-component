import type { App, PropType, Plugin, Ref, VNode, SlotsType, CSSProperties } from 'vue'
import type { VueTypesInterface, VueTypeValidableDef } from 'vue-types'

declare type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void;

export type VueNode = VNodeChildAtom | VNodeChildAtom[] | VNode;
export type propTypes = VueTypesInterface & {
  readonly looseBool
    :
    VueTypeValidableDef<boolean>;
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VueNode: VueTypeValidableDef<VueNode>;
}
