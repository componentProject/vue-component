<template>
    <div class="bubble" :class="role">
        <div class="bubble-container">
            <div class="bubble-inner">
                <div class="bubble-avatar">
                    <i class="ai-iconfont icon-user" v-if="role === 'user'"></i>
                    <i class="ai-iconfont icon-robot" v-if="['assistant', 'error'].includes(role)"></i>
                </div>
                <div class="bubble-content" v-if="textLoading">
                    <div class="bubble-content-skeleton">
                        <div class="skeleton-block"></div>
                        <div class="skeleton-block"></div>
                        <div class="skeleton-block"></div>
                    </div>
                </div>
                <div class="bubble-content" v-else>
                    <div class="bubble-content-text markdown-body" v-html="content" v-if="role === 'assistant'"></div>
                    <div class="bubble-content-text error" v-else-if="role === 'error'">{{ content }}</div>
                    <div class="bubble-content-text user" v-else>{{ content }}</div>
                    <div class="bubble-tip" v-if="role === 'assistant'">本回答由AI生成，内容仅供参考，请仔细甄别。</div>
                </div>
            </div>
            <slot name="actions" v-if="role === 'assistant'"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Bubble',
    props: {
        content: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            default: ''
        },
        textLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss">
.bubble {
    margin-bottom: 40px;
    display: flex;
    font-size: 14px;

    &:first-child {
        margin-bottom: 16px;
    }

    .bubble-container {
        display: flex;
        flex-direction: column;
        width: 100%;

        .bubble-inner {
            display: flex;
        }
    }

    .bubble-avatar {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        overflow: hidden;
        margin-right: 12px;
        background-color: #f0f5ff;
        color: #3a77ff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        i {
            font-size: 20px;
        }
    }

    .bubble-content {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .bubble-content-text {
            width: 100%;
            border-radius: 12px;
            box-sizing: border-box;
            color: #333;
            line-height: 1.8;
            font-size: 15px;
            white-space: normal;
            .hljs code {
                white-space: pre-wrap;
            }
            h1 {
                font-size: 20px;
            }
            h2 {
                font-size: 18px;
            }
            h3 {
                font-size: 16px;
            }
            h4 {
                font-size: 14px;
            }
            h5 {
                font-size: 12px;
            }
            h6 {
                font-size: 10px;
            }
        }

        .bubble-content-text.error {
            border-radius: 8px;
            color: #e53e3e;
            background-color: #fff5f5;
            border-left: 3px solid #e53e3e;
            display: flex;
            align-items: center;
            padding: 0 10px;
        }

        .bubble-tip {
            border: 1px solid #e6a23c;
            font-size: 12px;
            color: #e6a23c;
            background-color: rgb(253, 246, 236);
            margin-top: 10px;
            padding: 4px 8px;
            border-radius: 4px;
            width: fit-content;
            display: inline-block;
        }
    }

    &.assistant {
        .bubble-avatar {
            background-color: #ebf8ff;
            color: #3182ce;
        }

        .bubble-content-text {
            border-radius: 12px;
            background-color: #fff;
        }
    }

    &.error {
        .bubble-avatar {
            background-color: #fff5f5;
            color: #e53e3e;
        }
    }
}

.bubble.user {
    flex-direction: row-reverse;
    margin-bottom: 24px;

    .bubble-avatar {
        margin-left: 12px;
        margin-right: 0;
        background-color: #ebf8ff;
        color: #3182ce;
    }

    .bubble-content {
        justify-content: flex-end;
        flex: 1;
        .bubble-content-text {
            width: auto;
        }
    }

    .bubble-inner {
        flex-direction: row-reverse;

        .bubble-content-text {
            padding: 10px 16px;
            border-bottom-right-radius: 4px;
            background-color: #e6f7ff;
            color: #1a202c;
        }
    }
}

.bubble-content-skeleton {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .skeleton-block {
        height: 16px;
        background-color: #e6ebef;
        margin: 8px 0;
        border-radius: 6px;
        animation: pulse 1.5s infinite ease-in-out;

        &:first-child {
            width: 90%;
        }

        &:nth-child(2) {
            width: 75%;
        }

        &:last-child {
            width: 60%;
        }
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.6;
    }
    50% {
        opacity: 0.3;
    }
}
</style>
