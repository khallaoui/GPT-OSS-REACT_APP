import * as React from 'react';

export const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="m5 5 2.5 2.5" />
    <path d="m16.5 16.5 2.5 2.5" />
  </svg>
);
