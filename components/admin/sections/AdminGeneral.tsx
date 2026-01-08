
import React, { useState, useRef } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const AdminGeneral: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [siteTitle, setSiteTitle] = useState(settings.general.siteTitle);
  const [tagline, setTagline] = useState(settings.general.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.general.logoUrl);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSettings({ general: { siteTitle, tagline, logoUrl } });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const handleReset = () => {
      if (window.confirm('Are you sure you want to reset all theme settings to their default values? This action cannot be undone.')) {
        resetSettings();
        // reload to see changes from defaults
        window.location.reload();
      }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">General Theme Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage site identity, logo, and global settings.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6">
           <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Site Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <img src={logoUrl} alt="Current Logo" className="h-12 w-auto bg-gray-100 p-1 rounded-md" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Change
                </button>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="site-title" className="block text-sm font-medium leading-6 text-gray-900">
                Site Title
              </label>
              <div className="mt-2">
                <input type="text" name="site-title" id="site-title" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6"
                />
              </div>
            </div>
             <div className="sm:col-span-4">
              <label htmlFor="tagline" className="block text-sm font-medium leading-6 text-gray-900">
                Tagline
              </label>
              <div className="mt-2">
                <input type="text" name="tagline" id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6"
                />
                 <p className="mt-2 text-xs text-gray-500">A short description of your site, shown in the browser tab.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-6 py-4">
          <button type="button" onClick={handleSave} className="rounded-md bg-brand-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
      
       <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Reset All Settings</h3>
            <p className="mt-2 text-sm text-gray-500">
                This will reset all theme options to their original default values. This action cannot be undone.
            </p>
        </div>
        <div className="flex items-center justify-end border-t border-gray-900/10 px-6 py-4">
            <button onClick={handleReset} type="button" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                Reset to Defaults
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGeneral;
