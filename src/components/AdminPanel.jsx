import { useState } from 'react';

const emptyForm = {
  name: '', nameNp: '', party: '', partyNp: '',
  photo: '', symbol: '', votes: 0, color: '#6366f1',
  bgColor: 'rgba(99,102,241,0.1)',
};

export default function AdminPanel({ candidates, t, lang, onAdd, onUpdate, onDelete, onUpdateVotes, onReset, isOpen, onToggle }) {
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit' | 'votes'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [voteInput, setVoteInput] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd({ ...form });
    setForm(emptyForm);
    setMode('list');
  };

  const handleEdit = (c) => {
    setForm({ ...c });
    setEditId(c.id);
    setMode('edit');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdate(editId, form);
    setEditId(null);
    setForm(emptyForm);
    setMode('list');
  };

  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };

  const handleDeleteExecute = () => {
    onDelete(confirmDelete);
    setConfirmDelete(null);
  };

  const handleVoteChange = (id, val) => {
    setVoteInput(prev => ({ ...prev, [id]: val }));
  };

  const handleVoteUpdate = (id) => {
    const val = voteInput[id];
    if (val !== undefined && val !== '') {
      onUpdateVotes(id, Number(val));
      setVoteInput(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Toggle button */}
      <button
        id="admin-toggle"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-semibold text-sm
          transition-all duration-300 border
          ${isOpen
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-900/40'}`}>
            <svg className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-left">
            <div>{t.adminPanel}</div>
            <div className={`text-xs font-normal ${isOpen ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {t.adminSubtitle}
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel Body */}
      {isOpen && (
        <div className="mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in">
          {/* Sub-nav */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
            {[
              { key: 'list', label: lang === 'np' ? 'तालिका' : 'Candidates List' },
              { key: 'votes', label: lang === 'np' ? 'मत अद्यावधिक' : 'Update Votes' },
              { key: 'add', label: `+ ${t.addCandidate}` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-semibold border-b-2 transition-colors duration-150
                  ${mode === tab.key || (mode === 'edit' && tab.key === 'list')
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center px-4">
              <button
                onClick={onReset}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
              >
                Reset Data
              </button>
            </div>
          </div>

          {/* DELETE CONFIRM DIALOG */}
          {confirmDelete && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center gap-4">
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">{t.confirmDelete}</span>
              <button onClick={handleDeleteExecute} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          )}

          {/* LIST MODE */}
          {(mode === 'list' || mode === 'edit') && (
            <div className="overflow-x-auto">
              {mode === 'edit' && (
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">{t.editCandidate}</h3>
                  <CandidateForm form={form} onChange={handleFormChange} onSubmit={handleSaveEdit} onCancel={() => setMode('list')} t={t} />
                </div>
              )}

              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    {['#', lang === 'np' ? 'नाम' : 'Name', lang === 'np' ? 'पार्टी' : 'Party', lang === 'np' ? 'मत' : 'Votes', lang === 'np' ? 'कार्य' : 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {candidates.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={c.photo} alt={c.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`; }} />
                          <div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{lang === 'np' ? c.nameNp : c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full text-white inline-block" style={{ backgroundColor: c.color }}>
                          {lang === 'np' ? c.partyNp : c.party}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-white number-animate">
                        {c.votes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(c.id)}
                            className="text-xs px-3 py-1.5 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                          >
                            {t.deleteCandidate}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VOTES MODE */}
          {mode === 'votes' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    {['#', lang === 'np' ? 'नाम' : 'Name', lang === 'np' ? 'हालको मत' : 'Current Votes', lang === 'np' ? 'नयाँ मत' : 'New Votes', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {candidates.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                          <span className="text-sm font-semibold text-gray-800 dark:text-white">{lang === 'np' ? c.nameNp : c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 number-animate">
                        {c.votes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={voteInput[c.id] ?? ''}
                          onChange={(e) => handleVoteChange(c.id, e.target.value)}
                          placeholder={String(c.votes)}
                          className="w-32 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleVoteUpdate(c.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40"
                          disabled={voteInput[c.id] === undefined || voteInput[c.id] === ''}
                        >
                          {t.updateVotes}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ADD MODE */}
          {mode === 'add' && (
            <div className="p-5">
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">{t.addCandidate}</h3>
              <CandidateForm form={form} onChange={handleFormChange} onSubmit={handleAdd} onCancel={() => { setMode('list'); setForm(emptyForm); }} t={t} isAdd />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CandidateForm({ form, onChange, onSubmit, onCancel, t, isAdd = false }) {
  const fields = [
    { key: 'name', label: t.name, type: 'text' },
    { key: 'nameNp', label: t.nameNp, type: 'text' },
    { key: 'party', label: t.party, type: 'text' },
    { key: 'partyNp', label: t.partyNp, type: 'text' },
    { key: 'photo', label: t.photo, type: 'url' },
    { key: 'symbol', label: t.symbol, type: 'url' },
    { key: 'votes', label: t.currentVotes, type: 'number' },
    { key: 'color', label: t.color, type: 'color' },
  ];

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label>
            {type === 'color' ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form[key] || '#6366f1'}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{form[key]}</span>
              </div>
            ) : (
              <input
                type={type}
                value={form[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                required={['name', 'nameNp', 'party', 'partyNp'].includes(key)}
                min={type === 'number' ? 0 : undefined}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl
                           bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                placeholder={label}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-5">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {isAdd ? t.addCandidate : t.saveChanges}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
