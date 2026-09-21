import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Search } from 'lucide-react';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { locations } from '#constants';

gsap.registerPlugin(Draggable);

const Finder = () => {
  const { windows, focusWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const ref = useRef(null);
  const headerRef = useRef(null);
  const isOpen = windows.finder?.isOpen;
  const zIndex = windows.finder?.zIndex ?? 1000;

  useEffect(() => {
    if (!ref.current || !isOpen) return undefined;

    const dragInstance = Draggable.create(ref.current, {
      trigger: headerRef.current,
      type: 'x,y',
      bounds: document.body,
      onPress: () => focusWindow('finder'),
    });

    return () => dragInstance.forEach((instance) => instance.kill());
  }, [focusWindow, isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={ref} id="finder" style={{ zIndex }} onMouseDown={() => focusWindow('finder')}>
      <div ref={headerRef} id="window-header">
        <WindowControls targetWindowKey="finder" />
        <Search className="icon" size={16} />
      </div>

      <div className="bg-white flex h-full">
        <aside className="sidebar">
          <div>
            <h3>Favorites</h3>
            <ul>
              {Object.values(locations).map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveLocation(item)}
                  className={item.id === activeLocation.id ? 'active' : 'not-active'}
                >
                  <img src={item.icon} className="w-4" alt={item.name} />
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Locations</h3>
            <ul>
              <li className="not-active">
                <img src="/icons/computer.svg" className="w-4" alt="Computer" />
                <p className="text-sm font-medium">Computer</p>
              </li>
            </ul>
          </div>
        </aside>

        <section className="content">
          <ul>
            {activeLocation.children.map((item) => (
              <li key={item.id} className={item.position}>
                <img src={item.icon} alt={item.name} />
                <p>{item.name}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Finder;
