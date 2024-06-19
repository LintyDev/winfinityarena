import { useEffect } from 'react';

function Modal({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal">
        <div className="modal-view">{children}</div>
      </div>
    </>
  );
}

export default Modal;
