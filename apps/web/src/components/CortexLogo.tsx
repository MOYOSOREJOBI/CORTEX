/**
 * CortexLogo — SVG brain/circuit logo component.
 * Used in the navbar and landing page.
 */

interface CortexLogoProps {
  size?: number;
  className?: string;
}

export default function CortexLogo({ size = 40, className }: CortexLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <circle cx="50" cy="50" r="6" fill="#0066ff" />
      <circle cx="50" cy="20" r="4" fill="white" opacity="0.9" />
      <circle cx="76" cy="35" r="4" fill="white" opacity="0.9" />
      <circle cx="76" cy="65" r="4" fill="white" opacity="0.9" />
      <circle cx="50" cy="80" r="4" fill="white" opacity="0.9" />
      <circle cx="24" cy="65" r="4" fill="white" opacity="0.9" />
      <circle cx="24" cy="35" r="4" fill="white" opacity="0.9" />
      <line x1="50" y1="20" x2="50" y2="44" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="76" y1="35" x2="55" y2="47" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="76" y1="65" x2="55" y2="53" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="50" y1="80" x2="50" y2="56" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="24" y1="65" x2="45" y2="53" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="24" y1="35" x2="45" y2="47" stroke="white" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
