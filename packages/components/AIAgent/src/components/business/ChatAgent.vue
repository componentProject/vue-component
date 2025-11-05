<template>
  <div class="chat-agent">
    <div class="chat-agent-container">
      <div class="chat-agent-content">
        <div class="chat-list-container">
          <div id="tsAiAgent-chat-list-content" ref="chatList" class="chat-list-content" @scroll="handleScroll">
            <div class="chat-list">
              <!-- <t-chat-item role="assistant" content="提示词" v-if="chatList.length === 0"> </t-chat-item> -->
              <Bubble
                v-for="(item, index) in chatList"
                :key="index"
                :role="item.role"
                :content="item.markedContent"
                :is-finished="item.finished"
                :text-loading="index === 0 && loading"
              >
                <template v-if="!isStreamLoad" #actions>
                  <BubbleAction :data="item" @operation="(e, type, item) => handleOperation(e, type, item, index)" />
                </template>
              </Bubble>
            </div>
          </div>
          <Conversations
            v-show="showHistory"
            ref="conversations"
            :items="conversationList"
            :is-stream-load="isStreamLoad"
            @change="handleConversationChange"
          />
        </div>
        <div class="chat-footer">
          <div id="tsAiAgent-page-config" class="page-config">
            <div
              v-if="pageConfig.showEditWord == 'Y'"
              class="config-btn"
              @click="
                isEditPrompt = true;
                showParamsPanel = false;
              "
            >
              修改提示词
            </div>
            <div
              v-if="pageConfig.showHistoryConversation == 'Y'"
              class="config-btn"
              @click="showHistory = !showHistory"
            >
              {{ showHistory ? '收起历史' : '展开历史' }}
            </div>
            <div
              v-if="pageConfig.shrinkDialogBox == 'Y'"
              class="config-btn"
              style="float: right"
              @click="isShrinkInput = !isShrinkInput"
            >
              AI提问{{ isShrinkInput ? '展开' : '收起' }}
            </div>
            <div
              v-if="hasCustomParams && pageConfig.showReplenishInformation == 'Y'"
              class="config-btn"
              @click="
                showParamsPanel = !showParamsPanel;
                isEditPrompt = false;
              "
            >
              补充信息
            </div>
          </div>
          <ParamsPanel
            v-if="hasCustomParams && pageConfig.showReplenishInformation == 'Y'"
            :visible="showParamsPanel"
            :params="configParams"
            :show-submit="pageConfig.showDialogBox == 'N'"
            @update:visible="showParamsPanel = $event"
            @submit="sendMessage"
          />
          <ChatInput
            v-show="!isEditPrompt && !isShrinkInput"
            v-if="pageConfig.showDialogBox == 'Y'"
            :model-value="inputContent"
            :show-new-message="pageConfig.showNewConversation == 'Y'"
            :stop-disabled="isStreamLoad"
            :params="configParams"
            style="margin-top: 8px"
            @update:model-value="inputContent = $event"
            @send="sendMessage"
            @stop="onStop"
            @new-message="newMessage"
          />
          <EditPrompt
            v-if="isEditPrompt"
            :data="cueWordDetail"
            style="margin-top: 8px"
            @cancel="isEditPrompt = false"
            @save="handleWordSave"
          />
        </div>
      </div>

      <FeedBack ref="feedBackRef" />
    </div>
  </div>
</template>

<script>
import Bubble from '..//ui/Bubble.vue'
import ChatInput from '../ui/ChatInput.vue'
import Conversations from '../ui/Conversations.vue'
import tsAiChat from '../utils/tsAiChat.js'
import markdownIt from '../markdown-it-vue/markdown-it.js'
import BubbleAction from '../ui/BubbleAction.vue'
import EditPrompt from '../business/EditPrompt.vue'
import FeedBack from '../business/FeedBack.vue'
import ParamsPanel from '../ui/ParamsPanel.vue'
import {
  changeAgentCollect,
  feedback,
  findAiCueWordDetailByAgentId,
  getAgentInfo,
  getCommonSysDetailsData,
  getConversationList,
  getDetailByConversationId,
  updateAiCueWordDetail,
} from '../api/api'
import { $toast } from '../ui/toast'

