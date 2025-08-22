<template>
    <div
        class="patient-card"
        :class="{ female: isFemale, loading: isLoading, disabled: isDisabled }"
        element-loading-background="rgba(122, 122, 122, 0.8)"
        :style="isDisabled ? 'pointer-events:none;filter:grayscale(1);opacity:0.6;' : ''"
    >
        <div class="patient-card-title">
            <div class="patient-card-title-left">
                <div class="patient-card-title-dot" />
                <span>待接诊</span>
            </div>
            <div class="patient-card-title-right">
                <span>{{ user['DE04.01.119.00'].content ? '预问诊' : '' }}</span>
            </div>
        </div>
        <div class="patient-card-content">
            <div class="patient-card-content-department">{{ user['DE08.10.026.00'].content }}</div>
            <div class="patient-card-content-info">
                <div class="patient-card-content-info-row">
                    <div class="patient-card-content-info-content">{{ user['DE02.01.039.01'].content }}</div>
                    <div class="patient-card-content-info-content">{{ user['DE02.01.026.00'].content }}岁</div>
                </div>
                <div class="patient-card-content-info-row">
                    <div class="patient-card-content-info-chief-complaint" :class="{ loading: isLoading }">
                        {{ user['DE04.01.119.00'].content ? user['DE04.01.119.00'].content : '未提供主诉信息' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        status: {
            type: String,
            default: 'normal', // normal | loading | disabled
            validator: v => ['normal', 'loading', 'disabled'].includes(v)
        }
    },
    computed: {
        isLoading() {
            return this.status === 'loading';
        },
        isDisabled() {
            return this.status === 'disabled';
        }
    },
    data() {
        return {
            isFemale: this.user['DE02.01.040.00'].content === '女性'
        };
    }
};
</script>

<style scoped>
.patient-card {
    width: 240px;
    height: 135px;
    background: linear-gradient(135deg, #1976d2 0%, #75ddf9 100%);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.4, 1.5, 0.5, 1);
}

.patient-card:hover {
    transform: scale(1.07);
    cursor: pointer;
}

.patient-card.female {
    background: linear-gradient(135deg, #d81b60 0%, #fce4ec 100%);
}

.patient-card.loading {
    cursor: wait !important;
}

.patient-card.disabled {
    filter: grayscale(0.5);
    opacity: 0.3;
    pointer-events: none;
}

.patient-card-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 12px;
    padding: 10px;
    box-sizing: border-box;
}

.patient-card-title-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
}

.patient-card-title-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
}

.patient-card-title-dot {
    width: 10px;
    height: 10px;
    background-color: #00e676;
    border-radius: 50%;
}

.patient-card-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.patient-card-content-department {
    width: 64px;
    height: 64px;
    background-color: #eee;
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    padding: 8px;
    box-sizing: border-box;
    line-height: 1.2;
}

.patient-card-content-info {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-size: 16px;
    gap: 10px;
}

.patient-card-content-info-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.patient-card-content-info-content {
    font-size: 16px;
    font-weight: bold;
}

.patient-card-content-info-chief-complaint {
    font-size: 12px;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
}

.patient-card-content-info-chief-complaint.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
    overflow: visible;
    text-overflow: unset;
    word-break: normal;
}

.loading-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-top: 2px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    vertical-align: middle;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
