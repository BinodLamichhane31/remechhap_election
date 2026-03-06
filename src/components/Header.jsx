import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header({ t, lang, onLangChange, dark, onThemeToggle, lastUpdated, isSimulating, totalVotes }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatVotes = (n) => n.toLocaleString();

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl translate-y-1/2" />
      </div>

      {/* Nepal-inspired top stripe */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row: controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Nepal flag emoji / election icon */}
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <span className="text-2xl">🗳️</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                {isSimulating && (
                  <span className="flex items-center gap-1.5 text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {t.voteSimulation}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} onToggle={onLangChange} />
            <ThemeToggle dark={dark} onToggle={onThemeToggle} />
          </div>
        </div>

        {/* Main title section */}
        <div className="text-center">
          <p className="text-blue-200 dark:text-blue-300 text-sm font-medium tracking-widest uppercase mb-2 opacity-80">
            {lang === 'np' ? 'नेपाल निर्वाचन आयोग' : 'Election Commission of Nepal'}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight">
            {t.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg sm:text-xl text-blue-100 font-semibold">{t.subtitle}</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white number-animate">
                {formatVotes(totalVotes)}
              </span>
              <span className="text-xs text-blue-200 mt-0.5 font-medium">{t.totalVotes}</span>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-white">{formatTime(lastUpdated)}</span>
              <span className="text-xs text-blue-200 mt-0.5 font-medium">{t.lastUpdated}</span>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-white">
                {lang === 'np' ? 'रामेछाप जिल्ला' : 'Ramechhap District'}
              </span>
              <span className="text-xs text-blue-200 mt-0.5 font-medium">
                {lang === 'np' ? 'प्रदेश नं. बागमती' : 'Bagmati Province'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative h-8 overflow-hidden">
        <svg viewBox="0 0 1200 48" fill="none" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path d="M0 48 L0 24 Q300 0 600 24 Q900 48 1200 24 L1200 48 Z"
            className="fill-gray-50 dark:fill-gray-900" />
        </svg>
      </div>
    </header>
  );
}
