<template>
  <div
    v-if="configOption.token"
    class="ai-agent"
    :class="{ 'ai-agent-dragging': isDragging, 'drag-disabled': !drag }"
    data-v="1.7.7"
  >
    <!-- 浮动按钮 -->
    <FloatingButton
      @button-click="handleFloatingButtonClick"
      @drag-start="handleDragStart"
      @drag-end="handleDragEnd"
    />
    <!-- 浮动面板 -->
    <FloatingPanel
      :visible="isChatVisible"
      :drag="drag"
      @drag-start="handleDragStart"
      @drag-end="handleDragEnd"
      @resize-start="handleDragStart"
      @resize-end="handleDragEnd"
    >
      <UserNotice v-if="!isUserKnowNotice" @confirm="handleUserNoticeConfirm" />
      <!-- 浮动面板头部 -->
      <template v-if="isUserKnowNotice" #header>
        <div class="floating-panel-header-title">
          <div v-if="currentView == 'findAgent'">发现智能体</div>
          <div v-if="currentView == 'chatAgent'">
            <ChatAgentHeader
              :agent="currentAgent"
              @back="handleBack"
              @star="handleStar"
              @about-click="$refs.aboutMe.show(currentAgent, 'agent')"
              @notice-click="handleNoticeClick"
              @shepherd-click="handleShepherdClick"
            />
          </div>
          <div v-if="currentView == 'emrAgent'">
            <div class="back-btn" @click="handleBack">
              <i class="ai-iconfont icon-arrow-left" />
            </div>
            病历助手
          </div>
        </div>
        <!-- 阻止mousedown冒泡导致不可输入 -->
        <div v-if="currentView == 'findAgent'" class="floating-panel-header-search" @mousedown.stop>
          <input
            id="tsAiAgent-find-agent-search"
            v-model="searchValue"
            type="text"
            placeholder="搜索智能体"
          />
        </div>
        <TipsPopover
          v-if="currentView == 'findAgent'"
          @about-click="$refs.aboutMe.show(currentAgent, 'list')"
          @notice-click="isUserKnowNotice = false"
          @shepherd-click="handleShepherdClick"
        />

        <!-- 阻止mousedown冒泡导致不可点击 -->
        <div
          v-if="drag"
          class="floating-panel-header-close"
          @click="isChatVisible = false"
          @mousedown.stop
        >
          <i class="ai-iconfont icon-times" />
        </div>
      </template>

      <!-- 浮动面板内容 -->
      <template v-if="isUserKnowNotice" #content>
        <template v-if="currentView == 'findAgent'">
          <CategoryTabs
            :tab-list="categoryList"
            :current-tab="currentTab"
            @update:current-tab="currentTab = $event"
          />
          <div class="agent-list-container">
            <!-- 智能体列表 -->
            <div id="tsAiAgent-find-agent-list" class="agent-list">
              <AgentCard
                v-for="item in applicationList"
                :key="item.id"
                :logo="item.logo"
                :name="item.appName || ''"
                :description="item.description || ''"
                :is-collect="item.agentInfo.collectFlag == 2"
                @toggle-collect="handleToggleCollect(item)"
                @click.native="handleAgentClick(item)"
              />
            </div>
            <div v-if="applicationList.length === 0" class="agent-list-empty">
              <div class="agent-list-empty-text">暂无数据</div>
            </div>
          </div>
        </template>
        <template v-if="currentView == 'chatAgent'">
          <ChatAgent
            ref="chatAgent"
            :agent="currentAgent"
            :common-sys-data="commonSysData"
            @back="handleBack"
            @send="handleSend"
          />
          <QuickAccess :list="sourceApplicationList" @change="handleQuickAccessChange" />
        </template>
        <template v-if="currentView == 'emrAgent'">
          <TrasenEditor
            v-bind="emrManager ? emrManager.getTrasenEditorProps() : {}"
            ref="trasenEditor"
            v-on="emrManager ? emrManager.getTrasenEditorEvents() : {}"
          />
        </template>
      </template>

      <AboutMe ref="aboutMe" />
    </FloatingPanel>
  </div>
