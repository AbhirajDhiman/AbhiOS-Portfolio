import { useEffect, useRef } from 'react'
import { dockApps } from '#constants'
import gsap from 'gsap'
import { Tooltip } from 'react-tooltip'
import useWindowStore from '#store/window'

const Dock = ({ toggleApp = () => {} }) => {
  const { openWindow, closeWindow, windows } = useWindowStore()
  const dockRef = useRef(null)

  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return undefined

    const icons = [...dock.querySelectorAll('.dock-icon')]
    const smoothScales = icons.map((icon) =>
      gsap.quickTo(icon, 'scale', {
        duration: 0.35,
        ease: 'power3.out',
      }),
    )
    const smoothLifts = icons.map((icon) =>
      gsap.quickTo(icon, 'y', {
        duration: 0.35,
        ease: 'power3.out',
      }),
    )
    let iconCenters = []

    const updateIconCenters = () => {
      const dockRect = dock.getBoundingClientRect()
      iconCenters = icons.map((icon) => {
        const iconRect = icon.getBoundingClientRect()
        return iconRect.left - dockRect.left + iconRect.width / 2
      })
    }

    updateIconCenters()

    const animateIcons = (mouseX) => {
      iconCenters.forEach((center, index) => {
        const distance = Math.abs(mouseX - center)
        const intensity = Math.exp(-(distance ** 2) / 5000)

        smoothScales[index](1 + 0.25 * intensity)
        smoothLifts[index](-15 * intensity)
      })
    }

    const handleMouseMove = (event) => {
      const { left } = dock.getBoundingClientRect()
      animateIcons(event.clientX - left)
    }

    const resetIcons = () => {
      smoothScales.forEach((setScale) => setScale(1))
      smoothLifts.forEach((setLift) => setLift(0))
    }

    dock.addEventListener('pointermove', handleMouseMove)
    dock.addEventListener('mouseleave', resetIcons)
    window.addEventListener('resize', updateIconCenters)

    return () => {
      dock.removeEventListener('pointermove', handleMouseMove)
      dock.removeEventListener('mouseleave', resetIcons)
      window.removeEventListener('resize', updateIconCenters)
      gsap.killTweensOf(icons)
    }
  }, [])

  const handleOpenToggle = (id, canOpen) => {
    if (!canOpen) return

    if (windows[id]?.isOpen) {
      closeWindow(id)
      return
    }

    openWindow(id)
  }

  return (
    <section id="dock" aria-label="Application dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              disabled={!canOpen}
              onClick={() => {
                if (toggleApp) toggleApp(id, canOpen)
                handleOpenToggle(id, canOpen)
              }}
            >
              <img src={`/public/images/${icon}`} alt="" />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" effect="solid" className="tooltip" />
      </div>
    </section>
  )
}

export default Dock
