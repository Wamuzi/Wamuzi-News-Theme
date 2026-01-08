
import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { type SocialLink } from '../../../types';

const AdminHeader: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [showTopBar, setShowTopBar] = useState(settings.header.showTopBar);
  const [awardText, setAwardText] = useState(settings.header.awardText);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.header.socialLinks);
  const [isSaved, setIsSaved] = useState(false);

  const handleLinkChange = (id: number, field: 'name' | 'url', value: string) => {
    setSocialLinks(socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
  };
  
  const handleAddLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), name: 'Facebook', url: '' }]);
  };

  const handleRemoveLink = (id: number) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const handleSave = () => {
    updateSettings({ header: { ...settings.header, showTopBar, awardText, socialLinks } });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const socialOptions: SocialLink['name'][] = ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'LinkedIn'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Header Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Customize the top bar, award text, and social media links.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6 space-y-8">
          {/* Top Bar Settings */}
          <fieldset>
            <legend className="text-base font-semibold leading-6 text-gray-900">Top Bar</legend>
            <div className="mt-4 space-y-6">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input id="show-top-bar" name="show-top-bar" type="checkbox" checked={showTopBar} onChange={(e) => setShowTopBar(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="show-top-bar" className="font-medium text-gray-900">Show Top Bar</label>
                  <p className="text-gray-500">Display the bar with date, award, and social icons.</p>
                </div>
              </div>
              <div className="max-w-2xl">
                <label htmlFor="award-text" className="block text-sm font-medium leading-6 text-gray-900">Award Text</label>
                <div className="mt-2">
                  <input type="text" name="award-text" id="award-text" value={awardText} onChange={(e) => setAwardText(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6" />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Social Links Manager */}
          <fieldset>
             <legend className="text-base font-semibold leading-6 text-gray-900">Social Media Links</legend>
             <div className="mt-4 space-y-4 max-w-3xl">
              {socialLinks.map((link) => (
                <div key={link.id} className="grid grid-cols-1 sm:grid-cols-8 gap-4 items-center">
                  <div className="sm:col-span-3">
                    <label htmlFor={`social-name-${link.id}`} className="sr-only">Social Network</label>
                     <select id={`social-name-${link.id}`} value={link.name} onChange={(e) => handleLinkChange(link.id, 'name', e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm">
                        {socialOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor={`social-url-${link.id}`} className="sr-only">URL</label>
                     <input type="text" id={`social-url-${link.id}`} value={link.url} onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm"
                      placeholder="Full URL (e.g., https://facebook.com/user)"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button onClick={() => handleRemoveLink(link.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleAddLink} className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200">
              + Add Social Link
            </button>
          </fieldset>
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

export default AdminHeader;
