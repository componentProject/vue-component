<template>
    <div class="params-panel-overlay" v-if="visible">
        <div class="params-panel">
            <div class="params-panel-header">
                <div class="params-panel-header-title">参数</div>
                <div class="params-panel-close" @click="handleClose">
                    <i class="ai-iconfont icon-times"></i>
                </div>
            </div>
            <div class="params-panel-content">
                <div class="params-panel-content-item" v-for="param in params" :key="param.id">
                    <div class="params-panel-content-item-title">
                        {{ param.paramExplain || param.paramName }}
                        <span class="required-icon" v-if="param.isRequired == 1">*</span>
                    </div>
                    <div class="params-panel-content-item-input">
                        <input type="text" v-model="param.paramValue" />
                    </div>
                </div>

                <div class="params-panel-actions">
                    <button class="submit-btn" @click="handleSubmit">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { $toast } from '../ui/toast';
export default {
    name: 'ParamsPanel',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        params: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false);
        },
        async handleSubmit() {
            this.$emit('update:visible', false);
        }
    }
};
</script>

<style lang="scss" scoped>
.params-panel {
    width: 400px;
    max-height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;

    .params-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        border-bottom: 1px solid #e6e8eb;
        background: #fafbfc;

        &-title {
            font-size: 16px;
            color: #333;
        }

        .params-panel-close {
            cursor: pointer;
            color: #666;
            font-size: 16px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            transition: all 0.2s ease;

            &:hover {
                background: #e6e8eb;
                color: #333;
            }
        }
    }

    .params-panel-content {
        padding: 16px 24px;
        overflow-y: auto;
        &-item {
            margin-bottom: 8px;
            &-title {
                font-size: 14px;
                color: #333;
                margin-bottom: 4px;
                .required-icon {
                    color: #ff4d4f;
                }
            }
            &-input {
                input {
                    width: 100%;
                    height: 32px;
                    padding: 0 4px;
                    outline: none;
                    border: 1px solid #e6e8eb;
                    border-radius: 4px;
                    &:focus-within {
                        border-color: #3a77ff;
                        box-shadow: 0 4px 16px rgba(58, 119, 255, 0.1);
                    }
                }
            }
        }
        .params-panel-actions {
            margin-top: 16px;
            display: flex;
            justify-content: center;

            button {
                height: 40px;
                width: 200px;
                border-radius: 12px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;

                &.submit-btn {
                    background: #3a77ff;
                    color: #fff;

                    &:hover {
                        background: #2c5dd0;
                    }
                }
            }
        }
    }
}
.params-panel-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
</style>
