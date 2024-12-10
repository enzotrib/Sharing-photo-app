import { FaExpand, FaCompress } from 'react-icons/fa';

const FullscreenButton = ({ isFullscreen, onClick }) => (
  <button
    onClick={onClick}
    className="fullscreen-button"
    aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
  >
    {isFullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
  </button>
);

export default FullscreenButton