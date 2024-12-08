/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useVoting.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface VoteStatus {
  hasVoted: boolean;
  voteCount: number;
}

interface VoteError {
  message: string;
  isRateLimit?: boolean;
  retryAfter?: number;
}

export const useVoting = (complimentId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<VoteError | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({
    hasVoted: false,
    voteCount: 0,
  });

  const previousId = useRef<string>(null);
  const checkingStatus = useRef(false);

  const checkVoteStatus = useCallback(async (id: string) => {
    if (checkingStatus.current) return;
    try {
      checkingStatus.current = true;
      const response = await fetch(`/api/compliments/${id}/vote`);
      if (!response.ok) throw new Error("Failed to check vote status");
      const data = await response.json();
      setVoteStatus({ hasVoted: data.hasVoted, voteCount: data.voteCount });
    } catch (error) {
      console.error("Failed to check vote status:", error);
    } finally {
      checkingStatus.current = false;
    }
  }, []);

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

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const resetTime = response.headers.get("X-RateLimit-Reset");
          const retryAfter = resetTime
            ? Math.ceil((parseInt(resetTime) - Date.now()) / 1000)
            : 60; // default to 1 minute if no header

          throw {
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds`,
            isRateLimit: true,
            retryAfter,
            ...data,
          };
        }
        throw new Error(data.error || "Failed to vote");
      }

      setVoteStatus({
        hasVoted: !voteStatus.hasVoted,
        voteCount: data.voteCount,
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to vote";
      setError({
        message: errorMessage,
        isRateLimit: "isRateLimit" in error ? error.isRateLimit : false,
        retryAfter: "retryAfter" in error ? error.retryAfter : undefined,
      });

      if (!(error as any).isRateLimit) {
        // Only recheck status if it's not a rate limit error
        await checkVoteStatus(complimentId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto clear rate limit error after retry period
  useEffect(() => {
    if (error?.isRateLimit && error.retryAfter) {
      const timer = setTimeout(() => {
        setError(null);
      }, error.retryAfter * 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    isLoading,
    error,
    hasVoted: voteStatus.hasVoted,
    voteCount: voteStatus.voteCount,
    toggleVote,
  };
};
