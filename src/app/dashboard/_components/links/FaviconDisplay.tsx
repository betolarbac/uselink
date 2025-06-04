"use client";

import { useState } from "react";
import Image from "next/image";
import { Link2 } from "lucide-react";

interface FaviconDisplayProps {
  linkUrl: string;
  altText?: string;
  size?: number;
  className?: string;
}

export function FaviconDisplay({
  linkUrl,
  altText = "Favicon",
  size = 32,
  className = "h-4 w-4",
}: FaviconDisplayProps) {
  const [hasError, setHasError] = useState(false);

  let domain = "";
  try {
    domain = new URL(linkUrl).hostname;
  } catch (error) {
    console.error("Erro ao extrair o domínio:", error);
    if (!hasError) setHasError(true);
  }

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    : "";

  if (hasError || !domain) {
    return (
      <Link2
        className={`${className}`}
        aria-label={altText}
      />
    );
  }

  return (
    <Image
      src={faviconUrl}
      alt={altText}
      className={className}
      width={size}
      height={size}
      onError={() => {
        setHasError(true);
      }}
      unoptimized
    />
  );
}
