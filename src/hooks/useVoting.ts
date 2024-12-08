// hooks/useVoting.ts
import { useState, useEffect, useRef, useCallback } from "react";

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

  // Use refs to prevent unnecessary effect calls
  const previousId = useRef<string>(null);
  const checkingStatus = useRef(false);

  const checkVoteStatus = useCallback(async (id: string) => {
    if (checkingStatus.current) return;
    try {
      checkingStatus.current = true;
      const response = await fetch(`/api/compliments/${id}/vote`);
      if (!response.ok) throw new Error("Failed to check vote status");
      const data = await response.json();
      setVoteStatus({
        hasVoted: data.hasVoted,
        voteCount: data.voteCount,
      });
    } catch (error) {
      console.error("Failed to check vote status:", error);
    } finally {
      checkingStatus.current = false;
    }
  }, []);

  // Check initial vote status only when ID changes
  useEffect(() => {
    if (!complimentId || complimentId === previousId.current) return;
    previousId.current = complimentId;
    checkVoteStatus(complimentId);
  }, [complimentId, checkVoteStatus]);

  const toggleVote = async () => {
    if (!complimentId || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const method = voteStatus.hasVoted ? "DELETE" : "POST";
      const response = await fetch(`/api/compliments/${complimentId}/vote`, {
        method,
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          throw new Error("Too many votes. Please try again later.");
        }
        throw new Error(data.error || "Failed to vote");
      }

      const data = await response.json();

      // Update both vote status and count from response
      setVoteStatus({
        hasVoted: !voteStatus.hasVoted,
        voteCount: data.voteCount,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to vote");
      // Recheck status on error
      await checkVoteStatus(complimentId);
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
