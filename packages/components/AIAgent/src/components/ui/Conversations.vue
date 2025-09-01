<template>
    <div class="conversations-container" id="tsAiAgent-conversations-container">
        <div class="conversations-header">
            <span>历史对话</span>
        </div>
        <div class="conversations-content">
            <div class="conversations-items" :style="{ pointerEvents: isStreamLoad ? 'none' : 'auto' }">
                <!-- <div class="history-item" v-if="isStreamLoad">回答生成中...</div> -->
                <div
                    class="conversations-item"
                    :class="{ active: activeId === item.conversationId }"
                    v-for="item in items"
                    :key="item.conversationId"
                    @click="handleClick(item)"
                >
                    <div class="conversations-item-content">{{ item.title }}</div>
                </div>
            </div>
            <div class="conversations-item-empty" v-if="items.length === 0">
                <div class="conversations-item-empty-text">暂无历史对话</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Conversations',
    props: {
        items: {
            type: Array,
            default: () => []
        },
        activeId: {
            type: String,
            default: ''
        },
        isStreamLoad: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async handleClick(item) {
            this.$emit('update:activeId', item.conversationId);
            this.$emit('change', item);
        }
    }
};
</script>

<style lang="scss">
.conversations-container {
    width: 160px;
    border-left: 1px solid #e3e6e9;
    padding: 8px 0 8px 8px;
    display: flex;
    flex-direction: column;
    .conversations-header {
        font-size: 12px;
        color: #999;
        margin: 0 8px 8px 4px;
    }
    .conversations-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        .conversations-items {
            padding-right: 10px;
            .conversations-item {
                height: 32px;
                padding: 0 8px;
                margin-bottom: 2px;
                color: #606266;
                display: flex;
                align-items: center;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                &.active {
                    background-color: #f5f7fa;
                }
                &:hover {
                    background-color: #f5f7fa;
                }

                .conversations-item-content {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .conversations-item-empty {
            text-align: center;
            margin-top: 60px;
            font-size: 14px;
            color: #999;
        }
    }
}
</style>
