// 计算120个节点的稳定位置
// 运行: node calculate-positions.js

const canvasW = 1000
const canvasH = 600

// 120个节点，4个类别
const categories = ['role', 'func', 'tech', 'principle']
const nodes = []

// 初始化节点位置（交错分布）
for (let i = 0; i < 120; i++) {
  const catIndex = i % 4
  const groupIndex = Math.floor(i / 4)
  
  // 初始位置：按网格交错分布
  const col = groupIndex % 10
  const row = Math.floor(groupIndex / 10)
  
  nodes.push({
    id: i,
    category: categories[catIndex],
    x: 100 + col * 80 + (Math.random() - 0.5) * 40,
    y: 80 + row * 100 + (Math.random() - 0.5) * 40,
    vx: 0,
    vy: 0
  })
}

// 力导向模拟
const repulsion = 300
const attraction = 0.02
const centerForce = 0.008  // 增大中心引力，防止节点跑太远
const damping = 0.95

function simulate(iterations) {
  for (let iter = 0; iter < iterations; iter++) {
    // 斥力
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x
        const dy = nodes[j].y - nodes[i].y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = repulsion / (dist * dist)
        
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        nodes[i].vx -= fx
        nodes[i].vy -= fy
        nodes[j].vx += fx
        nodes[j].vy += fy
      }
    }

    // 中心引力
    const centerX = canvasW / 2
    const centerY = canvasH / 2
    nodes.forEach(node => {
      node.vx += (centerX - node.x) * centerForce
      node.vy += (centerY - node.y) * centerForce
    })

    // 更新位置
    nodes.forEach(node => {
      node.vx *= damping
      node.vy *= damping
      node.x += node.vx
      node.y += node.vy
      
      // 限制节点不能跑出画布太远
      const margin = 50
      node.x = Math.max(-margin, Math.min(canvasW + margin, node.x))
      node.y = Math.max(-margin, Math.min(canvasH + margin, node.y))
    })
  }
}

// 运行300次迭代
simulate(300)

// 输出结果
console.log('const agentNodePositions = [')
nodes.forEach((node, i) => {
  const catIndex = categories.indexOf(node.category)
  console.log(`  { x: ${Math.round(node.x)}, y: ${Math.round(node.y)}, category: '${node.category}' }, // ${i}`)
})
console.log(']')

// 统计各类别位置范围
console.log('\n// 各类别位置统计:')
categories.forEach(cat => {
  const catNodes = nodes.filter(n => n.category === cat)
  const xs = catNodes.map(n => n.x)
  const ys = catNodes.map(n => n.y)
  console.log(`// ${cat}: x[${Math.round(Math.min(...xs))}, ${Math.round(Math.max(...xs))}], y[${Math.round(Math.min(...ys))}, ${Math.round(Math.max(...ys))}]`)
})
