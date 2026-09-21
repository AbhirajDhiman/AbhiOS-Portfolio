import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoveRight,
  PanelLeft,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  ShieldHalf,
} from 'lucide-react';
import useWindowStore from '#store/window';
import WindowControls from '#components/WindowControls.jsx';
import { blogPosts } from '#constants';

gsap.registerPlugin(Draggable);

const Safari = () => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore();
  const ref = useRef(null);
  const headerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const isOpen = windows.safari?.isOpen;
  const zIndex = windows.safari?.zIndex ?? 1000;

  useEffect(() => {
    if (!ref.current || !isOpen || isClosing) return undefined;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.fromTo(
      ref.current,
      { autoAlpha: 0, scale: 0.92, y: 18 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.28 },
    );

    const dragInstance = Draggable.create(ref.current, {
      trigger: headerRef.current,
      type: 'x,y',
      inertia: true,
      allowContextMenu: false,
      bounds: document.body,
      onPress: () => focusWindow('safari'),
      onDragStart: () => {
        document.body.style.cursor = 'grabbing';
        focusWindow('safari');
      },
      onDragEnd: () => {
        document.body.style.cursor = '';
      },
    });

    return () => {
      timeline.kill();
      dragInstance.forEach((item) => item.kill());
      document.body.style.cursor = '';
    };
  }, [focusWindow, isClosing, isOpen]);

  const handleClose = () => {
    if (!ref.current) {
      closeWindow('safari');
      return;
    }

    setIsClosing(true);
    gsap.to(ref.current, {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.24,
      ease: 'power3.in',
      onComplete: () => closeWindow('safari'),
    });
  };

  const handleMinimize = () => minimizeWindow('safari');
  const handleMaximize = () => maximizeWindow('safari');

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      id="safari"
      style={{
        position: 'absolute',
        left: '22%',
        top: '12%',
        width: '820px',
        height: '520px',
        zIndex,
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(18, 22, 33, 0.96)',
        boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(14px)',
      }}
      onMouseDown={() => focusWindow('safari')}
    >
      <div
        ref={headerRef}
        id="window-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '10px 14px',
          background: 'rgba(250, 250, 250, 0.98)',
          borderBottom: '1px solid rgba(17,24,39,0.08)',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <WindowControls targetWindowKey="safari" />
          <button type="button" onClick={handleMinimize} aria-label="Minimize safari" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PanelLeft size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="flex items-center gap-1 ml-5">
            <button type="button" aria-label="Go back" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Go forward" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} />
            </button>
            <button type="button" aria-label="Refresh page" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCcw size={16} />
            </button>
          </div>
          <div className="search" style={{ width: '60%', minWidth: '320px' }}>
            <ShieldHalf size={14} color="#6b7280" />
            <Search size={14} color="#6b7280" />
            <input
              type="text"
              value="https://jsmastery.com/blog"
              readOnly
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent',
                color: '#374151',
                fontSize: '12px',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
            <button type="button" aria-label="Share" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={14} />
            </button>
            <button type="button" aria-label="Add tab" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} />
            </button>
            <button type="button" aria-label="Copy link" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Copy size={14} />
            </button>
          </div>
        </div>

        <button type="button" onClick={handleMaximize} aria-label="Maximize safari" className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoveRight size={15} />
        </button>
      </div>

      <div className="blog" style={{ height: 'calc(100% - 57px)', overflowY: 'auto', background: '#f5f5f7' }}>
        <div>
          <h2>My Developer Blog</h2>

          {blogPosts.map((post) => (
            <div key={post.id} className="blog-post">
              <img src={post.image} alt={post.title} />
              <div className="content">
                <p>{post.date}</p>
                <h3>{post.title}</h3>
                <a href={post.link} target="_blank" rel="noreferrer">
                  Check out the full post
                  <MoveRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Safari;
