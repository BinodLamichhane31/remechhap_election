import { useState, useEffect, useCallback } from 'react';
import { initialCandidates } from '../data/candidates';

const STORAGE_KEY = 'remechhap_candidates';
const WARD_STORAGE_KEY = 'remechhap_ward_results';

export function useElectionData() {
  const [candidates, setCandidates] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialCandidates;
    } catch {
      return initialCandidates;
    }
  });

  // wardResults shape:
  // { "localLevelId-wardNo": { candidateId: votes, ... }, ... }
  const [wardResults, setWardResults] = useState(() => {
    try {
      const stored = localStorage.getItem(WARD_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Persist candidates to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  // Persist ward results to localStorage
  useEffect(() => {
    localStorage.setItem(WARD_STORAGE_KEY, JSON.stringify(wardResults));
  }, [wardResults]);

  // Live vote simulation removed as per user request
  useEffect(() => {
    // We no longer simulate votes. Votes are driven strictly by ward results (or manually added for simplicity elsewhere).
  }, []);

  // Compute total votes for each candidate from the wardResults
  // wardResults shape: { "localLevelId-wardNo": { candidateId: votes, ... } }
  const computedCandidates = candidates.map(c => {
    let sum = 0;
    for (const key in wardResults) {
      if (wardResults[key] && wardResults[key][c.id]) {
        sum += Number(wardResults[key][c.id]);
      }
    }
    return { ...c, votes: sum };
  });

  // ── Candidate CRUD ─────────────────────────────────────
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

  // ── Ward Results CRUD ───────────────────────────────────
  // key format: `${localLevelId}-${wardNo}`
  const saveWardResult = useCallback((localLevelId, wardNo, votes) => {
    // votes: { [candidateId]: voteCount }
    const key = `${localLevelId}-${wardNo}`;
    setWardResults(prev => ({
      ...prev,
      [key]: { ...votes },
    }));
    setLastUpdated(new Date());
  }, []);

  const getWardResult = useCallback((localLevelId, wardNo) => {
    const key = `${localLevelId}-${wardNo}`;
    return wardResults[key] || {};
  }, [wardResults]);

  const clearWardResult = useCallback((localLevelId, wardNo) => {
    const key = `${localLevelId}-${wardNo}`;
    setWardResults(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Returns summary: how many wards entered per local level
  const getWardSummary = useCallback((localLevelId) => {
    return Object.keys(wardResults).filter(k => k.startsWith(`${localLevelId}-`)).length;
  }, [wardResults]);

  const totalVotes = computedCandidates.reduce((sum, c) => sum + c.votes, 0);
  const sorted = [...computedCandidates].sort((a, b) => b.votes - a.votes);

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
    // ward results
    wardResults,
    saveWardResult,
    getWardResult,
    clearWardResult,
    getWardSummary,
  };
}
