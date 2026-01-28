/**
 * ConfigForm - 类型索引
 * 统一导出所有类型
 */

// UI 适配器类型
export type {
  ComponentRegistry,
  CreateAdapterOptions,
  FeedbackComponents,
  FieldComponents,
  IconComponents,
  LayoutComponents,
  MessageBoxFeedback,
  MessageFeedback,
  OptionsRenderer,
  OptionsRendererProps,
  PropsTransformer,
  PropsTransformFn,
  UIAdapter,
} from './adapter'
// 常量类型
export type {
  DisplayType,
  HandlerEventType,
  LayoutType,
  PatternType,
} from './constants'

export {
  DISPLAY_OPTIONS,
  HANDLER_EVENT_OPTIONS,
  LAYOUT_OPTIONS,
  PATTERN_OPTIONS,
} from './constants'

// 数据源类型
export type {
  ApiConfig,
  ApiDataSource,
  CacheConfig,
  CascadeDataSource,
  ComputedDataSource,
  DataSourceConfig,
  DataSourceState,
  DataTransformer,
  DictDataSource,
  FieldNames,
  OptionItem,
  StaticDataSource,
  TransformerRegistry,
} from './dataSource'

// Emits 类型
export type { emitsType } from './emits'

// 表达式类型
export type {
  AsyncExpression,
  ComputedExpression,
  Expression,
  ExpressionContext,
  ExpressionObject,
  ExpressionUtils,
  FieldState,
  FormState,
  FunctionExpression,
  MaybeExpression,
  SimpleExpression,
  TemplateExpression,
} from './expression'

// 字段类型
export type {
  ArrayFieldConfig,
  ArrayOperations,
  BaseFieldConfig,
  BasicFieldType,
  CardFieldConfig,
  ColConfig,
  CollapseFieldConfig,
  CollapsePanel,
  ComplexFieldType,
  CustomFieldConfig,
  FieldConfig,
  FieldType,
  GroupFieldConfig,
  ObjectFieldConfig,
  SelectFieldConfig,
  TabPane,
  TabsFieldConfig,
  UploadConfig,
  UploadFieldConfig,
  VoidFieldConfig,
  VoidFieldType,
} from './field'

// 表单类型
export type {
  FormContext,
  FormInstance,
  FormLayout,
  FormPermissions,
  FormResetConfig,
  FormSchema,
  FormSubmitConfig,
  HandlerContext,
  HandlerEvent,
  HandlerFunction,
  SubmitTransformer,
} from './form'

// Props 类型
export type {
  DictLoader,
  PermissionChecker,
  propsType,
  RequestAdapter,
} from './props'

// 联动类型
export type {
  CallFunctionAction,
  ClearValidateAction,
  ConditionalAction,
  DelayAction,
  EffectConfig,
  EmitAction,
  FieldReaction,
  NotifyAction,
  PatchValueAction,
  ReactionAction,
  ReactionContext,
  ReactionStateConfig,
  RequestAction,
  ResetAction,
  SetValueAction,
  TargetReaction,
  ValidateAction,
} from './reaction'

// Slots 类型
export type {
  ActionsSlotParams,
  FieldSlotParams,
  slotsType,
} from './slots'

// 校验类型
export type {
  AsyncValidatorFunction,
  AsyncValidatorRule,
  EnumRule,
  ExpressionRule,
  FieldValidationResult,
  FormatRule,
  FormValidationResult,
  LengthRule,
  MaxLengthRule,
  MaxRule,
  MinLengthRule,
  MinRule,
  PatternRule,
  RemoteValidatorConfig,
  RemoteValidatorRule,
  RequiredRule,
  ValidationRule,
  ValidationTrigger,
  ValidatorContext,
  ValidatorFunction,
  ValidatorRegistry,
  ValidatorRule,
  WhitespaceRule,
} from './validation'
