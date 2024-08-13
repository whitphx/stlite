import React from "react";
import { RiExternalLinkLine } from "react-icons/ri";

function ExternalLink({
  href,
  children,
  ...restProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} {...restProps} target="_blank" rel="noreferrer noopener">
      {children}
      <RiExternalLinkLine />
    </a>
  );
}

export default ExternalLink;
