import 'md-editor-v3/lib/style.css';
import type { eventsType, propsType, slotsType } from './types';
type __VLS_Props = propsType & eventsType;
type __VLS_Slots = slotsType;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    on<E extends keyof import("md-editor-v3").ExposeEvent, C extends import("md-editor-v3").ExposeEvent[E]>(eventName: E, callBack: C): void;
    togglePageFullscreen(status?: boolean): void;
    toggleFullscreen(status?: boolean): void;
    togglePreview(status?: boolean): void;
    togglePreviewOnly(status?: boolean): void;
    toggleHtmlPreview(status?: boolean): void;
    toggleCatalog(status?: boolean): void;
    triggerSave(): void;
    insert: import("md-editor-v3").Insert;
    focus(options?: import("md-editor-v3").FocusOption): void;
    rerender(): void;
    getSelectedText(): string | undefined;
    resetHistory(): void;
    domEventHandlers(handlers: import("md-editor-v3").DOMEventHandlers): void;
    execCommand(direct: import("md-editor-v3/lib/types/MdEditor/utils/content-help").ToolDirective): void;
    getEditorView(): import("@codemirror/view").EditorView | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    id: string;
    theme: import("md-editor-v3").EditorProps["theme"];
    previewTheme: import("md-editor-v3").EditorProps["previewTheme"];
    codeTheme: import("md-editor-v3").EditorProps["codeTheme"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
