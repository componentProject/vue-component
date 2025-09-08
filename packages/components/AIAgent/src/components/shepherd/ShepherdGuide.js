import { shepherd } from './index'

// 配置常量
const SHEPHERD_CONFIG = {
  STORAGE_KEY: 'isShepherd',
  VIEW_TRANSITION_DELAY: 300,
  DEMO_AGENT: {
    appId: '19622299330285568',
    appName: '用药分析',
    isCache: true,
    agentInfo: {
      id: '68808945900df006b22ac797',
      appId: '19622299330285568',
      agentName: '用药分析',
      collectFlag: '1',
    },
    agentPageConfig: {
      id: '68a68102900df0fe7adf324a',
      agentId: '19622299330285568',
      showDialogBox: 'Y',
      shrinkDialogBox: 'N',
      showNewConversation: 'N',
      showEditWord: 'Y',
      showHistoryConversation: 'Y',
      showReplenishInformation: 'Y',
      outputType: '1',
      pageTemplate: '0',
    },
  },
  DEMO_PROMPT: {
    id: '6863989cd26f3099e5b7c871',
    wordName: '用药分析',
    applicationType: '10',
    wordContent: '你是一名具备丰富临床经验的专业药剂师，负责对医生为患者开立的药品进行全面、严谨的合理性分析。具体要求如下：\n一、输入信息说明\n 1. 患者基本信息，可能包括年龄、性别、体重、身高等：{{patInfo}}\n 2.诊疗信息：\n- 主诉:{{main_suit}}\n- 现病史:{{nowMedicalHistory}}\n- 既往病史：{{pastMedicalHistory}}\n- 药物过敏史：{{allerg}} \n- 诊断信息：{{diagnosis}}\n3. 开立药品信息：{{med_lis}}\n\n二、输出格式（请按以下 markdown 格式呈现分析结果）\nmarkdown\n#### 一、总体合理性判断  ​\n| 分析维度                | 结果                              |​\n|-------------------------|-----------------------------------|​\n| 总体结论                | [例如：用药方案整体合理/部分不合理/不合理] |​\n| 用药与诊断匹配度        | [合理/不合理]                     |​\n| 药物剂量与用法          | [合理/不合理]                     |​\n| 药物相互作用            | [无显著不良相互作用/存在不良相互作用] |​\n| 患者个体因素适配性      | [适配/不适配]                     |​\n| 用药疗程                | [合理/不合理]                     | \n\n#### 二、详细分析依据  \n1. **用药与诊断匹配度分析**：  \n   [结合权威指南/说明书，说明药品是否针对诊断病症。例如：患者诊断为"社区获得性肺炎（细菌性）"，头孢呋辛酯属于第二代头孢菌素，对肺炎链球菌、流感嗜血杆菌等常见致病菌有效，符合《成人社区获得性肺炎诊疗指南（2023年版）》中对非重症患者的经验性治疗推荐，用药与诊断匹配度合理。]  \n\n2. **药物剂量与用法分析**：  \n   [对比说明书/指南推荐剂量，结合患者个体情况说明。例如：药品说明书推荐成人常规剂量为每次0.25g，每日2次，与当前用法用量一致；患者体重65kg，按体重计算（约3.8mg/kg/次）在推荐范围内；给药途径为口服，与头孢呋辛酯的常规给药方式一致，剂量与用法合理。]  \n\n3. **药物相互作用分析**：  \n   [列出联用药物间的相互作用及风险。例如：患者正在使用的"硝苯地平控释片"与"头孢呋辛酯"无明确不良相互作用；目前无其他联用药物，暂未发现显著药物相互作用。]  \n\n4. **患者个体因素适配性分析**：  \n   [结合过敏史/病史评估安全性。例如：患者无头孢类药物过敏史，且既往过敏史（青霉素皮疹）与头孢呋辛酯无明确交叉过敏证据；患者虽有"慢性肾功能不全（CKD3期）"，但头孢呋辛酯在CKD3期（肌酐清除率30-50ml/min）时无需调整剂量，与个体因素适配性合理。]  \n\n5. **用药疗程分析**：  \n   [结合疾病特点及指南判断。例如：社区获得性肺炎的抗菌治疗疗程通常为7-14天，患者无基础疾病且感染程度较轻，当前"连续使用10天"的疗程符合临床常规，疗程合理。]  \n\n#### 三、改进建议\n- **具体调整方案**：[若方案合理则写"无调整建议"；若不合理，例如：建议将剂量调整为"每次0.125g，每日2次"]  \n- **调整依据**：[对应调整方案的说明，如方案合理则写"当前方案符合临床规范，无需调整"；若有调整，例如：根据药品说明书，肌酐清除率＜30ml/min时需减半剂量，患者当前肌酐清除率25ml/min，符合减量指征]  \n- **用药注意事项**：[若方案合理则写"遵循现有方案，注意观察患者用药反应"；若有调整，例如：用药期间多饮水，促进药物排泄；监测肾功能（每3天复查肌酐），如肌酐进一步升高需及时停药]  \n\n#### 四、补充说明  \n- [例如：头孢呋辛酯可能引起胃肠道反应（如腹泻、恶心），若患者出现持续腹泻需警惕伪膜性肠炎，建议及时就医；与食物同服可增加吸收，建议餐后服用。]  ',
  },
  DEMO_CONFIG_PARAMS:
        [
          {
            id: '37464862221275136',
            paramType: '2',
            paramName: 'patientDataStr',
            paramExplain: '年龄、性别、体重、身高等',
            isRequired: '1',
          },
          {
            id: '37464862221275137',
            paramType: '2',
            paramName: 'medicalRecordDataStr',
            paramExplain: '现病史',
            isRequired: '1',
          },
          {
            id: '37464862221275138',
            paramType: '2',
            paramName: 'prescriptionDataStr',
            paramExplain: '开立的药品信息',
            isRequired: '1',
          },

        ],
  DEMO_CHAT_LIST: [
    {
      conversation_id: 'e40c159d-2e63-4234-b4bf-9291b2da2871',
      message_id: 'e764a5df-0ca8-4178-b276-a16374d2a511',
      role: 'assistant',
      content: '#### 一、总体合理性判断  ​\n| 分析维度                | 结果                              |​\n|-------------------------|-----------------------------------|​\n| 总体结论                | 部分不合理 |​\n| 用药与诊断匹配度        | 部分不合理 |​\n| 药物剂量与用法          | 部分不合理 |​\n| 药物相互作用            | 存在不良相互作用 |​\n| 患者个体因素适配性      | 不适配 |​\n| 用药疗程                | 部分不合理 | \n\n#### 二、详细分析依据  \n1. **用药与诊断匹配度分析**：  \n   针对孕12周患者，叶酸片、维生素AD滴剂和葡萄糖酸钙注射液的使用是合理的，符合孕期营养补充的需求。黄体酮软胶囊的使用需基于患者是否存在黄体功能不足或先兆流产的风险评估，单纯孕期不一定需要常规补充黄体酮。米索前列醇片为前列腺素E1类似物，主要用于终止妊娠或在特定情况下促进宫颈成熟，在正常妊娠中不应使用，除非有明确的医疗指征，因此该药与诊断不匹配。\n\n2. **药物剂量与用法分析**：  \n   - **叶酸片（5gm BID）**：剂量异常，叶酸常规剂量为0.4~0.8mg/天，大剂量5g（5000mg）远超安全范围，存在误写可能（可能为5mg）。  \n   - **维生素AD滴剂（QD）**：剂量未明确标注，需根据产品规格评估是否超量，一般孕期推荐剂量为维生素A≤3000IU/天，维生素D≤4000IU/天。  \n   - **葡萄糖酸钙注射液（1g:10ml BID）**：孕期钙需求增加（1000~1300mg/天），但通常优先口服补钙，静脉注射仅用于严重缺乏或紧急情况，且需监测血钙水平。  \n   - **黄体酮软胶囊（100mg BID）**：剂量偏高，若无明确适应症（如流产高风险），需重新评估必要性。  \n   - **米索前列醇片（200μg）**：若无终止妊娠指征，禁用（可能为错误开药或用药目的不明确）。  \n\n3. **药物相互作用分析**：  \n   - 米索前列醇与黄体酮药效拮抗（前者促进宫缩，后者抑制宫缩），联用可能导致治疗矛盾。  \n   - 维生素AD中维生素A过量（＞10,000IU/天）可能增加胎儿畸形风险，需核查剂量。  \n\n4. **患者个体因素适配性分析**：  \n   - **孕12周**：米索前列醇禁忌，黄体酮需明确适应症，叶酸剂量异常需核实。  \n   - **无过敏史**：药物选择无过敏禁忌，但剂量和联用风险需关注。  \n\n5. **用药疗程分析**：  \n   - 叶酸应全程孕期服用（0.4mg/天），但当前剂量不合理；  \n   - 米索前列醇无指征情况下不应使用；  \n   - 黄体酮疗程需根据具体适应症调整（如先兆流产通常用至孕12周）。  \n\n#### 三、改进建议  \n- **具体调整方案**：  \n  1. 叶酸片调整为0.4mg QD（或5mg QD，如高风险人群）；  \n  2. 明确维生素AD滴剂具体剂量，避免维生素A过量；  \n  3. 葡萄糖酸钙改为口服制剂（如碳酸钙0.5g TID），除非急需补钙；  \n  4. 停用米索前列醇（除非终止妊娠）；  \n  5. 黄体酮软胶囊仅限有先兆流产症状者（100mg QD或阴道给药）。  \n\n- **调整依据**：  \n  - 叶酸：根据《围妊娠期妇女膳食指南（2022）》；  \n  - 米索前列醇：WHO指南禁止用于安胎；  \n  - 钙剂：优先口服补钙（《妊娠期钙剂补充专家共识》）。  \n\n- **用药注意事项**：  \n  - 监测早孕反应及宫缩情况（尤其联用黄体酮与米索前列醇时）；  \n  - 定期复查血钙、肝肾功能（长期高剂量维生素AD可能蓄积）；  \n  - 黄体酮需观察阴道出血及孕酮水平。  \n\n#### 四、补充说明  \n- **米索前列醇**：绝对禁忌症包括带环妊娠、异位妊娠等，需核实是否误开。  \n- **叶酸错误剂量**：5g可能导致锌吸收障碍和神经系统毒性，需与医生确认是否为笔误（5mg更合理）。  \n- **维生素A风险**：超过推荐剂量可能导致胎儿心血管畸形，建议选用不含维生素A的纯维生素D补充剂。',
      markedContent: '<h4>一、总体合理性判断  ​</h4>\n<p>| 分析维度                | 结果                              |​\n|-------------------------|-----------------------------------|​\n| 总体结论                | 部分不合理 |​\n| 用药与诊断匹配度        | 部分不合理 |​\n| 药物剂量与用法          | 部分不合理 |​\n| 药物相互作用            | 存在不良相互作用 |​\n| 患者个体因素适配性      | 不适配 |​\n| 用药疗程                | 部分不合理 |</p>\n<h4>二、详细分析依据</h4>\n<ol>\n<li>\n<p><strong>用药与诊断匹配度分析</strong>：<br>\n针对孕12周患者，叶酸片、维生素AD滴剂和葡萄糖酸钙注射液的使用是合理的，符合孕期营养补充的需求。黄体酮软胶囊的使用需基于患者是否存在黄体功能不足或先兆流产的风险评估，单纯孕期不一定需要常规补充黄体酮。米索前列醇片为前列腺素E1类似物，主要用于终止妊娠或在特定情况下促进宫颈成熟，在正常妊娠中不应使用，除非有明确的医疗指征，因此该药与诊断不匹配。</p>\n</li>\n<li>\n<p><strong>药物剂量与用法分析</strong>：</p>\n<ul>\n<li><strong>叶酸片（5gm BID）</strong>：剂量异常，叶酸常规剂量为0.4~0.8mg/天，大剂量5g（5000mg）远超安全范围，存在误写可能（可能为5mg）。</li>\n<li><strong>维生素AD滴剂（QD）</strong>：剂量未明确标注，需根据产品规格评估是否超量，一般孕期推荐剂量为维生素A≤3000IU/天，维生素D≤4000IU/天。</li>\n<li><strong>葡萄糖酸钙注射液（1g:10ml BID）</strong>：孕期钙需求增加（1000~1300mg/天），但通常优先口服补钙，静脉注射仅用于严重缺乏或紧急情况，且需监测血钙水平。</li>\n<li><strong>黄体酮软胶囊（100mg BID）</strong>：剂量偏高，若无明确适应症（如流产高风险），需重新评估必要性。</li>\n<li><strong>米索前列醇片（200μg）</strong>：若无终止妊娠指征，禁用（可能为错误开药或用药目的不明确）。</li>\n</ul>\n</li>\n<li>\n<p><strong>药物相互作用分析</strong>：</p>\n<ul>\n<li>米索前列醇与黄体酮药效拮抗（前者促进宫缩，后者抑制宫缩），联用可能导致治疗矛盾。</li>\n<li>维生素AD中维生素A过量（＞10,000IU/天）可能增加胎儿畸形风险，需核查剂量。</li>\n</ul>\n</li>\n<li>\n<p><strong>患者个体因素适配性分析</strong>：</p>\n<ul>\n<li><strong>孕12周</strong>：米索前列醇禁忌，黄体酮需明确适应症，叶酸剂量异常需核实。</li>\n<li><strong>无过敏史</strong>：药物选择无过敏禁忌，但剂量和联用风险需关注。</li>\n</ul>\n</li>\n<li>\n<p><strong>用药疗程分析</strong>：</p>\n<ul>\n<li>叶酸应全程孕期服用（0.4mg/天），但当前剂量不合理；</li>\n<li>米索前列醇无指征情况下不应使用；</li>\n<li>黄体酮疗程需根据具体适应症调整（如先兆流产通常用至孕12周）。</li>\n</ul>\n</li>\n</ol>\n<h4>三、改进建议</h4>\n<ul>\n<li>\n<p><strong>具体调整方案</strong>：</p>\n<ol>\n<li>叶酸片调整为0.4mg QD（或5mg QD，如高风险人群）；</li>\n<li>明确维生素AD滴剂具体剂量，避免维生素A过量；</li>\n<li>葡萄糖酸钙改为口服制剂（如碳酸钙0.5g TID），除非急需补钙；</li>\n<li>停用米索前列醇（除非终止妊娠）；</li>\n<li>黄体酮软胶囊仅限有先兆流产症状者（100mg QD或阴道给药）。</li>\n</ol>\n</li>\n<li>\n<p><strong>调整依据</strong>：</p>\n<ul>\n<li>叶酸：根据《围妊娠期妇女膳食指南（2022）》；</li>\n<li>米索前列醇：WHO指南禁止用于安胎；</li>\n<li>钙剂：优先口服补钙（《妊娠期钙剂补充专家共识》）。</li>\n</ul>\n</li>\n<li>\n<p><strong>用药注意事项</strong>：</p>\n<ul>\n<li>监测早孕反应及宫缩情况（尤其联用黄体酮与米索前列醇时）；</li>\n<li>定期复查血钙、肝肾功能（长期高剂量维生素AD可能蓄积）；</li>\n<li>黄体酮需观察阴道出血及孕酮水平。</li>\n</ul>\n</li>\n</ul>\n<h4>四、补充说明</h4>\n<ul>\n<li><strong>米索前列醇</strong>：绝对禁忌症包括带环妊娠、异位妊娠等，需核实是否误开。</li>\n<li><strong>叶酸错误剂量</strong>：5g可能导致锌吸收障碍和神经系统毒性，需与医生确认是否为笔误（5mg更合理）。</li>\n<li><strong>维生素A风险</strong>：超过推荐剂量可能导致胎儿心血管畸形，建议选用不含维生素A的纯维生素D补充剂。</li>\n</ul>\n',
      userFeedback: 1,
    },
    {
      conversation_id: 'e40c159d-2e63-4234-b4bf-9291b2da2871',
      message_id: 'e764a5df-0ca8-4178-b276-a16374d2a511',
      role: 'user',
      content: '请进行用药分析',
      markedContent: '请进行用药分析',
      userFeedback: '1',
    },
  ],
  DEMO_CONVERSATION_LIST: [
    {
      detailId: '68994cf7900df00f6244b7e9',
      conversationId: '0d278061-33a8-4f51-a884-2e8e370217bc',
      messageId: '67cfe494-bddf-4163-9b38-34cf8dd77aca',
      title: '帮我分析\n',
    },
    {
      detailId: '6896ae49900df00f6244b7d9',
      conversationId: 'e40c159d-2e63-4234-b4bf-9291b2da2871',
      messageId: 'e764a5df-0ca8-4178-b276-a16374d2a511',
      title: '请进行用药分析',
    },
    {
      detailId: '6896a52d900df00f6244b7d8',
      conversationId: '22856300-d15a-4ef6-91cf-7e1671fa72c8',
      messageId: '11b71aff-1b52-41c7-8090-79ce8c76b46f',
      title: '请进行用药分析',
    },
    {
      detailId: '6896a023900df00f6244b7d2',
      conversationId: 'b2bf265f-232a-4cbf-bb42-882274b3a511',
      messageId: 'c03b64e0-8eb3-43ea-85f8-f59cbec4b5b1',
      title: '请进行用药分析',
    },
    {
      detailId: '6883540f900df0b693e4ecb1',
      conversationId: '72f960b1-fc04-4ac1-b6cf-be8ac3f819c0',
      messageId: '5721f5d0-c205-42c0-bbb0-c95367614e93',
      title: '用药分析',
    },
  ],
}

