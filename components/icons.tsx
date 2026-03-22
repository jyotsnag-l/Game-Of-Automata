import React from 'react';

// New, stylized icons with a bolder look.

export const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

export const ResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.75 4.75A.75.75 0 0 1 1.5 4h10.5a.75.75 0 0 1 0 1.5H2.69l3.53 3.53a.75.75 0 0 1-1.06 1.06L.75 5.81V10.5a.75.75 0 0 1-1.5 0V4.75Z" />
    <path d="M23.25 19.25a.75.75 0 0 1-.75.75H11.25a.75.75 0 0 1 0-1.5h9.81l-3.53-3.53a.75.75 0 1 1 1.06-1.06l4.42 4.42V13.5a.75.75 0 0 1 1.5 0v5.75Z" />
    <path d="M11.83 2.25A11.25 11.25 0 0 0 5.014 20.32l.001.002a.75.75 0 0 0 1.06-1.061 9.75 9.75 0 0 1 6.81-15.451c4.44.53 8.102 4.193 8.632 8.632a.75.75 0 0 0 1.49-.156 11.25 11.25 0 0 0-11.177-9.986Z" />
    <path d="M12.17 21.75A11.25 11.25 0 0 0 18.986 3.68l-.001-.002a.75.75 0 0 0-1.06 1.061 9.75 9.75 0 0 1-6.81 15.451c-4.44-.53-8.102-4.193-8.632-8.632a.75.75 0 0 0-1.49.156 11.25 11.25 0 0 0 11.177 9.986Z" />
  </svg>
);


export const HintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.84-.447-1.713-.224-2.33.518a.75.75 0 0 1-1.25-.832A3.001 3.001 0 0 1 12 6.75c1.657 0 3 1.343 3 3a.75.75 0 0 1-1.5 0c0-.552-.448-1-1-1-.497 0-.923.364-1.047.844l-.273.955a.75.75 0 1 0 1.45.414l.142-.497a1.5 1.5 0 0 1 1.705.213c.27.19.44.5.44.848s-.17.659-.44.848a1.5 1.5 0 0 1-1.705.213l-.142-.497a.75.75 0 1 0-1.45.414l.273.955c.124.436.55.75 1.047.75.552 0 1-.448 1-1a.75.75 0 0 1 1.5 0c0 1.657-1.343 3-3 3s-3-1.343-3-3a.75.75 0 0 1 1.5 0c0 .348.17.658.44.848.478.33.99.418 1.446.233l.142-.057a.75.75 0 0 1 .593 1.44c-.45.185-.961.272-1.482.272a4.5 4.5 0 0 1-4.5-4.5c0-2.485 2.015-4.5 4.5-4.5c.521 0 1.033.087 1.482.272a.75.75 0 0 1-.593 1.44l-.142-.057Z" clipRule="evenodd" />
  </svg>
);


export const NewGameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M10.788 3.212a.75.75 0 0 0-1.06 1.06L12.939 7.5H5.25a.75.75 0 0 0 0 1.5h7.689l-3.21 3.212a.75.75 0 1 0 1.06 1.06l4.5-4.5a.75.75 0 0 0 0-1.06l-4.5-4.5Z" />
        <path d="M18.75 12a.75.75 0 0 0-1.5 0v2.625H5.25a.75.75 0 0 0 0 1.5h12v2.625a.75.75 0 0 0 1.5 0V12Z" />
    </svg>
);


export const LoadingSpinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-amber)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent-amber)" />
        </linearGradient>
      </defs>
      <path
        d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
        stroke="url(#spinner-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        style={{ animation: 'blueprint-spinner 1s linear infinite' }}
      />
    </svg>
);


export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.041.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.67-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.25 3.25-1.5-1.5a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.75-3.75Z" clipRule="evenodd" />
    </svg>
);