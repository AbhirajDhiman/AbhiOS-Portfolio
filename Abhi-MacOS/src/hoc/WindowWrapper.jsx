import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useWindowStore from '#store/window';
import WindowControls from '#components/WindowControls.jsx';

const defaultWindowStyle = {
  position: 'absolute',
  left: '22%',
  top: '12%',
  width: '720px',
  height: '420px',
  borderRadius: '16px',
  overflow: 'hidden',
  background: 'rgba(18, 22, 33, 0.96)',
  boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(14px)',
  transformOrigin: 'center center',
};

const WindowWrapper = (Component, windowKey, options = {}) => {
  const Wrapped = (props) => {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore();
    const state = windows[windowKey] ?? { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1000 };
    const { isOpen, isMinimized, isMaximized, zIndex } = state;
    const ref = useRef(null);

    useEffect(() => {
      if (!ref.current || !isOpen || isMinimized) return undefined;

      const target = {
        autoAlpha: 1,
        scale: 1,
        y: 0,
      };

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.fromTo(
        ref.current,
        { autoAlpha: 0, scale: 0.9, y: 18 },
        target,
      );

      return () => timeline.kill();
    }, [isOpen, isMinimized]);

    useEffect(() => {
      if (!ref.current || !isOpen || isMinimized) return;

      const targetStyles = isMaximized
        ? {
            left: '20px',
            top: '20px',
            width: 'calc(100vw - 40px)',
            height: 'calc(100vh - 90px)',
          }
        : {
            left: options.left ?? '22%',
            top: options.top ?? '12%',
            width: options.width ?? '720px',
            height: options.height ?? '420px',
          };

      gsap.to(ref.current, {
        ...targetStyles,
        duration: 0.26,
        ease: 'power3.out',
      });
    }, [isMaximized, isOpen, isMinimized, options]);

    if (!isOpen || isMinimized) return null;

    const handleClose = () => {
      if (!ref.current) {
        closeWindow(windowKey);
        return;
      }

      gsap.to(ref.current, {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.22,
        ease: 'power3.in',
        onComplete: () => closeWindow(windowKey),
      });
    };

    const handleMinimize = () => {
      if (!ref.current) return;

      gsap.to(ref.current, {
        autoAlpha: 0.2,
        y: 18,
        scale: 0.98,
        duration: 0.2,
        ease: 'power3.out',
        onComplete: () => minimizeWindow(windowKey),
      });
    };

    const handleMaximize = () => {
      maximizeWindow(windowKey);
      focusWindow(windowKey);
    };

    const title = options.title ?? windowKey;

    return (
      <div
        ref={ref}
        id={windowKey}
        style={{
          ...defaultWindowStyle,
          left: isMaximized ? '20px' : options.left ?? '22%',
          top: isMaximized ? '20px' : options.top ?? '12%',
          width: isMaximized ? 'calc(100vw - 40px)' : options.width ?? '720px',
          height: isMaximized ? 'calc(100vh - 90px)' : options.height ?? '420px',
          zIndex,
        }}
        onMouseDown={() => focusWindow(windowKey)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(32, 38, 48, 0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <WindowControls targetWindowKey={windowKey} />
            <span style={{ color: '#f3f6ff', fontWeight: 700, fontSize: 18 }}>{title}</span>
          </div>
        </div>

        <div
          style={{
            height: 'calc(100% - 48px)',
            background: 'rgba(17, 22, 33, 0.9)',
            overflow: 'hidden',
          }}
        >
          <Component {...props} />
        </div>
      </div>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

  return Wrapped;
};

export default WindowWrapper;