// 默认数据配置
const DEFAULT_DATA = {
  categoryList: [
    {
      dictId: '682ed2e88b3eff48083c7f5a',
      value: '3',
      name: '药物研发',
    },
    {
      dictId: '6847d424d26f30251b21a3a4',
      value: '8',
      name: '门诊业务',
    },
    {
      dictId: '684a39cfd26f30e7504e0759',
      value: '12',
      name: '住院业务',
    },
    {
      dictId: '686de3ced26f30f72de48cdf',
      value: '17',
      name: '病历质控',
    },
  ],
  sourceApplicationList: [
    {
      appId: '18976162395066368',
      appName: '病历助手',
      agentInfo: {
        collectFlag: '1',
      },
    },
    {
      appId: '19622299330285568',
      appName: '用药分析',
      agentInfo: {
        collectFlag: '1',
      },
    },
  ],
}

/**
 * Shepherd 引导管理类
 */
export class ShepherdGuide {
  constructor(context) {
    this.context = context // AIAgent 组件实例
    this.shepherd = null
  }

  /**
   * 初始化 Shepherd 引导流程
   */
  async init() {
    try {
      // 初始化数据
      this._initializeData()

      await this.context.$nextTick()

      // 创建引导步骤
      const shepherdSteps = this._createShepherdSteps()

      // 初始化 Shepherd 实例
      this.shepherd = shepherd({ steps: shepherdSteps })
      this.shepherd.start()
    }
    catch (error) {
      console.error('初始化 Shepherd 引导失败:', error)
      // 降级处理：直接跳过引导
      this._skipShepherd()
    }
  }

