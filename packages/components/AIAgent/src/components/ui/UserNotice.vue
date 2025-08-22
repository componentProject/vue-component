<template>
    <div class="user-notice-container">
        <div class="notice-content">
            <h1 class="notice-title">医疗AI应用服务用户须知</h1>

            <div class="notice-text">
                <p>根据国家《个人信息保护法》《生成式人工智能服务管理暂行办法》等法规，您使用本院AI服务须知悉：</p>
            </div>

            <div class="notice-sections">
                <div class="notice-section">
                    <h2 class="section-title">1.服务性质​​</h2>
                    <p class="section-content">
                        AI生成内容（诊断建议/病历等）​​仅供参考​​，最终诊疗决策必须由执业医师作出。
                        <span class="highlight"
                            >诊断类AI系统均已通过国家药监局三类医疗器械认证（注册证号公示于医院官网）-待定。</span
                        >。 知识库来源于人卫生教材、临床指南、专家共识等，详情参见附件列表。
                    </p>
                </div>

                <div class="notice-section">
                    <h2 class="section-title">2.​数据授权​​</h2>
                    <p class="section-content">
                        使用即授权AI处理本次诊疗相关数据（含症状描述、检验报告）。敏感信息将​​去标识化加密传输，星助手及智能体应用不存储任何患者​​诊疗相关数据。
                    </p>
                </div>

                <div class="notice-section">
                    <h2 class="section-title">​​3.责任声明​​</h2>
                    <p class="section-content">
                        AI技术缺陷由服务商担责（依《产品质量法》），医生误采AI建议属医疗责任事故，患者隐瞒病史需自行承担后果。
                    </p>
                </div>
            </div>

            <div class="contact-info">
                <p>监管电话：XXX-123456（医院AI伦理委员会）</p>
            </div>

            <div class="button-container">
                <button class="confirm-button" @click="handleConfirm">我已知晓</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserNotice',
    data() {
        return {};
    },
    methods: {
        handleConfirm() {
            this.$emit('confirm');
        }
    }
};
</script>

<style scoped>
.user-notice-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.notice-content {
    padding: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 32px);
    width: calc(100% - 32px);
}

.notice-title {
    text-align: center;
    color: #333;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 2px solid #4caf50;
    padding-bottom: 10px;
}

.notice-text {
    margin-bottom: 25px;
}

.notice-text p {
    line-height: 1.6;
    color: #555;
    font-size: 14px;
}

.notice-sections {
    margin-bottom: 25px;
}

.notice-section {
    margin-bottom: 20px;
}

.section-title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    border-left: 4px solid #4caf50;
    padding-left: 10px;
}

.section-content {
    line-height: 1.8;
    color: #666;
    font-size: 14px;
    margin-left: 14px;
    text-align: justify;
}

.highlight {
    color: #4caf50;
    font-weight: 500;
}

.contact-info {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 25px;
    border-left: 4px solid #ff9800;
}

.contact-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
    font-weight: 500;
}

.button-container {
    text-align: center;
}

.confirm-button {
    background-color: #3a77ff;
    color: white;
    border: none;
    padding: 8px 40px;
    font-size: 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    min-width: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .notice-content {
        margin: 10px;
        padding: 20px;
        max-width: none;
    }

    .notice-title {
        font-size: 20px;
    }

    .section-title {
        font-size: 15px;
    }

    .section-content,
    .notice-text p,
    .contact-info p {
        font-size: 13px;
    }
}
</style>
