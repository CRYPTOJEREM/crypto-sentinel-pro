import useInView from '../hooks/useInView';

export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const [ref, isVisible] = useInView();

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
