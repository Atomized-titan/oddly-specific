// hooks/useVoting.ts
import { useState, useEffect } from "react";

interface VoteStatus {
  hasVoted: boolean;
  voteCount: number;
}

export const useVoting = (complimentId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({
    hasVoted: false,
    voteCount: 0,
  });

  // Check initial vote status
  useEffect(() => {
    if (!complimentId) return;

    const checkVoteStatus = async () => {
      try {
        const response = await fetch(`/api/compliments/${complimentId}/vote`);
        if (!response.ok) throw new Error("Failed to check vote status");
        const data = await response.json();
        setVoteStatus({ hasVoted: data.hasVoted, voteCount: data.voteCount });
      } catch (error) {
        console.error("Failed to check vote status:", error);
      }
    };

    checkVoteStatus();
  }, [complimentId]);

  const toggleVote = async () => {
    if (!complimentId || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const method = voteStatus.hasVoted ? "DELETE" : "POST";
      const response = await fetch(`/api/compliments/${complimentId}/vote`, {
        method,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many votes. Please try again later.");
        }
        throw new Error(data.error || "Failed to vote");
      }

      setVoteStatus({
        hasVoted: !voteStatus.hasVoted,
        voteCount: data.voteCount,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    hasVoted: voteStatus.hasVoted,
    voteCount: voteStatus.voteCount,
    toggleVote,
  };
};
