<template>
    <div class="chat-agent-header">
        <div class="back-btn" @click="handleBack">
            <i class="ai-iconfont icon-arrow-left"></i>
        </div>
        <div style="flex: 1; margin-left: 8px">
            {{ agent.appName }}
            <i class="ai-iconfont icon-star1" style="color: #ffd100" v-if="isStar == 2" @click="handleStar"></i>
            <i class="ai-iconfont icon-star" v-else @click="handleStar"></i>
        </div>
        <TipsPopover
            @about-click="handleAboutClick"
            @notice-click="handleNoticeClick"
            @shepherd-click="handleShepherdClick"
        />
    </div>
</template>
<script>
import TipsPopover from './TipsPopover.vue';
export default {
    name: 'chatAgentHeader',
    components: {
        TipsPopover
    },
    props: {
        agent: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isStar: this.agent.agentInfo.collectFlag
        };
    },
    methods: {
        handleBack() {
            this.$emit('back');
        },
        async handleStar() {
            this.$emit('star', this.isStar == 1 ? 2 : 1);
            this.isStar = this.isStar == 1 ? 2 : 1;
        },
        handleAboutClick() {
            this.$emit('about-click');
        },
        handleNoticeClick() {
            this.$emit('notice-click');
        },
        handleShepherdClick() {
            this.$emit('shepherd-click');
        }
    }
};
</script>
<style lang="scss" scoped>
.chat-agent-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.icon-star,
.icon-star1 {
    margin-left: 8px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.2s ease;
    &:hover {
        transform: scale(1.1);
        color: #ffd100;
    }
}
</style>
