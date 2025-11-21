import React from "react";

// --- ICONO YOUTUBE ---
export function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="main-grid-item-icon"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M22.747 4.834c.372.375.64.84.775 1.351.502 1.885.502 5.815.502 5.815s0 3.93-.502 5.815A3.017 3.017 0 0 1 21.4 19.95c-1.876.505-9.376.505-9.376.505s-7.5 0-9.376-.505a3.016 3.016 0 0 1-2.122-2.135C.024 15.93.024 12 .024 12s0-3.93.502-5.815A3.016 3.016 0 0 1 2.648 4.05c1.876-.505 9.376-.505 9.376-.505s7.5 0 9.376.505c.51.139.974.41 1.347.784ZM15.842 12 9.57 8.431v7.138L15.842 12Z"
        fill="#FF0302"
        fillRule="evenodd"
      />
    </svg>
  );
}

// --- ICONO LINKEDIN ---
export function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="main-grid-item-icon"
      fill="none"
      {...props}
    >
      <path
        d="M5.372 24H.396V7.976h4.976V24ZM2.882 5.79C1.29 5.79 0 4.474 0 2.883a2.882 2.882 0 1 1 5.763 0c0 1.59-1.29 2.909-2.881 2.909ZM23.995 24H19.03v-7.8c0-1.86-.038-4.243-2.587-4.243-2.587 0-2.984 2.02-2.984 4.109V24H8.49V7.976h4.772v2.186h.07c.664-1.259 2.287-2.587 4.708-2.587 5.035 0 5.961 3.316 5.961 7.623V24h-.005Z"
        fill="#0A66C2"
      />
    </svg>
  );
}

// --- ICONO INSTAGRAM ---
export function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="main-grid-item-icon"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
        fill="url(#instagram__a)"
        fillRule="evenodd"
      />
      <path
        d="M18.406 7.034a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88Z"
        fill="url(#instagram__b)"
      />
      <path
        clipRule="evenodd"
        d="M12 0C8.741 0 8.332.014 7.052.072 5.775.131 4.902.333 4.14.63a5.882 5.882 0 0 0-2.125 1.384A5.882 5.882 0 0 0 .63 4.14c-.297.763-.5 1.635-.558 2.912C.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.277.261 2.15.558 2.912.307.79.717 1.459 1.384 2.126A5.882 5.882 0 0 0 4.14 23.37c.764.297 1.636.5 2.913.558C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.059 2.15-.261 2.912-.558a5.884 5.884 0 0 0 2.126-1.384 5.884 5.884 0 0 0 1.384-2.126c.297-.763.5-1.635.558-2.912.058-1.28.072-1.69.072-4.948 0-3.259-.014-3.668-.072-4.948-.059-1.277-.261-2.15-.558-2.912a5.882 5.882 0 0 0-1.384-2.126A5.883 5.883 0 0 0 19.86.63c-.763-.297-1.635-.5-2.912-.558C15.668.014 15.258 0 12 0Zm0 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.228.413.56.218.96.478 1.38.898.42.42.68.82.898 1.38.164.423.36 1.058.413 2.228.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.054 1.17-.249 1.805-.413 2.228a3.72 3.72 0 0 1-.898 1.38c-.42.42-.82.68-1.38.898-.423.164-1.058.36-2.228.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.169-.054-1.804-.249-2.227-.413a3.719 3.719 0 0 1-1.38-.898c-.42-.42-.68-.82-.898-1.38-.164-.423-.36-1.058-.413-2.228-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.053-1.169.249-1.804.413-2.227.218-.56.478-.96.898-1.38.42-.42.82-.68 1.38-.898.423-.164 1.058-.36 2.228-.413C8.416 2.174 8.796 2.162 12 2.162Z"
        fill="url(#instagram__c)"
        fillRule="evenodd"
      />
      <defs>
        <linearGradient id="instagram__a" x1="14.101" x2="7.087" y1="-1.272" y2="21.899" gradientUnits="userSpaceOnUse">
          <stop stopColor="#515BD4" />
          <stop offset=".26" stopColor="#9510B8" />
          <stop offset=".66" stopColor="#E51804" />
          <stop offset="1" stopColor="#FFBF00" />
        </linearGradient>
        <linearGradient id="instagram__b" x1="14.101" x2="7.087" y1="-1.272" y2="21.899" gradientUnits="userSpaceOnUse">
          <stop stopColor="#515BD4" />
          <stop offset=".26" stopColor="#9510B8" />
          <stop offset=".66" stopColor="#E51804" />
          <stop offset="1" stopColor="#FFBF00" />
        </linearGradient>
        <linearGradient id="instagram__c" x1="14.101" x2="7.087" y1="-1.272" y2="21.899" gradientUnits="userSpaceOnUse">
          <stop stopColor="#515BD4" />
          <stop offset=".26" stopColor="#9510B8" />
          <stop offset=".66" stopColor="#E51804" />
          <stop offset="1" stopColor="#FFBF00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- ICONO FACEBOOK ---
export function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="main-grid-item-icon"
      fill="none"
      {...props}
    >
      <path
        d="m17.543 13.398.661-4.31h-4.136V6.29c0-1.18.578-2.329 2.43-2.329h1.88V.291S16.673 0 15.042 0c-3.407 0-5.633 2.064-5.633 5.802v3.285H5.622v4.311h3.786v10.42a15.015 15.015 0 0 0 4.66 0v-10.42h3.475Z"
        fill="#1877F2"
      />
    </svg>
  );
}

// --- ICONO TELEGRAM ---
export function Telegram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="main-grid-item-icon"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M1.65 11.562c6.442-2.807 10.738-4.657 12.888-5.551C20.675 3.458 21.95 3.015 22.782 3c.182-.004.591.041.856.256.223.182.285.427.314.599.03.172.066.563.037.87-.332 3.494-1.771 11.974-2.503 15.888-.31 1.656-.92 2.211-1.51 2.266-1.284.118-2.259-.848-3.502-1.663-1.945-1.275-3.043-2.069-4.931-3.313-2.182-1.438-.768-2.228.476-3.52.325-.338 5.98-5.481 6.089-5.948.014-.058.026-.275-.103-.39-.13-.115-.32-.076-.457-.045-.196.045-3.303 2.099-9.322 6.162-.882.605-1.681.9-2.397.885-.789-.017-2.307-.446-3.435-.813-1.384-.45-2.484-.688-2.388-1.452.05-.398.598-.805 1.644-1.22Z"
        fill="url(#telegram__a)"
        fillRule="evenodd"
      />
      <defs>
        <linearGradient id="telegram__a" x1="12" x2="12" y1="3" y2="22.742" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2AABEE" />
          <stop offset="1" stopColor="#229ED9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
