import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Document, Page, pdfjs } from 'react-pdf';
import useWindowStore from '#store/window';
import WindowControls from '#components/WindowControls.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

gsap.registerPlugin(Draggable);

const Resume = () => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore();
  const ref = useRef(null);
  const headerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const isOpen = windows.resume?.isOpen;
  const zIndex = windows.resume?.zIndex ?? 1000;

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
      onPress: () => focusWindow('resume'),
      onDragStart: () => {
        document.body.style.cursor = 'grabbing';
        focusWindow('resume');
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
      closeWindow('resume');
      return;
    }

    setIsClosing(true);
    gsap.to(ref.current, {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.24,
      ease: 'power3.in',
      onComplete: () => closeWindow('resume'),
    });
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };

  const previousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || prev));

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '20%',
        top: '10%',
        width: '850px',
        height: '620px',
        zIndex,
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(18, 22, 33, 0.96)',
        boxShadow: '0 24px 65px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      onMouseDown={() => focusWindow('resume')}
    >
      <div
        ref={headerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#f3f4f6',
          borderBottom: '1px solid rgba(17,24,39,0.08)',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <WindowControls targetWindowKey="resume" />
        </div>

        <div style={{ color: '#111827', fontSize: '14px', fontWeight: 600, flex: 1, textAlign: 'center' }}>
          Resume.pdf
        </div>

        <div style={{ width: 88 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#e5e7eb', borderBottom: '1px solid rgba(17,24,39,0.08)' }}>
        <button type="button" onClick={previousPage} disabled={pageNumber <= 1} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer' }}>
          Prev
        </button>
        <span style={{ color: '#111827', fontSize: '12px', fontWeight: 600 }}>
          Page {pageNumber} {numPages ? `of ${numPages}` : ''}
        </span>
        <button type="button" onClick={nextPage} disabled={pageNumber >= (numPages || pageNumber)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: pageNumber >= (numPages || pageNumber) ? 'not-allowed' : 'pointer' }}>
          Next
        </button>
        <a href="/files/resume.pdf" download="resume.pdf" style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 8, background: '#0f6fff', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
          Download
        </a>
      </div>

      <div style={{ height: 'calc(100% - 120px)', overflow: 'auto', background: '#eef1f6', display: 'flex', justifyContent: 'center', padding: '16px 12px 20px' }}>
        <Document file="/files/resume.pdf" onLoadSuccess={onDocumentLoadSuccess} loading={<div style={{ color: '#111827', fontWeight: 600 }}>Loading PDF…</div>} error={<div style={{ color: '#b91c1c', fontWeight: 600 }}>Unable to load PDF.</div>}>
          <Page pageNumber={pageNumber} width={650} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
    </div>
  );
};

export default Resume;
