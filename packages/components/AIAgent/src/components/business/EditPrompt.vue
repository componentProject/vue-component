<template>
    <div class="edit-prompt">
        <div class="edit-prompt-textarea">
            <textarea
                class="edit-prompt-textarea__inner"
                placeholder="请输入提示词..."
                v-model="inputValue"
                @input="adjustHeight"
                :style="{ maxHeight: `${6 * lineHeight}px` }"
                ref="promptTextarea"
            ></textarea>
        </div>
        <div class="edit-prompt-bottom">
            <div class="edit-prompt-button" @click="handleSave">保存</div>
            <div class="edit-prompt-button edit-prompt-button-cancel" @click="handleCancel">取消</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatInput',
    data() {
        return {
            inputValue: '',
            lineHeight: 22,
            rows: 2
        };
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        data: {
            handler(newVal) {
                if (newVal) {
                    this.inputValue = newVal.wordContent || '';
                    this.$nextTick(() => {
                        this.adjustHeight();
                    });
                }
            },
            immediate: true
        }
    },
    methods: {
        adjustHeight() {
            const target = this.$refs.promptTextarea;
            if (!target) return;
            target.style.height = 'auto';
            let rows = Math.floor(target.scrollHeight / this.lineHeight);
            this.rows = rows < 2 ? 2 : rows > 6 ? 6 : rows;
            target.style.height = `${this.rows * this.lineHeight}px`;
        },
        handleSave() {
            if (this.inputValue.trim() === '') {
                this.$message.error('提示词不能为空');
                return;
            }
            this.$emit('save', this.inputValue);
        },
        handleCancel() {
            this.$emit('cancel');
        }
    }
};
</script>

<style lang="scss">
.edit-prompt {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:focus-within {
        border-color: #3a77ff;
        box-shadow: 0 4px 16px rgba(58, 119, 255, 0.1);
    }

    .edit-prompt-textarea {
        border-radius: 12px 12px 0 0;
        overflow: hidden;
        .edit-prompt-textarea__inner {
            border: none;
            outline: none;
            padding: 12px 16px 6px;
            resize: none;
            scrollbar-width: none;
            height: 44px;
            line-height: 22px;
            width: 100%;
            box-sizing: border-box;
            font-size: 15px;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

            &::placeholder {
                color: #a0aec0;
            }

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    .edit-prompt-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        justify-content: flex-end;
        padding: 8px 16px 12px;

        .edit-prompt-button {
            padding: 4px 10px;
            border: 1px solid #3a77ff;
            margin-left: 8px;
            border-radius: 6px;
            color: #3a77ff;
            cursor: pointer;

            &:hover {
                background-color: #2c6bff;
                color: #fff;
            }

            &:active {
                transform: translateY(0);
            }
            &-cancel {
                color: #909399;
                border: 1px solid #909399;
                &:hover {
                    background-color: #909399;
                    border-color: #909399;
                    color: #fff;
                }
            }
        }
    }
}
</style>
