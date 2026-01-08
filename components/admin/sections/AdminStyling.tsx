
import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const AdminStyling: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [primaryColor, setPrimaryColor] = useState(settings.styling.primaryColor);
  const [breakingColor, setBreakingColor] = useState(settings.styling.breakingColor);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ 
        styling: {
            primaryColor,
            breakingColor
        } 
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const ColorInput: React.FC<{label: string, value: string, onChange: (val: string) => void, helpText: string}> = ({ label, value, onChange, helpText }) => (
    <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
        <div className="mt-2 flex items-center gap-x-3">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 p-1 block bg-white border border-gray-300 rounded-md cursor-pointer" />
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6" />
        </div>
        <p className="mt-2 text-xs text-gray-500">{helpText}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Styling Options</h1>
        <p className="mt-1 text-sm text-gray-500">Customize the colors of your theme.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6">
           <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
             <div className="col-span-full space-y-6">
                <ColorInput 
                    label="Primary Brand Color"
                    value={primaryColor}
                    onChange={setPrimaryColor}
                    helpText="Used for links, buttons, and primary UI elements."
                />
                 <ColorInput 
                    label="Breaking News Color"
                    value={breakingColor}
                    onChange={setBreakingColor}
                    helpText="Used for the breaking news bar and other urgent highlights."
                />
             </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-6 py-4">
          <button type="button" onClick={handleSave} className="rounded-md bg-brand-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStyling;
