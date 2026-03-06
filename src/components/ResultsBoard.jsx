import CandidateCard from './CandidateCard';
import VoteProgress from './VoteProgress';

export default function ResultsBoard({ candidates, totalVotes, t, lang }) {
  const top4 = candidates.slice(0, 4);
  const rest = candidates.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top 4 Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t.topContenders}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {top4.map((candidate, idx) => (
            <div key={candidate.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <CandidateCard
                candidate={candidate}
                rank={idx}
                totalVotes={totalVotes}
                t={t}
                lang={lang}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Remaining candidates — leaderboard row */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t.allCandidates}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            {rest.map((candidate, idx) => {
              const rank = idx + 4;
              const percentage = totalVotes > 0
                ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                : 0;
              return (
                <div
                  key={candidate.id}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150
                    ${idx < rest.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                >
                  {/* Rank number */}
                  <div className="w-8 text-center">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">#{rank + 1}</span>
                  </div>

                  {/* Photo */}
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2"
                    style={{ borderColor: candidate.color }}
                  >
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`; }}
                    />
                  </div>

                  {/* Name + Party */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {lang === 'np' ? candidate.nameNp : candidate.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0"
                        style={{ backgroundColor: candidate.color }}>
                        {lang === 'np' ? candidate.partyNp : candidate.party}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <VoteProgress percentage={parseFloat(percentage)} color={candidate.color} animate />
                    </div>
                  </div>

                  {/* Votes */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold number-animate text-gray-800 dark:text-white">
                      {candidate.votes.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium" style={{ color: candidate.color }}>
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