</template>

<script>
import FloatingPanel from "./components/ui/FloatingPanel.vue";
import FloatingButton from "./components/ui/FloatingButton.vue";
import UserNotice from "./components/ui/UserNotice.vue";
import CategoryTabs from "./components/ui/Tabs.vue";
import AgentCard from "./components/ui/AgentCard.vue";
import ChatAgent from "./components/business/ChatAgent.vue";
import ChatAgentHeader from "./components/ui/ChatAgentHeader.vue";
import TipsPopover from "./components/ui/TipsPopover.vue";
import TrasenEditor from "./components/emrAgent/components/TrasenEditor.vue";
import AboutMe from "./components/ui/AboutMe.vue";
import QuickAccess from "./components/ui/QuickAccess.vue";
import { $toast } from "./components/ui/toast";
import {
  changeAgentCollect,
  getDictPullDownList,
  getListAgentByApp,
  initApiConfig,
  initSignHeaders,
} from "./components/api/api";
import { ShepherdGuide } from "./components/shepherd/ShepherdGuide.js";
import { EmrManager } from "./components/emrAgent/EmrManager.js";

export default {
  name: "AIAgent",
  components: {
    FloatingPanel,
    FloatingButton,
    UserNotice,
    CategoryTabs,
    AgentCard,
    ChatAgent,
    ChatAgentHeader,
    TrasenEditor,
    AboutMe,
    QuickAccess,
    TipsPopover,
  },
  provide() {
    return {
      token: this.option.token,
    };
  },

  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
    drag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      configOption: { ...this.option },
      currentView: "findAgent", // 当前视图 findAgent: 发现智能体, chatAgent: 星助手,   emrAgent: 病历助手
      searchValue: "", // 搜索值
      isChatVisible: false, // 是否显示浮动面板
      isUserKnowNotice: true, // 用户是否已知
      categoryList: [], // 智能体分类列表
      existCategory: [], // 已存在的分类
      currentTab: "全部", // 当前选中的分类
      sourceApplicationList: [], // 智能体列表原始数据
      currentAgent: {}, // 当前智能体
      currentUser: null,
      currentAgentId: "", // 当前智能体id
      curAiData: [], // 当前智能体数据
      isDragging: false, // 是否正在拖拽
      // 添加状态缓存
      agentStateCache: new Map(), // 用于缓存每个智能体的状态
      commonSysData: {}, // 公共系统数据
      shepherdGuide: null, // Shepherd 引导实例
      emrManager: null, // EMR 管理器实例
    };
  },
  computed: {
    applicationList() {
      return this.sourceApplicationList.filter((item) => {
        if (this.currentTab == "全部") {
          return item.appName.includes(this.searchValue);
        }
        if (this.currentTab == "收藏") {
          return item.agentInfo.collectFlag == 2 && item.appName.includes(this.searchValue);
        }
        return item.businessTypeId == this.currentTab && item.appName.includes(this.searchValue);
      });
    },
  },
  created() {
    initApiConfig({
      baseURL: this.option.baseURL || "",
      token: this.option.token,
    });
    if (localStorage.getItem("isShepherd")) {
      this.refreshAgentList();
    }

    // 初始化 Shepherd 引导实例
    this.shepherdGuide = new ShepherdGuide(this);

    // 初始化 EMR 管理器实例
    this.emrManager = new EmrManager(this);
  },
  beforeUnmount() {
    // 清理状态缓存
    this.clearAgentStateCache();

    // 销毁 Shepherd 引导实例
    if (this.shepherdGuide) {
      this.shepherdGuide.destroy();
      this.shepherdGuide = null;
    }

    // 销毁 EMR 管理器实例
    if (this.emrManager) {
      this.emrManager.destroy();
      this.emrManager = null;
    }
  },
  methods: {
    // 🎯 统一的事件发射器
    emitAction(action, payload = null) {
      this.$emit("on-action", {
        action,
        payload,
        timestamp: Date.now(),
        source: "AIAgent",
      });
    },

    // 🎯 统一的方法调用处理器
    handleAction(action, params = {}) {
      const actionMap = {
        setMonacoTemplate: () => this.emrManager.setMonacoTemplate(params.jsonData),
        createEmr: () =>
          this.emrManager.createEmr(params.jsonData, params.agentId, params.showChat),
        openAgent: () => this.openAgent(params.id),
        setCommonSysData: () => this.setCommonSysData(params.data),
        setCommonFunc: () => this.setCommonFunc(params),
      };
      if (actionMap[action]) {
        return actionMap[action]();
      } else {
        console.warn(`未知的 action: ${action}`);
      }
    },

    //点击浮动按钮
    handleFloatingButtonClick() {
      this.isChatVisible = !this.isChatVisible;

      if (this.isChatVisible && !localStorage.getItem("isShepherd")) {
        this.shepherdGuide.init();
        return;
      }
      if (this.isChatVisible && this.currentView == "findAgent") {
        this.refreshAgentList();
      }
    },
    // 用户已知提示
    handleUserNoticeConfirm() {
      this.isUserKnowNotice = true;
      this.currentView = "chatAgent";
      this.$nextTick(() => {
        this.restoreAgentState(this.currentAgent.agentInfo.id);
      });
    },
    // 获取智能体分类列表
    async getApplicationCategoryList() {
      const data = await getDictPullDownList("APPLICATION_TYPE");
      if (!data) return;
      this.categoryList = data.object.filter((item) => this.existCategory.includes(item.value));
    },
    // 获取智能体列表
    async getApplicationList() {
      const data = await getListAgentByApp();
      if (!data) return;
      this.sourceApplicationList = data.rows;
      this.existCategory = data.rows.map((item) => item.businessTypeId);
    },
    // 刷新智能体列表及分类列表
    async refreshAgentList() {
      this.currentTab = "全部";
      await this.getApplicationList();
      await this.getApplicationCategoryList();
    },
    // 切换收藏状态
    async handleToggleCollect(item) {
      await changeAgentCollect({
        appId: item.appId,
        agentId: item.agentInfo.id,
        collectFlag: item.agentInfo.collectFlag == 1 ? 2 : 1,
      });
      if (item.agentInfo.collectFlag == 1) {
        item.agentInfo.collectFlag = 2;
      } else {
        item.agentInfo.collectFlag = 1;
      }
    },
    async handleStar(collectFlag) {
      await changeAgentCollect({
        appId: this.currentAgent.appId,
        agentId: this.currentAgent.agentInfo.id,
        collectFlag,
      });
    },
    async handleBack() {
      this.clearAgentStateCache();
      this.refreshAgentList();
      this.currentView = "findAgent";
    },
    // 点击智能体
    async handleAgentClick(item) {
      if (item.agentPageConfig?.pageTemplate == 1) {
        $toast("请前往患者列表，选择患者病历后点击生成病历，再使用该智能体", {
          type: "warning",
        });
        return;
      }
      if (!item.agentInfo) {
        $toast("当前智能体无权限", {
          type: "warning",
        });
        return;
      }
      this.currentAgent = item;
      this.currentAgentId = item.agentInfo.id;
      this.emrManager.setCurrentAgentId(item.agentInfo.id);
      this.currentView = "chatAgent";
    },
    openAgent(id) {
      this.currentAgentId = id;
      this.currentAgent = this.sourceApplicationList.find((item) => item.appId == id);
      if (this.currentAgent) {
        this.emrManager.setCurrentAgentId(this.currentAgent.agentInfo.id);
        this.currentView = "chatAgent";
        this.isChatVisible = true;
      }
    },

    // 设置用户数据
    setUserDefaultData(user) {
      this.emrManager.setUserDefaultData(user);
    },

    // 开始拖拽
    handleDragStart() {
      this.isDragging = true;
    },

    // 结束拖拽
    handleDragEnd() {
      this.isDragging = false;
    },

    handleSend(inputValue) {
      this.emitAction("sendMessage", {
        message: inputValue,
      });
    },
    handleQuickAccessChange(item) {
      if (!item) {
        this.currentView = "findAgent";
        return;
      }
      if (item.appId == this.currentAgent.appId) {
        return;
      }
      // 保存当前智能体的状态
      if (this.currentAgent.agentInfo?.id) {
        this.saveAgentState(this.currentAgent.agentInfo.id);
      }

      // 切换到新的智能体
      this.currentAgent = { ...item, isCache: !!this.agentStateCache.get(item.agentInfo.id) };
      this.currentAgentId = item.agentInfo.id;
      this.currentView = "chatAgent";

      // 恢复新智能体的状态
      this.$nextTick(() => {
        this.restoreAgentState(item.agentInfo.id);
      });
    },

    // 保存智能体状态
    saveAgentState(agentId) {
      if (!this.$refs.chatAgent) return;
      const chatAgent = this.$refs.chatAgent;
      const state = chatAgent.getCurrentState();
      state.isCache = true;
      // 确保流式加载状态被重置
      state.isStreamLoad = false;
      state.loading = false;
      this.agentStateCache.set(agentId, state);
    },

    // 恢复智能体状态
    restoreAgentState(agentId) {
      if (!this.$refs.chatAgent) return;

      const cachedState = this.agentStateCache.get(agentId);
      if (cachedState) {
        const chatAgent = this.$refs.chatAgent;

        // 使用 ChatAgent 的 setState 方法
        chatAgent.setState(cachedState);

        // 重新初始化插件和滚动位置
        this.$nextTick(() => {
          chatAgent.initPlugin && chatAgent.initPlugin();
          if (chatAgent.chatList.length > 0) {
            chatAgent.scrollToBottom && chatAgent.scrollToBottom();
          }
        });
      }
    },

    // 设置公共系统数据
    setCommonSysData(data) {
      this.commonSysData = data;
    },

    // 设置his功能
    setCommonFunc(data) {
      const config = { headers: {} };
      data.addSign(config);
      initSignHeaders(config.headers);
    },

    // 清理状态缓存
    clearAgentStateCache() {
      this.agentStateCache.clear();
    },
    handleNoticeClick() {
      this.isUserKnowNotice = false;
      // 如果当前在 chatAgent 视图，保存当前智能体状态
      const needRestore = this.currentView === "chatAgent" && this.currentAgent.agentInfo?.id;
      if (needRestore) {
        this.saveAgentState(this.currentAgent.agentInfo.id);
      }
    },
    handleShepherdClick() {
      localStorage.setItem("isShepherd", false);

      // 如果当前在 chatAgent 视图，保存当前智能体状态
      const needRestore = this.currentView === "chatAgent" && this.currentAgent.agentInfo?.id;
      if (needRestore) {
        this.saveAgentState(this.currentAgent.agentInfo.id);
      }

      // 启动引导，并传递恢复信息
      this.shepherdGuide.init(needRestore ? this.currentAgent.agentInfo.id : null);
    },
  },
};
</script>

<style scoped lang="scss">
html {
  font-size: 4px;
}
.ai-agent {
  font-family: "Microsoft YaHei", sans-serif;
  * {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #dddee0; /* 设置滑块的颜色 */
    border-radius: 5px; /* 设置滑块的圆角 */
  }

  &.ai-agent-dragging {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: 202508;

    // 只有拖拽的元素可以交互
    .floating-button,
    .floating-panel {
      pointer-events: auto;
    }
  }
}
.drag-disabled {
  width: 100% !important;
  height: 100% !important;
}
.agent-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0 16px 16px;
  .agent-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    .agent-card {
      width: calc(50% - 16px);
    }
  }
  .agent-list-empty {
    text-align: center;
    margin-top: 80px;
    font-size: 14px;
    color: #8c94a6;
    .agent-list-empty-text {
      border-radius: 8px;
      display: inline-block;
    }
  }
}
</style>

<style lang="scss"></style>
