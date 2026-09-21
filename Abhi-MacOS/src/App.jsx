import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Dock, Navbar, Welcome } from '#components'
import useWindowStore from '#store/window'
import { Terminal, Safari, Resume, Finder } from '#windows'

gsap.registerPlugin(Draggable);

const App = () => {
  const { openWindow, closeWindow, windows } = useWindowStore();

  const toggleApp = (id, canOpen = true) => {
    if (!canOpen) return

    if (windows[id]?.isOpen) {
      closeWindow(id)
      return
    }

    openWindow(id)
  }

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock toggleApp={toggleApp} />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
    </main>
  )
}

export default App
