
import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const AdminHomepage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [sliderCount, setSliderCount] = useState(settings.homepage.sliderArticlesCount);
  const [trendingCount, setTrendingCount] = useState(settings.homepage.trendingArticlesCount);
  const [latestCount, setLatestCount] = useState(settings.homepage.latestArticlesCount);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ 
        homepage: { 
            sliderArticlesCount: sliderCount, 
            trendingArticlesCount: trendingCount,
            latestArticlesCount: latestCount
        } 
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const NumberInput: React.FC<{label: string, value: number, onChange: (val: number) => void, helpText: string}> = ({ label, value, onChange, helpText }) => (
    <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
        <div className="mt-2">
            <input type="number" min="1" max="10" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="block w-24 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6" />
        </div>
        <p className="mt-2 text-xs text-gray-500">{helpText}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Control the layout and content of your homepage.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="p-6">
           <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
             <div className="sm:col-span-full space-y-6">
                <NumberInput 
                    label="Main Slider Articles"
                    value={sliderCount}
                    onChange={setSliderCount}
                    helpText="Number of articles to show in the main homepage slider (1-10)."
                />
                 <NumberInput 
                    label="Left Sidebar 'Latest' Articles"
                    value={latestCount}
                    onChange={setLatestCount}
                    helpText="Number of articles in the 'Latest' block on the left sidebar (1-10)."
                />
                 <NumberInput 
                    label="Right Sidebar 'Trending' Articles"
                    value={trendingCount}
                    onChange={setTrendingCount}
                    helpText="Number of articles in the 'Trending' block on the right sidebar (1-10)."
                />
             </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-6 py-4">
          <button type="button" onClick={handleSave} className="rounded-md bg-brand-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;
