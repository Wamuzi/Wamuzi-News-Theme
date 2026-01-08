
import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const AdminFooter: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [copyrightText, setCopyrightText] = useState(settings.footer.copyrightText);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ footer: { copyrightText } });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Footer Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Control the content of your website's footer.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6">
          {/* Copyright Text */}
          <div className="max-w-2xl">
            <label htmlFor="copyright-text" className="block text-sm font-medium leading-6 text-gray-900">
              Copyright Text
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="copyright-text"
                id="copyright-text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use {'{year}'} to automatically display the current year.
              </p>
            </div>
          </div>

          {/* Footer Links Info */}
           <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Footer Links</h3>
             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-3xl">
              <p className="text-sm text-blue-800">
                The "About Us" and "Contact Us" links are now automatically handled by the theme.
                <br />
                To edit the content of these pages, please go to the <strong className="font-semibold">Pages</strong> section in your WordPress admin dashboard and edit the pages with the slugs <code className="bg-blue-100 px-1 py-0.5 rounded">about-us</code> and <code className="bg-blue-100 px-1 py-0.5 rounded">contact-us</code>.
              </p>
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

export default AdminFooter;
