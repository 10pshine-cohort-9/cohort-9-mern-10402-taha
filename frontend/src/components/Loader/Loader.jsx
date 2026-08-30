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
    <output className={containerClasses} aria-label="Loading">
      <div className={spinnerClasses} />
    </output>
  );
}

export default Loader;
