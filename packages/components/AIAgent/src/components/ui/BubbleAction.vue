<template>
    <div class="bubble-action">
        <button class="bubble-action__button" @click="handleOperation($event, 'replay')">
            <i class="ai-iconfont icon-refresh"></i>
        </button>
        <span class="bubble-action__refresh-line"></span>
        <button class="bubble-action__button" @click="handleOperation($event, 'copy')">
            <i class="ai-iconfont icon-copy"></i>
        </button>
        <span class="bubble-action__refresh-line"></span>
        <button
            class="bubble-action__button"
            :class="{ 'like-active': data.userFeedback == 1 }"
            @click="handleOperation($event, 'like')"
        >
            <i class="ai-iconfont icon-cc-thumbs-up"></i>
        </button>
        <span class="bubble-action__refresh-line"></span>
        <button
            class="bubble-action__button"
            :class="{ 'dislike-active': data.userFeedback == 2 }"
            @click="handleOperation($event, 'dislike')"
        >
            <i class="ai-iconfont icon-cc-thumbs-down"></i>
        </button>
        <slot></slot>
    </div>
</template>

<script>
import { copyValue } from './toast/index';
export default {
    name: 'BubbleAction',
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        handleOperation(e, type) {
            e.stopPropagation();
            if (type === 'copy') {
                copyValue(this.data.content);
            }
            this.$emit('operation', e, type, this.data);
        }
    }
};
</script>

<style lang="scss">
.bubble-action {
    margin-top: 16px;
    display: flex;
    justify-content: space-around;
    margin-left: 50px;
    width: 140px;
    background-color: #f3f3f3;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #eee;
    .bubble-action__button {
        font-size: 16px;
        font-weight: bold;
        border: none;
        color: #606266;
        cursor: pointer;
        i:hover {
            opacity: 0.6;
        }
    }
    .like-active {
        color: #3a77ff;
    }
    .dislike-active {
        color: #f56c6c;
    }
    .bubble-action__refresh-line {
        width: 1px;
        height: 16px;
        background-color: #e7e7e7;
        margin-right: 4px;
    }
}
</style>
