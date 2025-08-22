<template>
  <div
    class="ai-agent"
    :class="{ 'ai-agent-dragging': isDragging }"
    data-v="1.3.2"
    v-if="configOption.token"
  >
    <!-- 浮动按钮 -->
    <FloatingButton
      @button-click="handleFloatingButtonClick"
      @drag-start="handleDragStart"
      @drag-end="handleDragEnd"
    />
    <!-- 浮动面板 -->
    <FloatingPanel
      ref="floatingPanel"
      :visible="isChatVisible"
      @drag-start="handleDragStart"
      @drag-end="handleDragEnd"
      @resize-start="handleDragStart"
      @resize-end="handleDragEnd"
    >
      <UserNotice @confirm="handleUserNoticeConfirm" v-if="!isUserKnowNotice" />
      <!-- 浮动面板头部 -->
      <template #header v-if="isUserKnowNotice">
        <div class="floating-panel-header-title">
          <span v-if="currentView == 'findAgent'">发现智能体</span>
          <span v-if="currentView == 'chatAgent'">星助手</span>
          <span v-if="currentView == 'emrAgent'">
            <div class="back-btn" @click="handleBack">
              <i class="ai-iconfont icon-arrow-left"></i>
            </div>
            病历助手
          </span>
        </div>
        <!-- 阻止mousedown冒泡导致不可输入 -->
        <div class="floating-panel-header-search" @mousedown.stop v-if="currentView == 'findAgent'">
          <input
            type="text"
            placeholder="搜索智能体"
            v-model="searchValue"
            id="tsAiAgent-find-agent-search"
          />
        </div>
        <!-- 阻止mousedown冒泡导致不可点击 -->
        <div class="floating-panel-header-close" @click="isChatVisible = false" @mousedown.stop>
          <i class="ai-iconfont icon-times"></i>
        </div>
      </template>

      <!-- 浮动面板内容 -->
      <template #content v-if="isUserKnowNotice">
        <template v-if="currentView == 'findAgent'">
          <Tabs :tabList="categoryList" v-model:currentTab="currentTab" />
          <div class="agent-list-container">
            <!-- 智能体列表 -->
            <div class="agent-list" id="tsAiAgent-find-agent-list">
              <AgentCard
                v-for="item in applicationList"
                :key="item.id"
                :logo="item.logo"
                :name="item.appName || ''"
                :description="item.description || ''"
                :isCollect="item.agentInfo.collectFlag == 2"
                @toggleCollect="handleToggleCollect(item)"
                @click.native="handleAgentClick(item)"
              />
            </div>
            <!-- 右侧边距滚动条占位 -->
            <div style="width: 16px"></div>
            <div class="agent-list-empty" v-if="applicationList.length === 0">
              <div class="agent-list-empty-text">暂无数据</div>
            </div>
          </div>
        </template>
        <template v-if="currentView == 'chatAgent'">
          <ChatAgent :agent="currentAgent" @back="handleBack" @send="handleSend" ref="chatAgent" />
          <!-- <QuickAccess :tabList="quickAccessList" /> -->
        </template>
        <template v-if="currentView == 'emrAgent'">
          <TrasenEditor
            v-model:emr_data="emr_data"
            :isGeneratingEmr="isGeneratingEmr"
            :showRegenerate="showRegenerate"
            @syncSelectedEmr="handleSyncSelectedEmr"
            @syncAllEmr="handleSyncAllEmr"
            @continueLine="handleContinueLine"
            @regenerate="handleRegenerate"
            ref="trasenEditor"
          />
        </template>
      </template>
    </FloatingPanel>
  </div>
</template>

<script>
import FloatingPanel from "./components/ui/FloatingPanel.vue";
import FloatingButton from "./components/ui/FloatingButton.vue";
import UserNotice from "./components/ui/UserNotice.vue";
import Tabs from "./components/ui/Tabs.vue";
import AgentCard from "./components/ui/AgentCard.vue";
import ChatAgent from "./components/business/ChatAgent.vue";
import TrasenEditor from "./components/emrAgent/components/TrasenEditor.vue";
import { $toast } from "./components/ui/toast";

import { formatTemplate } from "./components/emrAgent/js/editorConfig/formatTemplate";
import { buildAIData } from "./components/emrAgent/js/buildAIData";
import { needCallCreateEmr } from "./components/emrAgent/js/editorConfig/model";
import {
  generateEmr,
  completeLine,
  initApiConfig,
  getDictPullDownList,
  getListAgentByApp,
  changeAgentCollect,
} from "./components/api/api";
import {
  updateEmrData,
  initEmrObject,
  parseEmrData,
  clearEmrData,
} from "./components/emrAgent/js/syncMonacoData";

