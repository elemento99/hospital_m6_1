import { createElement, FC } from 'react';

interface DetailModalProps {
  show: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const DetailModal: FC<DetailModalProps> = ({ show, title, content, onClose }) => {
  if (!show) return null;

  return createElement('div', { 
    className: 'modal show',
    style: { display: show ? 'block' : 'none' }
  },
    createElement('div', { className: 'modal-dialog' },
      createElement('div', { className: 'modal-content' },
        createElement('div', { className: 'modal-header' },
          createElement('h5', { className: 'modal-title' }, title),
          createElement('button', { 
            type: 'button',
            className: 'btn-close',
            onClick: onClose
          })
        ),
        createElement('div', { className: 'modal-body' },
          createElement('p', null, content)
        ),
        createElement('div', { className: 'modal-footer' },
          createElement('button', {
            type: 'button',
            className: 'btn btn-secondary',
            onClick: onClose
          }, 'Close')
        )
      )
    )
  );
};

export default DetailModal; 