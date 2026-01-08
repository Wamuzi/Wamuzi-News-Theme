
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { type ThemeSettings } from '../types';

interface SettingsContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// The default logo is now defined here so it can be reset.
const WAMUZI_LOGO_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACNCAYAAAD2bBPrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAsYSURBVHhe7d3/SxtHF8fx2TNv80ne973v3ffem1/4f+jN3pvd3tvd293e3Sxv3vbGzTfDImRBkAUZGdkkWVAkWZA9WbK/LCvZsmTLkiw78j9WkGVJlixb9n3s+z1rVlRWYVZWvP+sH89wVlZWVmRWdXW1Jz09Pfrll19UV1dXfX199dVXX1VXV1d9fX31lVdeUVdXV7W1tVnj2q2trfrTn/6ktra26ubmRkdHR/X29mZNq1u3bmVfWVmp6+vrVFdXV2trq2ZnZ2v27NmyLy4u1tXVVX19fVVbW5s1rn300Uf10EMPae7cuZo9e7YmJibq+eef18MPP6zp06frqaee0uzZs7WmpiZrWt26dSv70qVLtbe3V2dnZ83S0pI1LSkpSWtrq2ZnZ8va3LlzVVRU9H7s2rVrRUdHByUlJXrllVf04YcfVlBQkIaGhurRRx/Vgw8+qOHh4Zo/f/4Hn1+/fl37+vqqsrJSd3f3rGlxcXGqqqqSlpaW6ujoqM7OzlpdXa0vLi7mXb9+/R/4zKuvvqrU1FStX79e3bt3b02pU6dOVVJSohUrVuiFF17QlClTNHPmzDe+T548qaVLl2pxcbGqqqrq6enJPpCQkKCuri5dXFzM3b58+ZL6+vrU1dXF+fnz50tKSpIuLi5SUFCQfXz06NGiVatW6e2336avr69+//vfSUlJSfbaa6/ovvvu061btw74PnToUF2+fFlLly5tTTt37ty7devW6j/08/NTd+7c0fXr19sDbGpqotXV1bovvvgi++rq6tLc3Jx16+rq0tTUlK6qqgpISUnJPqChoUFbtmzpfePGjRv66quvtLq6+oPvlStX9P777+vChQtVVVXF/oD5+fn65JNPfOD77t27mjJlio4cOZI9V3/729+0e/fuH3zPmzfPI0eO1NSpU7Vz507t379f586d06FDh9pTTz2lxMTE9+3q6qqTJ09q6tSp2rVrV/baa69o9+7dWrZsmbZu3dr6tLS06NSpU7p8+XJb+/v7a/PmzermzZv65JNPtHXr1p/V/fz81GOPPaabb75ZN27c0A0bNujXX3/V2LFjteeee2r37t0f+O7fv39Pnz5dS5cu1dq1a7Vx40bt3r07+8eOHSsAjB49WhMmTNDMmTN1/vx5HTp0SMuWLdOaNWtqfX19266urnTr1q2aOnVq69u8efMaP368tm/f/o3v2bNnNW7cOE2cONEzZ85o48aN2rhxY/YzZ85o6tSperVrV3r++ed17NgxTZ06Vdu3b+c+L1myRMeOHdPGjRs1YcKE1ve5c+e0d+9ebdu2TTt27Ni6/+mnn/TTTz/p9OnT6t279zeb6w8//KArr7xSt2/f1muvvabLly9nDzBjxoxv7a+//qoPPvigs2fP6rXXXtNXX32lJUuWaObMmbrtttu0detWzZw5s/V9+PDhmjt3ru68804NHDhQ/fr1o7feekvDhw/XpUuX6q233tL777+vK1euZP8LL7ygt956S/feey93e+edd/Thhx/q9ddf1yuvvKKffvpJ69at06FDh7R37169++67+uCDD3Tv3r2s79mzZzV69Gi99tpr+uabbzRnzpws4J133tGJEyf00ksvaebMmfr444+1evVqbd26Va+88gq3u3fvXg0fPpwdwPvvv68PP/xQEydO1JIlSzR37lz98MMP+uqrr3Tjxo1/bV1QUKB58+ZpxowZ2rhxY+v7yZMnNXbsWJ04cUJnz55VT09P9vfBBx/o9ddf1/Xr1/XDDz9ov/32k5MnT2rMmDH6+OOPNXXqVG3atEm3bt3Ku2XLlmlZWZk6d+5cd911Fz/88IMWL16sl156STNmzNCsWbN0+/Ztbdy4UW+99Za2b9+uGTNmaN68eXr++ee1cePG7L9169bW9/DhwzV+/Hjdfffd+uqrr7Ro0SLNmjVLb775pn799VcNGTJEW7Zsqf1rR0dHnThxQkeOHNGBAwf05ptvaefOnfr888+1atUqffLJJzp9+rRmz56tJUuW6LffftPevXt18OBBzZ49Wzdu3NDp06d15coVffTRR/rggw906tQpnTt3TmvXrlXfvn3zzc0TJ06UJUuW6Pr161q/fr0GDBigd955R0888YQ++OADffDBBzpz5ozefvttzZ8/X3NmzNGvv/6qP/74Q1u3btW8efP02muv6datW7r++uu1d+9eTZw4sXV+6NChmjZtmubNmxds6dKluvHGG7V79+5X7O/cuVNz5szRhQsXNH78eN199926dOlSbdq0SX/88YcWLFigiRMn6vjx41q3bl1r+9ixYzV+/Hg9+eST2r59+/e2fvv2bf3zn/+sp59+Wl988YWePHmif/75R4MHD9ZLL70kAIwbN06nTp3STz/9pF27dqlfv36ZOXPmlObn52vx4sXavXu3du7c+dZrNm3apDFjxujixYuZP/3002/9njp1qlasWKGnnnpKd999t65evapffvlFr732mn777TddvHhRt2/f1hEjRuh///tfzZgxo/Xr1+urr77Sjh07tG3bNl26dEmvvfaavv76ax0/flwnTpxQ69atm4DbS0tLZWVlpWbPns3+66+/voYNG6bFixdr27Zt2r59+3vb7t69W7/99pu2bNmiv/76S4sXL9aqVat0//33a926dfrpp580bNgwDRs2zB6gT58++t5773Xp0iWtWLFCb775prZu3aphw4Zp+fLlmjZtmubNm6eNGzfq4cOHtXTpUv3zn/+skSNH6tSpU9p1112nF198UQMGDFDDhg3znnnkyBF9/PHH2r9/v4YNG5Z98+fPV9euXW+N9uXLl/Xaa69p7ty5mjp1qmbNmhWc3JycHH366aeaNGkS+3vqqac0atQoTZ482R6gRYsWafr06Xrrrbf0ySef6Ouvv9bChQtrr/3xxx8NHjzYHqCNGzfqrbfekpMnT2rw4MHyPfnkkwIACxYs0NSpU/WWWWYJL7/8sv7xj3+UlpaW9t///vc3vrGxsZKSkqK///vfzZw5c6v7/Pz8rKys/P73v3/p0qX/f/33v/89KytL9+zZ85VXXnnFk08+efPNN7+6urqaO3fu+++/Py8vr9/+9rfPnTv317/+dW5urlatWrW1tXVxcdHTTz/9xRdfbGxs/PKXv1xYWHjhwoUbNmyoq6vrmWeeyczMrKioqLKy8qOPPnrgwIFHjx79xS9+cfbs2cHBwfXr17/lllsWLlx47ty5P/vZz/7whz/84Q9/+M6dO9966y09PT1LS0srKysfOnDowIEDr169evTo0bm5uZmZmVVVVc8++2zZsmU///zzxsbGP/7xj4WFhb/85S9feumljo6OHz58mJaWVlxc/PTp0+fn53/66afPnDnz9u3bv/nNb37wgx+87bbb/vrXvxYXF19//fWpqal5eXlbt269dOnSZ5999nvf+15CQoKfn59Hjx4tLCysqan56quvZmVlZWVl3bhxY2pq6owZM+bPn3/mzJm5ubn9+/cfOHDgl19+mZubGxsbGxcXV1hYmJOTExcX98knnywvL7+goPDNN99kZWWtqqr+8pe/XFhY+Oabb6qqqr744ou8vLz+/fvLysry9/f/+uuvh4aGPvroo4yMjJMnT77mmmvOnDnzzDPPJCQk3L17d05OzuXLlwMDAwsKCgYGBs6dO5eXl3f58uX29vb+/v7e3t75+fnW1ta5ubmsrKycnJy5ublxcXHnz5/v6enp7e0tKSlJTExMT09PSUlJTU1NS0tLTk6Oj4+PS0tLS0tLSkpKcnJyc3NzycnJ+fn5CQkJ8fHxAQEBGRkZcXFxAQEBcXFxxcXFOTk5ISEhcXFxSUlJ+fn5cXFxycnJcXFxKSkpycnISEhIMDAyIiIgMDAzIyMjIz88vLS0tLCwsLCxMTk7OyspqampKS0vLy8urqqqqqqrKysrq6+ubm5srKioqKipKSkqqq6tra2sLCwuzsrJKSkoyMjLy8vIMDAz4+fkJCQnJyUnJyclxcXFKSkpycnJzc3NcXBwAxcXFzc3N+fn5OTk5xcXFeXl5hYWFWVlZXV1deXl5ZWVlVVRUZGRksLCw4OPjIyMjk5OTk5OTk5OTExISAgICAgICEhISDAwMyMvL4+PjQ0JCQkJCsrKySkpKKisrKysrq6urCwkJcnJySktLKysrq6urGxoaEhMTExMTk5OTkpKSExMTExMTUlJSkpKSkpKSAgIC8vPzDAwMMjIycnJycnJyc3NzaWlpVVWVm5ubm5ubm5sbAMhkZWVJSUnJysqqrq7Ozc0NCQmpqqpqa2u7cePGm2+++R//+Md33313SUnJJ598cu7cucLCwszMzLy8vGeeeebNN99MS0vbv39/fn5+bm7u+PHjJyYmZmRkbty48eyzzx48ePDw4cOzsrJKS0uzsrLefffdubm5X3/99XPPPbfqf/XVV7/++mv/Q1ZWlu+//35OTo7/5c+YMaOwsPCbb74pLy9PTk7++c9/bmho+Pvf//7zzz//9NNPb21tnZuba25u/vDDDwsLCyMjI//5z39u3bp1TU3Nhx9+OCcn54033qivr29sbHzyySdnZmbm5ub+/PPPnZ2dv/rqq2+//XZpaemvf/3rxYsXT58+vbCwsLCw8NFHH11cXJyenp6amprS0tKamhqAkpKSkZGRlpaWmZlZWFiYlpaWmZmZlpaWnp5eXV1dXl5eXl5eVVVVWFlZVVRUZGZm5OXlFRYW4uPjS0pKAABSUlKysrIMDAzy8vIMDAzIz8+Pj4+Pi4trbm4uLS2Njo4GBACQkpLi4+MTExPj4uKSk5Ozs7NTUlICAoK4uLi4uLi4uLiwsLCwsLC0tLSwsDA/Pz8rK4uLiyspKcnJyUlJSUlJSbm5uUFBQW5ubklJSVlZWXV1deXl5WVlZWVlZWVlZdXV1UVFRWVlZRkZGfn5+QUFBRESEgQEBBAQEJCQkIiIiJiYmISEhIyMjISEhERERMTERAQEBBAQEBAQEBAQEBAQEJCQkIiIiJiYmISEhIyMjLKysoKCgoyMjISEhEREREJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkREREJCQkJCQkR...';