export default {
  name: "AIAgent",
  components: {
    FloatingPanel,
    FloatingButton,
    UserNotice,
    Tabs,
    AgentCard,
    ChatAgent,
    TrasenEditor,
  },
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  provide() {
    return {
      token: this.option.token,
    };
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
      emr_data: {}, // 病历数据
      currentUser: null,
      isGeneratingEmr: false, // 是否正在生成病历
      continueLineController: null, // 用于取消 completeLine 请求的控制器
      generateEmrController: null, // 用于取消 generateEmr 请求的控制器
      currentAgentId: "", // 当前智能体id
      curAiData: [], // 当前智能体数据
      isDragging: false, // 是否正在拖拽
      quickAccessList: [
        {
          id: "1",
          name: "智能问诊",
        },
        {
          id: "2",
          name: "病历质控",
        },
        {
          id: "3",
          name: "病历生成",
        },
        {
          id: "4",
          name: "报告解读",
        },
      ], // 快捷访问列表
      showRegenerate: false, // 是否显示重新生成按钮
      medicalRecordId: "686b8936d26f30f72de48cdc",
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
    this.refreshAgentList();
  },
  beforeDestroy() {
    // 组件销毁时取消正在进行的请求
    if (this.continueLineController) {
      this.continueLineController.abort();
      this.continueLineController = null;
    }
    if (this.generateEmrController) {
      this.generateEmrController.abort();
      this.generateEmrController = null;
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
        setMonacoTemplate: () => this.setMonacoTemplate(params.jsonData),
        createEmr: () => this.createEmr(params.jsonData, params.agentId, params.showChat),
        openAgent: () => this.openAgent(params.id),
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
      this.$forceUpdate();
    },
    // 用户已知提示
    handleUserNoticeConfirm() {
      this.isUserKnowNotice = true;
    },
    // 获取智能体分类列表
    async getApplicationCategoryList() {
      const data = await getDictPullDownList("APPLICATION_TYPE");
      this.categoryList = data.object.filter((item) => this.existCategory.includes(item.value));
    },
    // 获取智能体列表
    async getApplicationList() {
      const data = await getListAgentByApp();
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
    // 点击智能体
    async handleAgentClick(item) {
      if (this.medicalRecordId.includes(item.agentInfo.id)) {
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
      this.currentView = "chatAgent";
    },
    openAgent(id) {
      this.currentAgentId = id;
      this.currentAgent = this.sourceApplicationList.find((item) => item.appId == id);
      if (this.currentAgent) {
        this.currentView = "chatAgent";
        this.isChatVisible = true;
      }
    },
    handleBack() {
      this.refreshAgentList();
      this.currentView = "findAgent";
    },

    // 设置用户数据
    setUserDefaultData(user) {
      clearEmrData();
      //遍历user，根据key(decode)查找数据
      Object.keys(user).forEach((key) => {
        updateEmrData(key, user[key].content, user[key].content);
      });
      if (needCallCreateEmr(this.emr_data)) {
        this.createEmr(user);
      }
    },

    // 设置模版数据
    async setMonacoTemplate(jsonData) {
      this.showRegenerate = false;
      if (!jsonData) return;
      this.currentView = "emrAgent";
      this.$nextTick(async () => {
        this.emr_data = formatTemplate(jsonData);
        initEmrObject(this.$refs.trasenEditor, this.emr_data.readOnly, this.emr_data.normal);
      });
    },

    //  生成病历
    async createEmr(jsonData, agentId, showChat) {
      this.currentAgentId = agentId;
      if (!jsonData || !agentId || !this.emr_data.normal) return;
      this.emr_data = formatTemplate(jsonData);
      await this.$nextTick();
      this.aiData = buildAIData(this.emr_data);
      if (!this.aiData || this.aiData.length === 0) {
        console.error("数据为空");
        return;
      }
      if (!this.aiData.find((item) => item.deCode == "DE04.01.119.00")?.content) {
        console.error("主诉为空");
        return;
      }
      this.generateEmr(this.aiData, agentId, showChat);
    },
    async generateEmr(aiData, agentId, showChat) {
      const controller = new AbortController();
      try {
        if (showChat) this.isChatVisible = true;
        if (this.generateEmrController) {
          this.generateEmrController.abort();
        }
        this.generateEmrController = controller;
        this.isGeneratingEmr = true;
        const res = await generateEmr(JSON.stringify(aiData), agentId, controller.signal);
        if (!res) return;
        const aiResultData = JSON.parse(res);
        this.emr_data = {
          readOnly: this.emr_data.readOnly,
          normal: parseEmrData(aiResultData),
        };

        this.emitAction("generateEmrSuccess", {
          emrData: this.emr_data,
        });
        this.showRegenerate = true;
      } catch (error) {
        // 忽略手动取消的错误
        if (error.name !== "AbortError") {
          console.error("生成病历失败:", error);
          this.emitAction("generateEmrError", {
            error,
          });
        }
      } finally {
        // 关键修改：只清除当前请求的控制器
        if (this.generateEmrController === controller) {
          this.isGeneratingEmr = false;
          this.generateEmrController = null;
        }
      }
    },
    // 单行续写
    async handleContinueLine(event) {
      if (!event || !this.currentAgentId) {
        return;
      }
      // 取消上一次请求
      if (this.continueLineController) {
        this.continueLineController.abort();
        this.continueLineController = null;
      }
      const { position, lineContent } = event;
      const lineNumber = position.lineNumber;
      if (lineNumber > 0) {
        const currentItem = this.emr_data.normal[lineNumber - 1];
        if (!currentItem) {
          return;
        }
        const requestContext = {
          lineNumber,
          itemId: currentItem.ID,
          deCode: currentItem.deCode,
        };
        const linAiData = buildAIData(this.emr_data);
        for (let line of linAiData) {
          if (line.deCode == currentItem.deCode) {
            line.generate = 1;
            line.beforeContent = lineContent
              .substring(0, position.column - 1)
              .replace(currentItem.name + ":", "");
            line.afterContent = lineContent.substring(position.column - 1);
          } else {
            line.generate = 0;
          }
        }
        // 创建新的 AbortController
        this.continueLineController = new AbortController();
        try {
          const res = await completeLine(
            JSON.stringify(linAiData),
            this.currentAgentId,
            this.continueLineController.signal,
          );

          // 检查请求是否被取消
          if (this.continueLineController?.signal.aborted) {
            console.log("Continue line request was cancelled");
            return;
          }

          if (!res) return;

          // 验证数据一致性，确保响应对应正确的行
          const currentItemNow = this.emr_data.normal[lineNumber - 1];
          const result = JSON.parse(res).data.find((i) => i.deCode == currentItemNow.deCode);
          if (!result) return;
          const isValidResponse =
            currentItemNow &&
            currentItemNow.ID === requestContext.itemId &&
            currentItemNow.deCode === requestContext.deCode;
          if (
            isValidResponse &&
            result.newContent &&
            currentItemNow.content.indexOf(result.newContent) === -1
          ) {
            this.$refs.trasenEditor.setGhostLineContent(lineNumber, result);
          }
        } catch (error) {
          if (error.name === "AbortError" || error.message === "Request was aborted") {
            console.log("行续写请求被取消");
          } else {
            console.error("行续写请求失败:", error);
          }
        } finally {
          // 清理控制器
          if (this.continueLineController && !this.continueLineController.signal.aborted) {
            this.continueLineController = null;
          }
        }
      }
    },
    // 同步当前行
    handleSyncSelectedEmr(selectedLineNum) {
      if (selectedLineNum.length === 0) {
        return;
      }
      this.emitAction("syncSelectedEmr", {
        selectedLineNum,
        emrData: this.emr_data,
      });
    },
    // 同步所有行
    handleSyncAllEmr() {
      this.emitAction("syncAllEmr", {
        emrData: this.emr_data,
      });
    },

    // 开始拖拽
    handleDragStart() {
      this.isDragging = true;
    },

    // 结束拖拽
    handleDragEnd() {
      this.isDragging = false;
    },
    handleRegenerate() {
      const aiData = buildAIData(this.emr_data);
      this.generateEmr(aiData, this.currentAgentId, false);
    },
    handleSend(inputValue) {
      this.emitAction("sendMessage", {
        message: inputValue,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ai-agent {
  font-family: "PingFangSC-Regular", "Microsoft YaHei", sans-serif;
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
    z-index: 9;

    // 只有拖拽的元素可以交互
    .floating-button,
    .floating-panel {
      pointer-events: auto;
    }
  }
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