  /**
   * 初始化数据
   */
  _initializeData() {
    this.context.currentView = 'findAgent'
    this.context.categoryList = DEFAULT_DATA.categoryList
    this.context.sourceApplicationList = DEFAULT_DATA.sourceApplicationList
  }

  /**
   * 跳过引导流程
   */
  _skipShepherd() {
    localStorage.setItem(SHEPHERD_CONFIG.STORAGE_KEY, true)
    this.context.refreshAgentList()
    this.context.currentAgent = {}
    this.context.currentAgentId = ''
    this.context.currentView = 'findAgent'
    console.log(this.context.chatList)
  }

  /**
   * 创建取消步骤按钮
   */
  _createCancelStep(text = '跳过') {
    return {
      action: () => {
        this._skipShepherd()
        return this.shepherd.cancel()
      },
      text,
    }
  }

  /**
   * 创建标准步骤按钮
   */
  _createStepButtons() {
    return [
      {
        action: () => this.shepherd.back(),
        text: '上一步',
      },
      {
        action: () => this.shepherd.next(),
        text: '下一步',
      },
      this._createCancelStep(),
    ]
  }

  /**
   * 安全的视图切换，带延迟和错误处理
   */
  _safeViewTransition(callback, delay = SHEPHERD_CONFIG.VIEW_TRANSITION_DELAY) {
    try {
      const currentStep = this.shepherd?.getCurrentStep()
      if (currentStep) {
        currentStep.hide()
      }

      setTimeout(() => {
        try {
          callback()
        }
        catch (error) {
          console.error('视图切换回调执行失败:', error)
        }
      }, delay)
    }
    catch (error) {
      console.error('视图切换失败:', error)
    }
  }

