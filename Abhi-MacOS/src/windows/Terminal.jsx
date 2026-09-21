import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import useWindowStore from '#store/window'

gsap.registerPlugin(Draggable)

const techStack = [
  { category: 'Frontend', items: 'React.js, Next.js, TypeScript' },
  { category: 'Mobile', items: 'React Native, Expo' },
  { category: 'Styling', items: 'Tailwind CSS, Sass, CSS' },
  { category: 'Backend', items: 'Node.js, Express, NestJS, Hono' },
  { category: 'Database', items: 'MongoDB, PostgreSQL' },
  { category: 'Dev Tools', items: 'Git, GitHub, Docker' },
]

const Terminal = () => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore()
  const ref = useRef(null)
  const headerRef = useRef(null)
  const [isClosing, setIsClosing] = useState(false)
  const isOpen = windows.terminal?.isOpen
  const zIndex = windows.terminal?.zIndex ?? 1000

  useEffect(() => {
    if (!ref.current || !isOpen || isClosing) return undefined

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    timeline.fromTo(
      ref.current,
      { autoAlpha: 0, scale: 0.9, y: 18 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.28 },
    )

    const dragInstance = Draggable.create(ref.current, {
      trigger: headerRef.current,
      type: 'x,y',
      inertia: true,
      allowContextMenu: false,
      bounds: document.body,
      onPress: () => focusWindow('terminal'),
      onDragStart: () => {
        document.body.style.cursor = 'grabbing';
        focusWindow('terminal');
      },
      onDragEnd: () => {
        document.body.style.cursor = '';
      },
    })

    return () => {
      timeline.kill()
      dragInstance.forEach((item) => item.kill())
      document.body.style.cursor = ''
    }
  }, [isOpen, isClosing, focusWindow])

  const handleClose = () => {
    if (!ref.current) {
      closeWindow('terminal')
      return
    }

    setIsClosing(true)
    gsap.to(ref.current, {
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.24,
      ease: 'power3.in',
      onComplete: () => closeWindow('terminal'),
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '22%',
        top: '12%',
        width: '576px',
        height: '480px',
        zIndex,
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 24px 65px rgba(0, 0, 0, 0.28)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
      onMouseDown={() => focusWindow('terminal')}
    >
      <div
        ref={headerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close terminal"
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#ff6157',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
          <button
            type="button"
            aria-label="Minimize terminal"
            onClick={() => minimizeWindow('terminal')}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#ffc030',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
          <button
            type="button"
            aria-label="Maximize terminal"
            onClick={() => maximizeWindow('terminal')}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#2acb42',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        </div>

        <span
          style={{
            color: '#111827',
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1,
            fontFamily: 'Georama, sans-serif',
          }}
        >
          Tech Stack
        </span>

        <div style={{ width: 58 }} />
      </div>

      <div
        style={{
          padding: '20px',
          background: '#ffffff',
          color: '#111827',
          fontFamily: 'Roboto Mono, monospace',
          fontSize: 14,
          lineHeight: 1.5,
          height: 'calc(100% - 49px)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color: '#6b7280', marginBottom: 18 }}>
          <span style={{ color: '#111827' }}>@abhiraj</span>
          <span> % </span>
          <span style={{ color: '#111827' }}>show tech stack</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '128px 1fr',
            rowGap: 6,
            columnGap: 12,
            marginBottom: 14,
            borderBottom: '1px dashed #d1d5db',
            paddingBottom: 14,
          }}
        >
          <div style={{ color: '#111827', fontWeight: 700 }}>Category</div>
          <div style={{ color: '#111827', fontWeight: 700 }}>Technologies</div>

          {techStack.map(({ category, items }) => (
            <React.Fragment key={category}>
              <div
                style={{
                  color: '#00a154',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ color: '#00a154' }}>✓</span>
                {category}
              </div>
              <div style={{ color: '#111827' }}>{items}</div>
            </React.Fragment>
          ))}
        </div>

        <div style={{ color: '#00a154', marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>✓</span>
          <span>
            5 of 5 stacks loaded successfully <span style={{ color: '#6b7280' }}>(100%)</span>
          </span>
        </div>

        <div style={{ color: '#6b7280', marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⟲</span>
          <span>Render time: <span style={{ color: '#2563eb' }}>2ms</span></span>
        </div>
      </div>
    </div>
  )
}

export default Terminal
