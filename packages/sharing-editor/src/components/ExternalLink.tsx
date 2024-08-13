import React from "react";
import { RiExternalLinkLine } from "react-icons/ri";

interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}
function ExternalLink({ href, children, ...restProps }: ExternalLinkProps) {
  return (
    <a href={href} {...restProps} target="_blank" rel="noreferrer noopener">
      {children}
      <RiExternalLinkLine />
    </a>
  );
}

export default ExternalLink;
