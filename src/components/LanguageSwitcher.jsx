export default function LanguageSwitcher({ lang, onToggle }) {
  return (
    <div className="flex items-center gap-0.5 bg-white/10 dark:bg-gray-800 border border-white/20 dark:border-gray-600 rounded-full p-0.5 backdrop-blur-sm">
      <button
        id="lang-en"
        onClick={() => onToggle('en')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200
          ${lang === 'en'
            ? 'bg-white text-gray-900 shadow'
            : 'text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-white'
          }`}
      >
        EN
      </button>
      <button
        id="lang-np"
        onClick={() => onToggle('np')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200
          ${lang === 'np'
            ? 'bg-white text-gray-900 shadow'
            : 'text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-white'
          }`}
      >
        NP
      </button>
    </div>
  );
}
