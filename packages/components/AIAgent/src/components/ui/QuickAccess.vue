<template>
    <div class="tabs-container">
        <div class="tabs">
            <div class="tab-item" :class="{ active: currentTab === '全部' }" @click="handleTabClick({ id: '全部' })">
                <i class="ai-iconfont icon-tubiao_-"></i>
                全部
            </div>

            <div
                class="tab-item"
                :class="{ active: currentTab === item.id }"
                v-for="(item, index) in tabList"
                :key="item.id"
                @click="handleTabClick(item)"
            >
                <i :class="'iconfont ' + iconList[index]"></i>
                {{ item.name }}
            </div>
        </div>
        <div style="height: 12px"></div>
    </div>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        tabList: {
            type: Array,
            default: () => []
        },
        currentTab: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            iconList: [
                'icon-yiliaoweisheng-',
                'icon-yiliao',
                'icon-sharpicons_medical-note',
                'icon-yiliao_yiliaowendang'
            ]
        };
    },
    methods: {
        handleTabClick(item) {
            this.$emit('update:currentTab', item.id);
            // this.$emit('change', item);
        }
    }
};
</script>
<style scoped lang="scss">
.tabs-container {
    padding: 0 16px 4px 16px;
    overflow-x: auto;
    overflow: hidden;
    .tabs {
        white-space: nowrap;
        text-align: center;
        .tab-item {
            height: 30px;
            padding: 0 12px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
            border: 1px solid #e5e5e5;
            color: #333;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
            margin-right: 10px;
            i {
                margin-right: 4px;
                font-size: 13px;
            }
            &:hover {
                background-color: rgba(#3a77ff, 0.1);
                border-color: #3a77ff;
                color: #3a77ff;
            }
            &.active {
                background-color: #3a77ff;
                color: #fff;
                border-color: #3a77ff;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
