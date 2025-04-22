"use client";
import { useEffect, useState } from "react";
import { Ad } from "./Ad";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function AdList() {
  const [ads, setAds] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAds = async () => {
      if (!session?.user) return;
      setLoading(true);
      try {
        const response = await fetch("/api/ads");
        if (!response.ok) {
          throw new Error("Failed to fetch ads");
        }
        const data = await response.json();
        setAds(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [session?.user]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {ads.length === 0 ? (
        <div className="w-full h-96 flex items-center justify-center">
          No ads found.
        </div>
      ) : (
        ads.map((ad) => <Ad key={ad.id} ad={ad} />)
      )}
    </div>
  );
}