const DEFAULT_SETTINGS: ThemeSettings = {
  general: {
    siteTitle: 'Wamuzi News KE',
    tagline: 'Your Trusted Source for News',
    logoUrl: WAMUZI_LOGO_DATA_URL,
  },
  header: {
    showTopBar: true,
    awardText: 'Digitally Fit Awards Gold Winner 2023',
    socialLinks: [
        { id: 1, name: 'Facebook', url: '#' },
        { id: 2, name: 'Twitter', url: '#' },
        { id: 3, name: 'Instagram', url: '#' },
        { id: 4, name: 'YouTube', url: '#' },
    ],
  },
  footer: {
    copyrightText: '© {year} Wamuzi News KE. All Rights Reserved.',
  },
  homepage: {
    sliderArticlesCount: 4,
    trendingArticlesCount: 5,
    latestArticlesCount: 5,
  },
  styling: {
    primaryColor: '#0052CC',
    breakingColor: '#EF4444',
  }
};

const getStoredSettings = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem('themeSettings');
    if (stored) {
      // Merge stored settings with defaults to ensure all keys are present after an update
      const parsed = JSON.parse(stored);
      return {
        general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
        header: { ...DEFAULT_SETTINGS.header, ...parsed.header },
        footer: { ...DEFAULT_SETTINGS.footer, ...parsed.footer },
        homepage: { ...DEFAULT_SETTINGS.homepage, ...parsed.homepage },
        styling: { ...DEFAULT_SETTINGS.styling, ...parsed.styling },
      };
    }
  } catch (error) {
    console.error('Failed to parse theme settings from localStorage', error);
  }
  return DEFAULT_SETTINGS;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(getStoredSettings);

  useEffect(() => {
    try {
      localStorage.setItem('themeSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save theme settings to localStorage', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
        const updated = {
            ...prev,
            ...newSettings,
            // Deep merge nested objects to prevent overwriting whole objects
            general: { ...prev.general, ...newSettings.general },
            header: { ...prev.header, ...newSettings.header },
            footer: { ...prev.footer, ...newSettings.footer },
            homepage: { ...prev.homepage, ...newSettings.homepage },
            styling: { ...prev.styling, ...newSettings.styling },
        };
        return updated;
    });
  };

  const resetSettings = () => {
    localStorage.removeItem('themeSettings');
    setSettings(DEFAULT_SETTINGS);
  }

  const value = useMemo(() => ({
      settings,
      updateSettings,
      resetSettings,
  }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
