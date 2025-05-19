/**
 * 图表组件定义
 * 包含ECharts和AntV/G2的可视化组件
 */
import type { ComponentDefinition } from '../../types';
import { ComponentCategory } from '../../types';

/**
 * 图表组件列表
 */
export const chartComponents: ComponentDefinition[] = [
  {
    type: 'echarts-line',
    category: ComponentCategory.CHART,
    name: '折线图',
    icon: 'el-icon-data-line',
    defaultProps: {
      title: '折线图',
      height: '300px',
      data: {
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '系列1',
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          },
          {
            name: '系列2',
            data: [80, 100, 121, 104, 105, 90, 100],
            type: 'line'
          }
        ],
        legend: {
          data: ['系列1', '系列2']
        }
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'echarts-bar',
    category: ComponentCategory.CHART,
    name: '柱状图',
    icon: 'el-icon-data-analysis',
    defaultProps: {
      title: '柱状图',
      height: '300px',
      data: {
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '系列1',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          },
          {
            name: '系列2',
            data: [60, 70, 80, 90, 100, 110, 120],
            type: 'bar'
          }
        ],
        legend: {
          data: ['系列1', '系列2']
        }
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'echarts-pie',
    category: ComponentCategory.CHART,
    name: '饼图',
    icon: 'el-icon-pie-chart',
    defaultProps: {
      title: '饼图',
      height: '300px',
      data: {
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'echarts-scatter',
    category: ComponentCategory.CHART,
    name: '散点图',
    icon: 'el-icon-more',
    defaultProps: {
      title: '散点图',
      height: '300px',
      data: {
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.0, 6.95],
              [13.0, 7.58],
              [9.0, 8.81],
              [11.0, 8.33],
              [14.0, 9.96],
              [6.0, 7.24],
              [4.0, 4.26],
              [12.0, 10.84],
              [7.0, 4.82],
              [5.0, 5.68]
            ],
            type: 'scatter'
          }
        ]
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'echarts-radar',
    category: ComponentCategory.CHART,
    name: '雷达图',
    icon: 'el-icon-discover',
    defaultProps: {
      title: '雷达图',
      height: '300px',
      data: {
        radar: {
          indicator: [
            { name: '销售', max: 6500 },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客服', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '市场', max: 25000 }
          ]
        },
        series: [
          {
            name: '预算 vs 开销',
            type: 'radar',
            data: [
              {
                value: [4200, 10000, 20000, 35000, 50000, 18000],
                name: '预算分配'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '实际开销'
              }
            ]
          }
        ]
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'echarts-heatmap',
    category: ComponentCategory.CHART,
    name: '热力图',
    icon: 'el-icon-help',
    defaultProps: {
      title: '热力图',
      height: '300px',
      data: {
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'category',
          data: ['上午', '中午', '下午', '傍晚', '晚上']
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true
        },
        series: [
          {
            name: '热力值',
            type: 'heatmap',
            data: [
              [0, 0, 5], [0, 1, 7], [0, 2, 3], [0, 3, 5], [0, 4, 2],
              [1, 0, 1], [1, 1, 6], [1, 2, 8], [1, 3, 4], [1, 4, 7],
              [2, 0, 3], [2, 1, 2], [2, 2, 9], [2, 3, 2], [2, 4, 7],
              [3, 0, 5], [3, 1, 1], [3, 2, 3], [3, 3, 6], [3, 4, 5],
              [4, 0, 7], [4, 1, 8], [4, 2, 2], [4, 3, 4], [4, 4, 9],
              [5, 0, 1], [5, 1, 4], [5, 2, 7], [5, 3, 9], [5, 4, 3],
              [6, 0, 2], [6, 1, 5], [6, 2, 8], [6, 3, 1], [6, 4, 4]
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'g2-line',
    category: ComponentCategory.CHART,
    name: 'G2折线图',
    icon: 'el-icon-finished',
    defaultProps: {
      title: 'G2折线图',
      height: '300px',
      data: [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 }
      ],
      config: {
        xField: 'year',
        yField: 'value',
        point: {
          size: 5,
          shape: 'diamond'
        },
        smooth: true
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'g2-column',
    category: ComponentCategory.CHART,
    name: 'G2柱状图',
    icon: 'el-icon-coin',
    defaultProps: {
      title: 'G2柱状图',
      height: '300px',
      data: [
        { type: '家具家电', sales: 38 },
        { type: '粮油副食', sales: 52 },
        { type: '生鲜水果', sales: 61 },
        { type: '美容洗护', sales: 145 },
        { type: '母婴用品', sales: 48 },
        { type: '进口食品', sales: 38 },
        { type: '食品饮料', sales: 38 },
        { type: '家庭清洁', sales: 38 }
      ],
      config: {
        xField: 'type',
        yField: 'sales',
        meta: {
          type: {
            alias: '类别'
          },
          sales: {
            alias: '销售额'
          }
        }
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'g2-pie',
    category: ComponentCategory.CHART,
    name: 'G2饼图',
    icon: 'el-icon-video-camera',
    defaultProps: {
      title: 'G2饼图',
      height: '300px',
      data: [
        { type: '分类一', value: 27 },
        { type: '分类二', value: 25 },
        { type: '分类三', value: 18 },
        { type: '分类四', value: 15 },
        { type: '分类五', value: 10 },
        { type: '其他', value: 5 }
      ],
      config: {
        appendPadding: 10,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}\n{percentage}'
        },
        interactions: [
          { type: 'element-selected' },
          { type: 'element-active' }
        ]
      }
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  }
]; 