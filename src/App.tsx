import { useEffect, useRef } from "react"

function App() {
  const el = useRef<HTMLCanvasElement>(null)

  interface Point {
    x: number
    y: number
  }

  interface Branch {
    start: Point
    length: number
    theta: number
  }

  useEffect(() => {
    const canvas = el.current!
    const ctx = canvas.getContext('2d')!

    function init() {
      ctx.strokeStyle = '#222'
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      step({
        start: { x: 300, y: 600 },
        length: 10,
        theta: -Math.PI / 2, // 夹角角度
      })
    }

    let pendingTasks: Function[] = []

    function step(b: Branch, depth = 0) {
      const end = getEndPoint(b)

      drawBranch(b)

      if (depth < 4 || Math.random() < 0.5) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta - 0.2 * Math.random(),
        }, depth + 1))
      }

      if (depth < 4 || Math.random() < 0.5) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta + 0.2 * Math.random(),
        }, depth + 1))
      }
    }

    function frame() {
      const tasks: Function[] = []

      pendingTasks = pendingTasks.filter((i) => {
        if (Math.random() > 0.4) {
          tasks.push(i)
          return false
        }
        return true
      })

      tasks.forEach(fn => fn())
    }

    let framesCount = 0

    // 实现动画效果
    function startFrame() {
      requestAnimationFrame(() => {
        framesCount += 1
        if (framesCount % 3 === 0)
          frame()
        startFrame()
      })
    }

    startFrame()

    function lineTo(p1: Point, p2: Point) {
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    function getEndPoint(b: Branch): Point {
      return {
        x: b.start.x + b.length * Math.cos(b.theta),
        y: b.start.y + b.length * Math.sin(b.theta),
      }
    }

    function drawBranch(b: Branch) {
      lineTo(b.start, getEndPoint(b))
    }

    init()
  })

  return (
    <canvas ref={el} width="600" height="600" scale-50 origin-top-left />
  );
}

export default App;
