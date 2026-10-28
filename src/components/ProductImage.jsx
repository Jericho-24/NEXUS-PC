import { useState } from "react";
import { Cpu } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80";

export default function ProductImage({ src, alt, className = "" }) {
  const [image, setImage] = useState(src || FALLBACK_IMAGE);
  return (
    image
      ? <img
          src={image}
          alt={alt}
          className={className}
          loading="lazy"
          onError={() => setImage((current) => current === FALLBACK_IMAGE ? "" : FALLBACK_IMAGE)}
        />
      : <div className={`image-placeholder ${className}`}><Cpu size={34} /></div>
  );
}
