import React from 'react';
import useWindowStore from '#store/window';

const WindowControls = ({ targetWindowKey }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useWindowStore();

  const handleClose = () => closeWindow(targetWindowKey);
  const handleMinimize = () => minimizeWindow(targetWindowKey);
  const handleMaximize = () => maximizeWindow(targetWindowKey);

  return (
    <div id="window-controls" aria-label="Window controls">
      <button
        type="button"
        className="close"
        onClick={handleClose}
        aria-label="Close window"
      />
      <button
        type="button"
        className="minimize"
        onClick={handleMinimize}
        aria-label="Minimize window"
      />
      <button
        type="button"
        className="maximize"
        onClick={handleMaximize}
        aria-label="Maximize window"
      />
    </div>
  );
};

export default WindowControls;
