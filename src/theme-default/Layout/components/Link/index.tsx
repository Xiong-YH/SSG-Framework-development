import React from 'react';
import styled from './index.module.scss';

interface LinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const EXTERNAL_URL_RE = /^https?/;

export function Link(props: LinkProps) {
  const { href = '/', children, className = '' } = props;

  const isExternal = EXTERNAL_URL_RE.test(href);

  const target = isExternal ? '_blank' : '';
  const rel = isExternal ? 'noopener noreferrer' : '';

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${styled.link} ${className}`}
    >
      {children}
    </a>
  );
}
