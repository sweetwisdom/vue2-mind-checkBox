<template>
  <div ref="treeContainer" class="tree-container">
    <svg :width="width" :height="height">
      <!-- 使用 v-for 遍历 links，渲染每条连线 -->
      <path
        v-for="(link, i) in links"
        :key="link.source.data.id + '-' + link.target.data.id"
        class="link"
        :d="generatePath(link)"
        style="stroke: #1cb4a0; fill: none; stroke-width: 1.5px"
      />
      <!-- 使用 v-for 遍历 nodes，渲染每个节点 -->
      <g
        v-for="(node, key) in nodes"
        :key="key"
        :transform="'translate(' + node.y + ',' + (node.x - nodeHeight / 2) + ')'"
        class="node"
        :style="'font: ' + fontSize * fontNum + 'px sans-serif;'"
        @contextmenu.prevent="onContextmenu(node, $event)"
      >
        <!-- 节点的矩形背景 -->
        <rect
          dasharray="none"
          stroke-width="1"
          stroke="#D83B33"
          :width="getNodeWidth(node)"
          :height="nodeHeight"
          :style="'fill: ' + getNodeColor(node)"
        ></rect>

        <foreignObject width="130" height="30" :x="10" :y="(nodeHeight - 20) / 2">
          <el-checkbox :label="node.data.name"></el-checkbox>
        </foreignObject>

        <!-- 节点的数字文本 -->
        <!-- <text :dx="getNodeTextX(node)" :dy="(fontSize * fontNum + nodeHeight) / 2 - 2" style="text-anchor: start; fill: #fff" > aa </text> -->
        <!-- 新增按钮为当前增加子节点 -->
        <foreignObject width="130" height="25" :x="getNodeWidth(node) - 20" :y="(nodeHeight - 20) / 2"> </foreignObject>
      </g>
    </svg>
    <el-button @click="exportData" type="primary">导出数据</el-button>
  </div>
</template>

<script>

import { deepClone } from './unit.js'
// import * as d3  from 'd3-hierarchy';
import { select as d3Select } from 'd3-selection';
import MindMap from './mind-map.js' // 引入封装类

export default {
  props: ['value'], // 从父组件传递的数据
  data() {
    return {
      width: 900,
      height: 900,
      nodeHeight: 30,
      nodeWidth: { _0: 160, _1: 180, _2: 180, _3: 180, _4: 160 },
      fontSize: 10,
      fontNum: 1.2,
      nodes: [], // 用于存储树的节点
      links: [], // 用于存储树的链接
      mindMap: null, // MindMap实例
      contextMenuData: [],
      currentNode: null,
    }
  },
  watch: {},
  methods: {
    // 鼠标右键事件
    onContextmenu(node, event) {
      // console.log('⚠️:[ node ]🎈：', node)
      this.currentNode = node
      this.$contextmenu({
        items: this.contextMenuData,
        event, // 鼠标事件信息
        customClass: 'custom-class', // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 140, // 主菜单最小宽度
      })
      return false
    },
    getNodeWidth(node) {
      return (this.nodeWidth[`_${node.depth}`] || 100) - 20
    },
    getNodeColor(node) {
      if (node.type === '1') return '#EFEEF6'
      if (node.type === '2') return '#e3e3e1'
      return '#e3e3e1'
    },
    generatePath(link) {
      const lineOffsetWidth = this.getNodeWidth(link.source) + 10
      return `M${link.source.y} ${link.source.x} L${link.source.y + lineOffsetWidth} ${link.source.x} L${
        link.source.y + lineOffsetWidth
      } ${link.target.x} L${link.target.y} ${link.target.x}`
    },
    getNodeTextX(node) {
      return this.getNodeWidth(node) - 3 * this.fontSize * this.fontNum
    },
    // 新增、编辑、删除、插入子节点方法
    async addNode() {
      const prompt = await this.$prompt('请输入节点名称', '提示', {
        // 必填
        inputPattern: /[\w]/,
      }).catch(e => {})
      if (prompt.action !== 'confirm') {
        return
      }
      const parentId = this.currentNode.data.id

      const newNode = { name: prompt.value, id: Date.now().toString(), type: '1' }

      this.mindMap.addNode(parentId, newNode)
      this.updateData()
    },
    editNode() {
      const id = this.currentNode.data.id
      this.mindMap.editNode(id, 'aa')
      this.updateData()
    },
    deleteNode() {
      const id = this.currentNode.data.id
      this.mindMap.deleteNode(id)
      this.updateData()
    },
    updateData() {
      const updataData = this.mindMap.getCurrentData()
      const { nodes, links } = this.mindMap.update(updataData)
      this.nodes = nodes
      this.links = links
      this.$emit('input', updataData) // 触发 v-model 更新
      this.$emit('change', updataData) // 触发父组件 change 事件
    },
    exportData(){
      const data = deepClone(this.value)
      console.log('⚠️:[ data ]🎈：', data)
    }
  },
  mounted() {
    // 初始化 D3.js 树布局
    const svg = d3Select(this.$refs.treeContainer).select('svg')
    const mindData = deepClone(this.value)
    this.mindMap = new MindMap(svg, mindData, this.width, this.height)

    // 更新数据
    this.updateData()
  },
  created() {
    this.contextMenuData = [
      {
        label: '新增子节点',
        icon: 'el-icon-plus',
        onClick: this.addNode,
      },
      {
        label: '编辑节点',
        icon: 'el-icon-edit',
        onClick: this.editNode,
      },
      {
        label: '删除',
        icon: 'el-icon-delete',
        onClick: this.deleteNode,
      },
    ]
  },
}
</script>

<style scoped>
.tree-container {
  width: 100%;
  height: 100%;
}
.link {
  stroke: #0f87d4;
  fill: none;
  stroke-width: 1.5px;
}
.addBtn {
  color: #333;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    color: #32c1e9;
  }
}
.tree-container {
  width: 100%;
  height: 100%;
}
.link {
  stroke: #0f87d4;
  fill: none;
  stroke-width: 1.5px;
}
</style>
