<template>
  <div>
    <el-checkbox-group v-model="checkedCities">
      <!-- mind-checkbox -->
      <mind-checkbox v-model="treeData"></mind-checkbox>
    </el-checkbox-group>
    <div>
      <el-button type="primary" @click="testAdd">模拟新增</el-button>
    </div>
  </div>
</template>

<script>
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}
let treeData = {
  name: '供冷',
  id: '1',
  children: [
    {
      name: '分布式供暖',
      id: '2',
      type: '1',
      children: [
        {
          name: '多联式空调',
          id: '2-1',
          type: '1',
        },
        {
          name: '分体式空调',
          id: '2-2',
          type: '1',
        },
        {
          name: '风管机',
          id: '2-3',
          type: '1',
        },
      ],
    },
    {
      name: '集中式供暖',
      id: '3',
      type: '1',
      children: [
        {
          name: '用电式',
          id: '3-1',
          type: '1',
          children: [
            {
              name: '用电式',
              id: '3-1-1',
              type: '1',
            },
            {
              name: '空气源热泵',
              id: '3-1-2',
              type: '1',
            },
            {
              name: '地热源热泵',
              id: '3-1-3',
              type: '1',
            },
            {
              name: '水源热泵',
              id: '3-1-4',
              type: '1',
            },
          ],
        },
        {
          name: '市政供暖',
          id: '3-3',
          type: '1',
          children: [
            {
              name: '按面积收费',
              id: '3-3-1',
              type: '1',
            },
            {
              name: '按基础+计量收费',
              id: '3-3-2',
              type: '1',
            },
          ],
        },
        {
          name: '用天然气式供暖',
          id: '3-2',
          type: '1',
          children: [
            {
              name: '直燃机',
              id: '3-2-1',
              type: '1',
            },
            {
              name: '天然气锅炉',
              id: '3-2-2',
              type: '1',
            },
            {
              name: '燃气热泵',
              id: '3-2-3',
              type: '1',
            },
          ],
        },
      ],
    },
  ],
};

export default {
  data() {
    return {
      checkedCities: [],
      treeData: deepClone(treeData),
    };
  },
  
  computed: {},
  props: {},
  watch: {},
  mounted() {},
  created() {},

  methods: {
    // this.$emit('add-child', node.id)
    // 新增字节点的方法
    handleAddChild(node) {
      // 新增节点的处理逻辑
      const newNode = { name: 'New Child', id: new Date().getTime(), type: '1' };

      // 找到点击的节点并添加一个新的子节点
      const addNodeRecursively = (currentNode) => {
        if (currentNode === node) {
          currentNode.children = currentNode.children || [];
          currentNode.children.push(newNode);
        } else if (currentNode.children) {
          currentNode.children.forEach(addNodeRecursively);
        }
      };

      addNodeRecursively(this.treeData);

      // 重新渲染树
      this.treeData = { ...this.treeData };
    },
    testAdd() {
      this.treeData = {};
      const name = this.$prompt('请输入新增节点名称', '提示');
      const tem = deepClone(treeData);
      name.then(({ value }) => {
        const newNode = { name: value, id: new Date().getTime(), type: '1' };
        console.log('⚠️:[ newNode ]🎈：', newNode);
        tem.children.push(newNode);
        console.log('⚠️:[ treeData ]🎈：', treeData);
        this.treeData = tem;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
