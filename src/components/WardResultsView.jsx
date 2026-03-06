import { useState, useMemo } from 'react';
import { localLevels } from '../data/localLevels';
import VoteProgress from './VoteProgress';

export default function WardResultsView({ candidates, wardResults, t, lang }) {
  const [selectedLocalLevel, setSelectedLocalLevel] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // When selected level changes, reset ward to 'all' or specific
  const handleLocalLevelChange = (e) => {
    setSelectedLocalLevel(e.target.value);
    setSelectedWard(''); 
  };

  // Compute derived results based on selection
  const computedResults = useMemo(() => {
    if (!selectedLocalLevel) return null;

    // Keys to aggregate. If ward is empty, aggregate all wards for this local level.
    const keysToSum = Object.keys(wardResults).filter(k => {
      if (selectedWard) return k === `${selectedLocalLevel}-${selectedWard}`;
      return k.startsWith(`${selectedLocalLevel}-`);
    });

    // Sum votes for each candidate
    let totalVotes = 0;
    const stats = candidates.map(c => {
      let sum = 0;
      keysToSum.forEach(k => {
        if (wardResults[k] && wardResults[k][c.id]) {
          sum += Number(wardResults[k][c.id]);
        }
      });
      totalVotes += sum;
      return { ...c, votes: sum };
    });

    // Sort descending
    stats.sort((a, b) => b.votes - a.votes);

    return { stats, totalVotes };
  }, [selectedLocalLevel, selectedWard, wardResults, candidates]);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-10">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/30">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {t.wardWiseResults}
        </h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 font-medium"
            value={selectedLocalLevel}
            onChange={handleLocalLevelChange}
          >
            <option value="">-- {t.selectLocalLevel} --</option>
            {localLevels.map(ll => (
              <option key={ll.id} value={ll.id}>
                {lang === 'np' ? ll.nameNp : ll.name}
              </option>
            ))}
          </select>
          <select
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 font-medium disabled:opacity-50"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedLocalLevel}
          >
            <option value="">{lang === 'np' ? 'सबै वडाहरू' : 'All Wards'}</option>
            {selectedLocalLevel && Array.from({ length: localLevels.find(l => l.id == selectedLocalLevel)?.wards || 0 }).map((_, i) => (
              <option key={i+1} value={i+1}>{t.ward} {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-0 sm:p-5">
        {!selectedLocalLevel ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {lang === 'np' ? 'परिणाम हेर्न स्थानीय तह छान्नुहोस्' : 'Select a local level to view its results'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50 dark:bg-gray-900/50 hidden sm:table-header-group">
                <tr>
                  {['#', lang === 'np' ? 'उम्मेदवार' : 'Candidate', lang === 'np' ? 'प्राप्त मत' : 'Votes'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {computedResults.stats.map((c, i) => {
                  const percentage = computedResults.totalVotes > 0 
                    ? ((c.votes / computedResults.totalVotes) * 100).toFixed(1) 
                    : 0;

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-gray-400 w-12 hidden sm:table-cell">#{i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.photo} alt={c.name} className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                            style={{ borderColor: c.color }}
                            onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`; }} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {lang === 'np' ? c.nameNp : c.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white tracking-wide" style={{ backgroundColor: c.color }}>
                                {lang === 'np' ? c.partyNp : c.party}
                              </span>
                            </div>
                            {/* Mobile only votes */}
                            <div className="flex items-center justify-between sm:hidden mt-2">
                              <span className="text-sm font-black number-animate dark:text-white">{c.votes.toLocaleString()}</span>
                              <span className="text-xs font-bold" style={{ color: c.color }}>{percentage}%</span>
                            </div>
                            <div className="mt-1.5 sm:mt-1 max-w-[200px] sm:max-w-none">
                              <VoteProgress percentage={parseFloat(percentage)} color={c.color} animate />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell text-right w-32">
                        <div className="text-base font-black text-gray-900 dark:text-white number-animate">
                          {c.votes.toLocaleString()}
                        </div>
                        <div className="text-xs font-bold mt-0.5" style={{ color: c.color }}>
                          {percentage}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
