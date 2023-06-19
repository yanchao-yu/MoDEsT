import * as React from 'react';

export default function Modal({ title, description, close, children }) {
  return (
    <div className="backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <p className="hint-color">{description}</p>
        <div className="modal-body">{children}</div>
        <button onClick={close} className="close-btn button">
          X
        </button>
      </div>
    </div>
  );
}
