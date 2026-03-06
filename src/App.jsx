import { useState, useEffect } from 'react';
import { translations } from './data/translations';
import { useElectionData } from './hooks/useElectionData';
import Header from './components/Header';
import ResultsBoard from './components/ResultsBoard';
import AdminPanel from './components/AdminPanel';

const isAdminRoute = window.location.pathname === '/adminramechhapelection';

function App() {
  // Theme state
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('remechhap_theme') === 'dark';
    } catch { return false; }
  });

  // Language state
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('remechhap_lang') || 'en';
    } catch { return 'en'; }
  });

  // Admin panel: only available on /adminramechhapelection route
  const [adminOpen, setAdminOpen] = useState(isAdminRoute);

  const {
    candidates, totalVotes, lastUpdated,
    isSimulating, setIsSimulating,
    addCandidate, updateCandidate, updateVotes,
    deleteCandidate, resetData,
    wardResults, saveWardResult, getWardResult,
  } = useElectionData();

  // Apply dark class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('remechhap_theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('remechhap_lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.en;

  const handleThemeToggle = () => setDark(d => !d);
  const handleLangChange = (newLang) => setLang(newLang);
  const handleAdminToggle = () => setAdminOpen(o => !o);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        t={t}
        lang={lang}
        onLangChange={handleLangChange}
        dark={dark}
        onThemeToggle={handleThemeToggle}
        lastUpdated={lastUpdated}
        isSimulating={isSimulating}
        totalVotes={totalVotes}
      />

      <main>
        <ResultsBoard
          candidates={candidates}
          totalVotes={totalVotes}
          wardResults={wardResults}
          t={t}
          lang={lang}
        />

        {isAdminRoute && (
          <AdminPanel
            candidates={candidates}
            t={t}
            lang={lang}
            onAdd={addCandidate}
            onUpdate={updateCandidate}
            onDelete={deleteCandidate}
            onUpdateVotes={updateVotes}
            onReset={resetData}
            wardResults={wardResults}
            saveWardResult={saveWardResult}
            getWardResult={getWardResult}
            isOpen={adminOpen}
            onToggle={handleAdminToggle}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {lang === 'np'
              ? 'रामेछाप जिल्ला निर्वाचन परिणाम प्रणाली — अनुकरण उद्देश्यका लागि मात्र'
              : 'Ramechhap District Election Result System — For Simulation Purposes Only'}
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-700 mt-1">
            © {new Date().getFullYear()} Election Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