export default {
  name: 'ChatAgent',
  components: { Bubble, BubbleAction, ChatInput, Conversations, EditPrompt, FeedBack, ParamsPanel },
  mixins: [markdownIt],
  inject: ['token'],
  props: {
    agent: {
      type: Object,
      default: () => ({}),
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    commonSysData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return this.getInitialData()
  },
  watch: {
    agent: {
      handler(newVal) {
        if (newVal.agentInfo.id && !newVal.isCache) {
          this.isStar = newVal.agentInfo.collectFlag
          this.resetChat()
          this.getAgentInfo()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 创建初始数据的工厂函数
    getInitialData() {
      return {
        showHistory: false,
        isStar: this.agent.agentInfo?.collectFlag || false,
        lastScrollTop: 0,
        loading: false,
        isStreamLoad: false, // 是否加载
        chatList: [],
        tsAiChat: null,
        isChatVisible: false,
        isBottom: true,
        isHistoryCollapse: true,
        lastConversationId: '',
        conversationList: [], // 历史对话列表
        isEditPrompt: false, //是否在编辑提示词
        cueWordDetail: '', //提示词详情
        pageConfig: {
          showDialogBox: 'Y',
          shrinkDialogBox: 'N',
          showNewConversation: 'N',
          showEditWord: 'Y',
          showHistoryConversation: 'Y',
          showReplenishInformation: 'Y',
        }, //页面配置
        isShrinkInput: false, //是否收起输入框
        hasCustomParams: false, //是否存在自定义参数
        showParamsPanel: false, //是否显示参数面板
        configParams: [], //输入参数配置
        inputContent: '', // 输入框内容（如果需要父组件控制）
      }
    },
    back() {
      this.$emit('back')
    },
    async handleStar(id, collectFlag) {
      await changeAgentCollect({
        appId: this.agent.appId,
        agentId: id,
        collectFlag,
      })
      if (this.isStar == 1) {
        this.isStar = 2
      }
      else {
        this.isStar = 1
      }
    },
    scrollToBottom() {
      const $el = this.$refs.chatList
      $el.scrollTop = $el.scrollHeight - $el.clientHeight
    },
    handleScroll(e) {
      const currentScrollTop = e.target.scrollTop
      if (currentScrollTop < this.lastScrollTop) {
        this.isBottom = false
      }
      if (currentScrollTop > e.target.scrollHeight - e.target.clientHeight - 10) {
        this.isBottom = true
      }
      this.lastScrollTop = currentScrollTop
    },
    async handleOperation(e, type, item, index) {
      if (type === 'replay') {
        const content = this.chatList[index + 1].content
        this.inputEnter(content)
      }
      else if (type === 'like') {
        if (item.userFeedback == 1) {
          return
        }
        await feedback({
          messageId: item.message_id,
          userFeedback: 1,
        })
        this.chatList.forEach((item) => {
          if (item.message_id === item.message_id) {
            item.userFeedback = 1
          }
        })
      }
      else if (type === 'dislike') {
        if (item.userFeedback == 2) {
          return
        }
        this.$refs.feedBackRef.show(item, () => {
          this.chatList.forEach((item) => {
            if (item.message_id === item.message_id) {
              item.userFeedback = 2
            }
          })
        })
      }
    },

    sendMessage(inputValue = '') {
      for (const param of this.configParams) {
        if (param.isRequired == 1 && !param.paramValue) {
          $toast(`请输入参数${param.paramExplain || param.paramName}`, {
            type: 'error',
          })
          this.showParamsPanel = true
          return
        }
      }
      this.inputContent = ''
      this.inputEnter(inputValue)
      this.$emit('send', inputValue)
    },
    inputEnter(inputValue = '') {
      if (this.isStreamLoad) {
        return
      }
      const params = {
        message_id: '',
        conversationId: '',
        content: inputValue,
        markedContent: inputValue,
        role: 'user',
        userFeedback: '',
      }
      this.chatList.unshift(params)
      // 空消息占位
      const params2 = {
        message_id: '',
        conversationId: '',
        content: '',
        markedContent: '',
        role: 'assistant',
        finished: false,
        userFeedback: '',
      }
      this.chatList.unshift(params2)
      this.handleData(inputValue)
    },
    onStop() {
      this.tsAiChat.stopStream()
      this.loading = false
      this.isStreamLoad = false
    },
    newMessage() {
      this.$nextTick(() => {
        this.chatList = []
        this.lastConversationId = ''
        this.isStreamLoad = false
        this.loading = false
      })
    },
    async handleData(inputValue) {
      this.loading = true
      this.isStreamLoad = true
      const lastItem = this.chatList[0]

      try {
        const params = {}
        for (const param of this.configParams) {
          if (param.paramType == 2) {
            params[param.paramName] = param.paramValue
          }
          else if (param.paramType == 9) {
            params[param.paramName] = param.defaultValue
          }
        }
        // params.prompt = this.cueWordDetail.wordContent;
        // 调用 chatStream 方法获取流
        this.tsAiChat = new tsAiChat()
        const options = {
          url: `/ai-application/api/v1/agent/${this.agent.agentInfo.sourceAgentType == 2 ? 'invokeWorkFlow' : 'invoke'}`,
          config: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'token': this.token,
            },
            body: JSON.stringify({
              agentId: this.agent.agentInfo.id,
              sessionId: this.lastConversationId,
              queryMsg: inputValue,
              params,
            }),
          },
        }

        const stream = await this.tsAiChat.chatStream(options)
        if (!stream || stream.ok == false) {
          this.onComplete(false, stream.message || '请求失败', lastItem)
          return
        }
        // 判断流式响应的关键点：
        // 1. 检查Content-Type是否是事件流
        const contentType = stream.headers.get('content-type') || ''
        const isStream = contentType.includes('text/event-stream')
        // 2. 如果是普通JSON响应则直接处理
        if (!isStream) {
          try {
            const res = await stream.json()
            if (res.statusCode != 200 || !res.object) {
              this.onComplete(false, res.message || '请求失败', lastItem)
            }
            else {
              const outputs = res.object.outputs || {}
              const key = Object.keys(outputs)[0]
              lastItem.content = outputs[key]
              lastItem.markedContent = this.md.render(lastItem.content)
              this.onComplete(true, res.object, lastItem)
            }
            return
          }
          catch (error) {
            this.onComplete(false, error.message || '请求失败', lastItem)
            return
          }
        }

        // 处理流式响应
        await this.tsAiChat.processStream(stream, {
          onMessage: (res) => {
            this.loading = false
            if (res.event == 'message') {
              this.lastConversationId = res.conversation_id
              lastItem.content += res.answer
              lastItem.conversationId = res.conversation_id
              lastItem.message_id = res.message_id
            }
            if (res.event == 'text_chunk') {
              this.lastConversationId = res.task_id
              lastItem.content += res.data?.text
              lastItem.conversationId = res.task_id
              lastItem.message_id = res.workflow_run_id
            }
            if (res.choices && res.choices.length > 0) {
              lastItem.content += res.choices[0]?.delta?.content || ''
            }
            if (res.event == 'error') {
              this.onComplete(false, res.message || '请求失败', lastItem)
              return
            }
            lastItem.markedContent = this.md.render(lastItem.content)
            this.initPlugin()
            this.$nextTick(() => {
              if (this.isBottom) {
                this.scrollToBottom()
              }
            })
            // lastItem.markedContent = lastItem.content;
          },
          onComplete: (isOk, msg) => this.onComplete(isOk, msg, lastItem),
        })
      }
      catch (error) {
        console.error('对话出错:', error)
      }
    },
    onComplete(isOk = true, msg = '请求失败', lastItem) {
      lastItem.finished = true
      if (!isOk) {
        lastItem.role = 'error'
        lastItem.markedContent = msg
      }
      // 控制终止按钮
      this.isStreamLoad = false
      this.loading = false
      this.$emit('complete', lastItem)
      this.$nextTick(() => {
        this.getConversationList()
      })
    },
    async getConversationList() {
      const data = await getConversationList(this.agent.agentInfo)
      this.conversationList = data.rows.reverse()
    },
    async handleConversationChange(conversation) {
      if (this.isStreamLoad) {
        return
      }
      const data = await getDetailByConversationId(conversation.conversationId)
      const list = []
      for (const item of data.object) {
        list.unshift(
          {
            conversation_id: item.conversationId,
            message_id: item.messageId,
            role: 'assistant',
            content: item.answerContent,
            markedContent: this.md.render(item.answerContent),
            userFeedback: item.userFeedback,
          },
          {
            conversation_id: item.conversationId,
            message_id: item.messageId,
            role: 'user',
            content: item.askContent,
            markedContent: item.askContent,
            userFeedback: item.userFeedback,
          },
        )
      }
      this.chatList = list
      this.lastConversationId = data.object[0].conversationId
      this.isStreamLoad = false
      this.loading = false
      this.initPlugin()
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    async getAgentInfo() {
      const res = await getAgentInfo(this.agent.agentInfo.id)
      if (!res)
        return
      if (res.agentPageConfig) {
        this.pageConfig = res.agentPageConfig
      }
      else {
        this.pageConfig = {
          showDialogBox: 'Y',
          shrinkDialogBox: 'N',
          showNewConversation: 'N',
          showEditWord: 'Y',
          showHistoryConversation: 'Y',
          // showReplenishInformation: 'N'
          // showReplenishInformation: 'N',
          // outputType: '1',
          // pageTemplate: ''
        }
      }
      if (this.pageConfig.showEditWord == 'Y') {
        this.getCueWordDetail()
      }
      if (this.pageConfig.showHistoryConversation == 'Y') {
        this.getConversationList()
      }
      const configParams = res.configParam?.agentConfigParamList || []
      if (configParams.filter(item => item.paramType == 2).length > 0) {
        this.hasCustomParams = true
        this.configParams = JSON.parse(JSON.stringify(configParams))
        this.setConfigParams(res.agentConfig.callbackUrl)
      }
    },
    async getCueWordDetail() {
      const res = await findAiCueWordDetailByAgentId(this.agent.agentInfo.id)
      if (res.statusCode == 200) {
        this.cueWordDetail = res.object[0]
      }
    },
    async handleWordSave(wordContent) {
      const res = await updateAiCueWordDetail({
        wordId: this.cueWordDetail.id,
        agentId: this.agent.agentInfo.id,
        wordContent,
      })
      if (res.statusCode == 200) {
        $toast('保存成功', {
          type: 'success',
        })
        this.getCueWordDetail()
        this.isEditPrompt = false
      }
    },

    async setConfigParams(url) {
      if (url) {
        const res = await getCommonSysDetailsData(url, this.commonSysData)
        if (JSON.stringify(res) == '{}') {
          return
        }
        for (const item of this.configParams) {
          if (res[item.paramName]) {
            item.paramValue = res[item.paramName]
          }
        }
        this.sendMessage(this.inputContent)
      }
      else {
        for (const item of this.configParams) {
          if (this.commonSysData[item.paramName]) {
            item.paramValue = this.commonSysData[item.paramName]
          }
        }
      }
    },

    resetChat() {
      // 停止当前流
      this.tsAiChat && this.tsAiChat.stopStream()
      // 保存需要保留的状态
      const preservedState = {
        isStar: this.agent.agentInfo.collectFlag,
        pageConfig: this.pageConfig,
        hasCustomParams: this.hasCustomParams,
      }

      // 一次性重置到初始状态并合并保留状态
      Object.assign(this, this.getInitialData())
    },

    // 添加一个方法来获取当前状态（供父组件调用）
    getCurrentState() {
      const state = JSON.parse(JSON.stringify(this.$data))
      // 移除 mixin 相关属性，避免序列化问题和恢复时的冲突
      delete state.md
      delete state.urlSet
      delete state.viewer
      delete state.showViewer
      delete state.index
      delete state.urlList
      delete state.showModal
      delete state.iframeContent
      return state
    },

    // 添加一个方法来设置状态（供父组件调用）
    setState(state) {
      if (!state)
        return
      setTimeout(() => {
        // 保存 mixin 初始化的属性，避免被覆盖
        const mixinProps = {
          md: this.md,
          urlSet: this.urlSet,
          viewer: this.viewer,
          showViewer: this.showViewer,
          index: this.index,
          urlList: this.urlList,
          showModal: this.showModal,
          iframeContent: this.iframeContent,
        }

        // 应用状态
        Object.assign(this, state)

        // 恢复 mixin 属性
        Object.assign(this, mixinProps)
      }, 100)
    },
  },
}
</script>

<style lang="scss">
.chat-agent {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  height: 100%;
  background-color: #fafbfc;
  .chat-agent-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

    .chat-agent-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #fff;
      .chat-list-container {
        height: 100%;
        display: flex;
        overflow: hidden;
      }

      .chat-list-content {
        padding: 20px 0 20px 20px;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .chat-list {
        display: flex;
        flex-direction: column-reverse;
        flex: 1;
        padding-right: 20px;
        gap: 16px;
      }

      .chat-footer {
        padding: 8px 16px 16px 16px;
        background-color: #fff;
        border-top: 1px solid #e6e8eb;
        border-radius: 0 0 8px 8px;
        .page-config {
          .config-btn {
            height: 30px;
            padding: 0 12px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            color: #666;
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
    }
  }
}
</style>
