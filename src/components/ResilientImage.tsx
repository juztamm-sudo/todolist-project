import { useState } from 'react';
import { Image as ImageIcon, User } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'avatar' | 'illustration';
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackType = 'illustration',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (fallbackType === 'avatar') {
      return (
        <span
          className={`inline-flex items-center justify-center bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold ${className}`}
          aria-label={alt}
        >
          {fallbackLabel ? (
            <span className="text-xs tracking-tight">{fallbackLabel}</span>
          ) : (
            <User className="w-4 h-4" aria-hidden="true" />
          )}
        </span>
      );
    }

    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-light-secondary-container to-light-surface-container-low dark:from-dark-secondary-container/50 dark:to-dark-surface-container text-light-primary dark:text-dark-primary border border-light-outline-variant dark:border-dark-outline-variant ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="w-6 h-6 opacity-70" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