  /**
   * 创建所有引导步骤
   */
  _createShepherdSteps() {
    return [
      // 步骤1：标签页介绍
      {
        text: '这是标签页行，可自由切换智能体应用',
        attachTo: {
          element: '#tsAiAgent-find-agent-tabs',
          on: 'bottom',
        },
        buttons: this._createStepButtons(),
      },

      // 步骤2：收藏入口介绍
      {
        text: '这是收藏入口，可方便查找关注的智能体应用',
        attachTo: {
          element: '#tsAiAgent-find-agent-tabs-collect',
          on: 'bottom',
        },
        buttons: this._createStepButtons(),
      },

      // 步骤3：分类检索介绍
      {
        text: '这里可根据使用场景，进行智能体应用检索',
        attachTo: {
          element: '#tsAiAgent-find-agent-tabs-category',
          on: 'bottom',
        },
        buttons: this._createStepButtons(),
      },

      // 步骤4：关键字检索介绍
      {
        text: '这里可根据关键字，进行智能体应用检索',
        attachTo: {
          element: '#tsAiAgent-find-agent-search',
          on: 'bottom',
        },
        buttons: this._createStepButtons(),
      },

      // 步骤5：智能体应用介绍
      {
        text: '这是智能体应用，点击进入',
        attachTo: {
          element: '#tsAiAgent-find-agent-list',
          on: 'bottom',
        },
        buttons: [
          {
            action: () => this.shepherd.back(),
            text: '上一步',
          },
          {
            action: () => {
              this._switchToAgent()
              this._safeViewTransition(() => {
                this.context.$refs.chatAgent.chatList = SHEPHERD_CONFIG.DEMO_CHAT_LIST
                this.context.$refs.chatAgent.conversationList = SHEPHERD_CONFIG.DEMO_CONVERSATION_LIST
                this.shepherd.next()
              })
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤6：对话框介绍
      {
        text: '这里是对话框可输入提示词，与智能体进行交互。',
        attachTo: {
          element: '#tsAiAgent-chat-input',
          on: 'top',
        },
        buttons: [
          {
            action: () => {
              this.context.currentView = 'findAgent'
              this._safeViewTransition(() => {
                this.shepherd.back()
              })
            },
            text: '上一步',
          },
          {
            action: () => {
              this._showEditPrompt()
              this._safeViewTransition(() => {
                this.shepherd.next()
              })
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤7：编辑提示词介绍
      {
        text: '点击修改提示词，可编辑提示词，实现AI的精确控制。',
        attachTo: {
          element: '#tsAiAgent-edit-prompt',
          on: 'top',
        },
        buttons: [
          {
            action: () => {
              this._hideEditPrompt()
              this._safeViewTransition(() => {
                this.shepherd.back()
              })
            },
            text: '上一步',
          },
          {
            action: () => {
              this._hideEditPrompt()
              this._showHistory()
              this._safeViewTransition(() => {
                this.shepherd.next()
              })
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤8：历史对话介绍
      {
        text: '点击展开历史，这里是历史对话，可查看智能体应用的对话历史。',
        attachTo: {
          element: '#tsAiAgent-conversations-container',
          on: 'left',
        },
        buttons: [
          {
            action: () => {
              this._hideHistory()
              this._showEditPrompt()
              this._safeViewTransition(() => {
                this.shepherd.back()
              })
            },
            text: '上一步',
          },
          {
            action: () => {
              this._hideHistory()
              this._showParamsPanel()
              this._safeViewTransition(() => {
                this.shepherd.next()
              })
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤9：补充信息介绍
      {
        text: '点击补充信息，可配置智能体回答问题时参考的上下文信息。',
        attachTo: {
          element: '#tsAiAgent-params-panel',
          on: 'bottom',
        },
        buttons: [
          {
            action: () => {
              this._hideParamsPanel()
              this._showHistory()
              this._safeViewTransition(() => {
                this.shepherd.back()
              })
            },
            text: '上一步',
          },
          {
            action: () => {
              this._hideParamsPanel()
              this._safeViewTransition(() => {
                this.shepherd.next()
              })
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤10：发送消息介绍
      {
        text: '点击发送消息，可发送消息给智能体',
        attachTo: {
          element: '#tsAiAgent-chat-input-send',
          on: 'top',
        },
        buttons: [
          {
            action: () => {
              this._showParamsPanel()
              this._safeViewTransition(() => {
                this.shepherd.back()
              })
            },
            text: '上一步',
          },
          {
            action: () => {
              this.shepherd.next()
            },
            text: '下一步',
          },
          this._createCancelStep(),
        ],
      },

      // 步骤11：完成介绍
      {
        text: '可查看智能体的问题回复',
        attachTo: {
          element: '#tsAiAgent-chat-list-content',
          on: 'bottom',
        },
        buttons: [
          {
            action: () => {
              this.shepherd.back()
            },
            text: '上一步',
          },
          this._createCancelStep('完成'),
        ],
      },
    ]
  }

  /**
   * 切换到智能体页面
   */
  _switchToAgent() {
    this.context.currentAgent = SHEPHERD_CONFIG.DEMO_AGENT
    this.context.currentAgentId = SHEPHERD_CONFIG.DEMO_AGENT.agentInfo.id
    this.context.currentView = 'chatAgent'
  }

  /**
   * 显示编辑提示词界面
   */
  _showEditPrompt() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.isEditPrompt = true
      chatAgent.hasCustomParams = true
      chatAgent.cueWordDetail = SHEPHERD_CONFIG.DEMO_PROMPT
    }
  }

  /**
   * 隐藏编辑提示词界面
   */
  _hideEditPrompt() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.isEditPrompt = false
    }
  }

  /**
   * 显示历史对话
   */
  _showHistory() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.showHistory = true
    }
  }

  /**
   * 隐藏历史对话
   */
  _hideHistory() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.showHistory = false
    }
  }

  /**
   * 显示参数配置面板
   */
  _showParamsPanel() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.showParamsPanel = true
      chatAgent.configParams = SHEPHERD_CONFIG.DEMO_CONFIG_PARAMS
    }
  }

  /**
   * 隐藏参数配置面板
   */
  _hideParamsPanel() {
    const chatAgent = this.context.$refs.chatAgent
    if (chatAgent) {
      chatAgent.showParamsPanel = false
    }
  }

  /**
   * 销毁引导实例
   */
  destroy() {
    if (this.shepherd) {
      this.shepherd.cancel()
      this.shepherd = null
    }
  }
}
