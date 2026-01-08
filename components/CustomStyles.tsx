
import React, { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';

const CustomStyles: React.FC = () => {
  const { settings } = useSettings();
  const { primaryColor, breakingColor } = settings.styling;

  const styles = useMemo(() => {
    return `
      :root {
        --color-brand-blue: ${primaryColor};
        --color-brand-red: ${breakingColor};
      }
      .bg-brand-blue { background-color: var(--color-brand-blue); }
      .text-brand-blue { color: var(--color-brand-blue); }
      .border-brand-blue { border-color: var(--color-brand-blue); }
      .ring-brand-blue:focus { --tw-ring-color: var(--color-brand-blue); }
      .focus\\:ring-brand-blue:focus { --tw-ring-color: var(--color-brand-blue); }
      .focus\\:border-brand-blue:focus { border-color: var(--color-brand-blue); }
      .hover\\:text-brand-blue:hover { color: var(--color-brand-blue); }
      .hover\\:bg-blue-700:hover { background-color: ${primaryColor}; filter: brightness(0.9); }
      .bg-brand-red { background-color: var(--color-brand-red); }
      .text-brand-red { color: var(--color-brand-red); }
      .border-brand-red { border-color: var(--color-brand-red); }
    `;
  }, [primaryColor, breakingColor]);

  return <style>{styles}</style>;
};

export default CustomStyles;
