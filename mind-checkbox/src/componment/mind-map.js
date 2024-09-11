// 新增文件 mind-map.js
import * as d3  from 'd3-hierarchy';

class MindMap {
  constructor(svg, rootData, width, height) {
    this.svg = svg
    this.rootData = rootData
    this.width = width
    this.height = height
    this.treeLayout = d3.tree().size([this.width, this.height - 200])
  }

  update(data) {
    // 生成节点和链接数据
    const nodes = this.treeLayout(d3.hierarchy(data))
    const links = nodes.links()
    return { nodes: nodes.descendants(), links }
  }

  addNode(parentId, newNode) {
    const parentNode = this.findNodeById(this.rootData, parentId)
    if (parentNode) {
      parentNode.children = parentNode.children || []
      parentNode.children.push(newNode)
    }
  }

  editNode(id, updatedNode) {
    const node = this.findNodeById(this.rootData, id)
    if (node) {
      Object.assign(node, updatedNode)
    }
  }

  deleteNode(id) {
    const deleteRecursive = (node, id) => {
      if (!node.children) return false
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].id === id) {
          node.children.splice(i, 1)
          return true
        }
        if (deleteRecursive(node.children[i], id)) return true
      }
      return false
    }
    console.log('⚠️:[ this.rootData ]🎈：', this.rootData)
    deleteRecursive(this.rootData, id)
  }

  findNodeById(node, id) {
    if (node.id === id) return node
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeById(child, id)
        if (found) return found
      }
    }
    return null
  }
  getCurrentData() {
    // 新增方法：返回当前的数据状态
    return this.rootData
  }
}

export default MindMap
