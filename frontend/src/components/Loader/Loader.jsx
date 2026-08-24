import './Loader.css';

function Loader({ size = 'md', fullScreen = false }) {
  const containerClasses = [
    'loader-container',
    fullScreen ? 'loader-fullscreen' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerClasses = [
    'loader-spinner',
    `loader-spinner-${size}`,
  ].join(' ');

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className={spinnerClasses} />
    </div>
  );
}

export default Loader;
