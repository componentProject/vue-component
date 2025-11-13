<!-- AIAgent的dcwriter组件 -->
<template>
  <div class="dcwriterDiv">
    <div
      :id="`dcwriter${dcwriter_id}`"
      :ref="`dcwriter${dcwriter_id}`"
      class="dcwriter"
      dctype="WriterControlForWASM"
      AutoDispose="true"
      :DoubleBuffer="doubleBuffer"
      :RegisterCode="registerCode"
      :RuleVisible="ruleVisible"
      :RuleBackColor="ruleBackColor"
      :PageCssString222="pageCssString222"
      :PageTitlePosition="pageTitlePosition"
      :onload="onload(this)"
    >
      正在加载...
    </div>
  </div>
</template>

<script>
export default {
  name: 'DcWriter',
  props: {
    dcwriter_id: String,
    data: String,
  },
  data() {
    return {
      doubleBuffer: true,
      registerCode: `0526CAB1E8DBEF78FF87D3ED1703883589F6241F173D4E215E7994A492CCEB09779F0B3D1AF02514884AFAFA34E61DC209C7466C550528720334C11DD4442234AD4029BF38EA4B8859B95CEDB82BFA0257E629C0AC99AF977FC8337B3DE9FB3DFD09E221DD86FB5C1EE12EF528BC841863`,
      ruleVisible: true,
      ruleBackColor: 'rgb(230, 230, 230)',
      pageCssString222: 'box-shadow:3px 3px 3px grey',
      // ...其他数据属性...
      pageTitlePosition: 'BottomRight',
      documentOptions: {
        BehaviorOptions: {
          HandleCommandException: false,
          OutputFormatedXMLSource: false,
          ParagraphFlagFollowTableOrSection: true,
          AutoAssistInsertString: true,
        },
        ViewOptions: {
          EnableEncryptView: true,
          ShowInputFieldStateTag: true,
          IgnoreFieldBorderWhenPrint: false,
          PrintBackgroundText: false,
          PreserveBackgroundTextWhenPrint: true,
          FieldBorderPrintVisibility: 'hidden',
          FieldInvalidateValueForeColor: 'Blue',
          TagColorForNormalField: 'Green',
          TagColorForValueInvalidateField: 'Blue',
          UnEditableFieldBorderColor: 'Yellow',
        },
        SecurityOptions: {
          EnablePermission: true,
          EnableLogicDelete: true,
          ShowLogicDeletedContent: true,
          ShowPermissionTip: true,
          ShowPermissionMark: true,
        },
      },
      emrEditor: null,
    }
  },
  computed: {
    dcwriterNode() {
      return document.getElementById(`dcwriter${this.dcwriter_id}`)
    },
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.dcwriterNode.LoadDocumentFromString(newVal)
        }
      },
    },
  },
  created() {
    const that = this
    // 防止重复添加
    // if (!window.WriterControl_OnLoad) {
    /**
     * 控件加载完毕后会自动执行名为 WriterControl_OnLoad 的函数.该函数内的this变量指向HTML根元素
     * @param { WriterControl } rootElement
     */
    window.WriterControl_OnLoad = function (rootElement) {
      that.emrEditor = rootElement
      // 给编辑器赋值属性
      const documentOptions = that.documentOptions
      for (const i in documentOptions) {
        if (typeof documentOptions[i] == 'object') {
          for (const j in documentOptions[i]) {
            that.emrEditor.DocumentOptions[i][j] = documentOptions[i][j]
          }
        }
      }
      that.emrEditor.EventContentChanged = that.documentContentChanged

      that.emrEditor.ApplyDocumentOptions()
      //  && rootElement.IsValidateXML(that.data.xmlData) == true
      if (that.data) {
        that.emrEditor.LoadDocumentFromString(that.data)
        //that.test(rootElement);
      }
      //window.LoadFileLoading.close();
    }
  },
  mounted() {
    const ctl = this.dcwriterNode
    if (ctl) {
      // 启动时就已经加载好js，直接调用window.CreateWriterControlForWASM，不然使用EventBeforeCreateControl事件等待js加载完成
      if (typeof window.CreateWriterControlForWASM != 'function') {
        ctl.EventBeforeCreateControl = function (rootElement) {
          if (!rootElement.AboutControl) {
            window.CreateWriterControlForWASM(rootElement)
          }
        }
      }
      else {
        if (!ctl.AboutControl) {
          window.CreateWriterControlForWASM(ctl)
        }
      }
    }
  },
  unmounted() {},
  methods: {
    onload(rootElement) {},

    documentContentChanged(rootElement, args) {
      const properties = rootElement.GetElementProperties(args.ElementID)
      const obj = {
        id: args.ElementID,
        deCode: properties?.Attributes?.deCode,
        value: !properties?.InnerValue || properties?.InnerValue === '' ? '' : properties?.InnerValue,
        content: !properties?.InnerValue || properties?.InnerValue === '' ? '' : properties?.InnerText,
      }
      this.$emit('emrContentChanged', obj)
    },

    async test(rootElement) {
      for (const i in this.testData) {
        const item = this.testData[i]
        if (item.content) {
          rootElement.SetElementInnerValueStringByID(item.id, item.content, item.content)
        }
      }

      const content = JSON.stringify(this.testData)
      const res = await generateEmr(content)
      const createData = JSON.parse(res)
      for (const i in createData?.data) {
        const item = createData.data[i]
        const title = item.content?.title
        let value = item.content?.value
        if (!value) {
          value = title
        }

        rootElement.SetElementInnerValueStringByID(item.id, value, title)
      }
    },
    setElementInnerValueStringByID(id, value, title) {
      if (this.emrEditor) {
        this.emrEditor.SetElementInnerValueStringByID(id, value, title)
      }
    },
    getJsonData() {
      if (this.emrEditor) {
        return this.emrEditor.SaveDocumentToString('json')
      }
    },
    clearData() {
      if (this.emrEditor) {
        this.emrEditor.LoadDocumentFromString(this.data)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dcwriterDiv {
  height: 100%;
}
.dcwriter {
  height: 100%;
}
</style>
