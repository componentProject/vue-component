<template>
    <div class="agent-card">
        <div class="item-icon">
            <i class="ai-iconfont icon-robot" v-if="!logo"></i>
            <img :src="logo" alt="图标" v-else />
        </div>
        <div class="item-info">
            <div class="info-header">
                <div class="item-name">{{ name }}</div>
                <div class="item-star" @click.stop="handleStar">
                    <i class="ai-iconfont icon-star1" v-if="isCollect"></i>
                    <i class="ai-iconfont icon-star" v-else></i>
                </div>
            </div>
            <div class="item-description" :title="description">{{ description }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AgentCard',
    props: {
        logo: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        isCollect: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleStar() {
            this.$emit('toggleCollect');
        }
    }
};
</script>
<style scoped lang="scss">
.agent-card {
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 12px;
    display: flex;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.03);
    margin: 1px;
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
        border-color: #3a77ff;
    }
    .item-icon {
        width: 64px;
        height: 64px;
        font-size: 32px;
        border-radius: 10px;
        overflow: hidden;
        background: linear-gradient(135deg, #e6f0ff, #f0f5ff);
        color: #3a77ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        transition: all 0.2s ease;
        i {
            font-size: 32px;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .item-info {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .info-header {
            display: flex;
            color: #1a2233;
            justify-content: space-between;
            .item-name {
                font-size: 15px;
                font-weight: 500;
                word-break: break-all;
                white-space: pre-wrap;
            }
            .item-star {
                margin-left: 8px;
                .icon-star,
                .icon-star1 {
                    color: #8c94a6;
                    font-size: 20px;
                    transition: all 0.2s ease;
                    &:hover {
                        color: #ffd100;
                    }
                }
                .icon-star1 {
                    color: #ffd100;
                }
            }
        }
        .item-description {
            margin-bottom: 4px;
            font-size: 13px;
            color: #6b7a90;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
