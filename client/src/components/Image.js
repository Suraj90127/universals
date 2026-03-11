import React from 'react';

const Image = ({ src, alt, className, loading = 'lazy', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/100x100/3B4A5C/FFFFFF?text=Img+Error';
      }}
      {...props}
    />
  );
};

export default Image;