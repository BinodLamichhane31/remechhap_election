import { useState, useEffect, useCallback } from 'react';
import { initialCandidates } from '../data/candidates';

const STORAGE_KEY = 'remechhap_candidates';

export function useElectionData() {
  const [candidates, setCandidates] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialCandidates;
    } catch {
      return initialCandidates;
    }
  });

  const [isSimulating, setIsSimulating] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  // Live vote simulation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setCandidates(prev => {
        const updated = prev.map(c => {
          // Random increment: top candidates get more votes
          const boost = Math.random() < 0.7 ? Math.floor(Math.random() * 80) + 10 : 0;
          return { ...c, votes: c.votes + boost };
        });
        setLastUpdated(new Date());
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const addCandidate = useCallback((candidate) => {
    const newCandidate = {
      ...candidate,
      id: Date.now(),
      votes: Number(candidate.votes) || 0,
    };
    setCandidates(prev => [...prev, newCandidate]);
  }, []);

  const updateCandidate = useCallback((id, updates) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates, votes: Number(updates.votes ?? c.votes) } : c)
    );
  }, []);

  const updateVotes = useCallback((id, votes) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, votes: Number(votes) } : c)
    );
    setLastUpdated(new Date());
  }, []);

  const deleteCandidate = useCallback((id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }, []);

  const resetData = useCallback(() => {
    setCandidates(initialCandidates);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);

  return {
    candidates: sorted,
    totalVotes,
    lastUpdated,
    isSimulating,
    setIsSimulating,
    addCandidate,
    updateCandidate,
    updateVotes,
    deleteCandidate,
    resetData,
  };
}
