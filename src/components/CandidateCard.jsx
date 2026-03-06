import VoteProgress from './VoteProgress';

const rankConfig = {
  0: { badge: '🏆', label: 'declared', ring: 'ring-2 ring-yellow-400 leader-glow', bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20', badgeBg: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-400' },
  1: { badge: '🥈', label: 'second', ring: 'ring-1 ring-gray-300 dark:ring-gray-600', bg: 'bg-white dark:bg-gray-800', badgeBg: 'bg-gray-400', text: 'text-gray-500 dark:text-gray-400' },
  2: { badge: '🥉', label: 'third', ring: 'ring-1 ring-gray-200 dark:ring-gray-700', bg: 'bg-white dark:bg-gray-800', badgeBg: 'bg-orange-400', text: 'text-gray-500 dark:text-gray-400' },
  3: { badge: '4️⃣', label: 'fourth', ring: 'ring-1 ring-gray-200 dark:ring-gray-700', bg: 'bg-white dark:bg-gray-800', badgeBg: 'bg-blue-400', text: 'text-gray-500 dark:text-gray-400' },
};

export default function CandidateCard({ candidate, rank, totalVotes, t, lang }) {
  const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
  const cfg = rankConfig[rank] ?? rankConfig[3];
  const isLeader = rank === 0;

  return (
    <div className={`
      relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden
      ${cfg.bg} ${cfg.ring} group
    `}>
      {/* Top color accent bar */}
      <div className="h-1.5" style={{ backgroundColor: candidate.color }} />

      {/* Rank badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className="text-xl" title={`#${rank + 1}`}>{cfg.badge}</span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4 mb-5">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-4 shadow-md"
              style={{ borderColor: candidate.color }}
            >
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`;
                }}
              />
            </div>
            {isLeader && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>

          {/* Name + Party */}
          <div className="min-w-0 flex-1 pr-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
              {lang === 'np' ? candidate.nameNp : candidate.name}
            </h3>
            <p className="text-xs mt-1" style={{ color: candidate.color }}>
              {lang === 'np' ? candidate.partyNp : candidate.party}
            </p>

            {/* Symbol */}
            <div className="flex items-center gap-2 mt-2">
              <img
                src={candidate.symbol}
                alt="symbol"
                className="w-8 h-8 object-contain rounded"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {isLeader && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: candidate.color }}>
                  {t.leading}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Vote count */}
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-3xl font-black text-gray-900 dark:text-white number-animate tracking-tight">
            {candidate.votes.toLocaleString()}
          </span>
          <span className="text-lg font-bold" style={{ color: candidate.color }}>
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <VoteProgress percentage={parseFloat(percentage)} color={candidate.color} animate />

        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">{t.votes}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{t.percentage}</span>
        </div>
      </div>
    </div>
  );
}
