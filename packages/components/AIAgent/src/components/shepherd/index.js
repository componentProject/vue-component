import Shepherd from 'shepherd.js'

import './index.scss'

// 定义一个统一的参数，因为是同一个系统的基本上都差不多一样的，不一样就通过函数参数去覆盖
const defaultConfig = {
    // 是否显示黑色遮罩层
    useModalOverlay: true,
    // 键盘按钮控制步骤
    keyboardNavigation: false,
    // 这里是创建了一个默认的 导航组件
    defaultStepOptions: {
        classes: 'shepherd-theme-arrows', // 可以自定义类名，方便调整一些样式什么的不会影响到其他的
        // 显示关闭按钮
        cancelIcon: {
            enabled: false,
        },
        scrollTo: { behavior: 'smooth', block: 'center' },
        // 高亮元素四周要填充的空白像素
        modalOverlayOpeningPadding: 8,
        // 空白像素的圆角
        modalOverlayOpeningRadius: 8,
        buttons: [
            {
                action() {
                    return this.back()
                },
                text: '上一步'
            }, {
                action() {
                    return this.next()
                },
                text: '下一步'
            },
            {
                action() {
                    return this.cancel()
                },
                text: '跳过'
            }
        ]
    }
}
// 通过函数的形式使用
const shepherd = (props = {}) => {
    const newProps = {
        ...defaultConfig,
        ...props
    }
    return new Shepherd.Tour(newProps)
}

export {
    shepherd
}
