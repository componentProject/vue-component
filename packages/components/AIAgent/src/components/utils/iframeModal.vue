<template>
    <div v-if="show" class="modal-mask" @click="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <span>预览</span>
                <span class="close-btn" @click="$emit('close')">&times;</span>
            </div>
            <div class="modal-body">
                <iframe class="iframe-container" :srcdoc="content" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss">
/* 弹窗样式 */
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    background: white;
    padding: 10px;
    border-radius: 8px;
    width: 70vw;
    max-width: 70vw;
    max-height: 80vh;
    position: relative;
    display: flex;
    flex-direction: column;
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        padding-bottom: 10px;
        color: #666;
        .close-btn {
            cursor: pointer;
            font-size: 28px;
        }
    }
    .modal-body {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .iframe-container {
            width: 100%;
            height: 70vh;
            border: none;
        }
    }
}
</style>
