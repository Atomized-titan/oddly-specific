/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useVoting.ts
import { useState } from "react";

interface UseVotingProps {
  complimentId: string;
}

export const useVoting = ({ complimentId }: UseVotingProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = async () => {
    try {
      setIsVoting(true);
      const response = await fetch(`/api/compliments/${complimentId}/vote`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to vote");
      }
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsVoting(false);
    }
  };

  return { vote, isVoting, error };
};
