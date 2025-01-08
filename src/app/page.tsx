"use client"
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Stats {
  totalPosts: number;
  likedCount: number;
  commentedCount: number;
  commentsCount: number;
  likesCount: number;
}

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data: Stats = await response.json();
        setStats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="relative top-[100px] left-[50%]">Loading...</p>;
  if (error) return <p className="relative top-[100px] left-[50%]">Error: {error}</p>;
  if (!stats) return <p className="relative top-[100px] left-[50%]">No stats available for this user.</p>;

  // Calculate level
  const unlikedPosts = stats.totalPosts - stats.likedCount;
  const level = Math.floor((stats.likesCount + unlikedPosts) / 10); // Example: 1 level per 10 points

  const barData = {
    labels: ["Posts", "Likes", "Comments", "Liked", "Commented"],
    datasets: [
      {
        label: "User Activity",
        data: [
          stats.totalPosts,
          stats.likesCount,
          stats.commentsCount,
          stats.likedCount,
          stats.commentedCount,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const progressBars = [
    { label: "Likes", value: stats.likesCount },
    { label: "Comments", value: stats.commentsCount },
    { label: "Liked", value: stats.likedCount },
    { label: "Commented", value: stats.commentedCount },
  ];

  return (
    <div className="relative top-[250px] p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8 text-white border p-5 w-fit mx-auto rounded animate-pulse">User Stats</h1>
      <div className="max-w-4xl grid gap-10 mx-auto p-6">
        {/* Bar Chart */}
        <h2 className="text-lg font-semibold text-white mb-4 pb-1 border-b-white border-b w-fit">
          Bar Chart
        </h2>
        <div className="mb-8 bg-gray-950 p-10 rounded">
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        {/* Progress Bars */}
        <h2 className="text-lg font-semibold pb-1 text-white mb-4 border-b-white border-b w-fit">
          User Interaction Overview
        </h2>
        <div className="bg-gray-950 p-10 rounded">
          {progressBars.map((bar, index) => (
            <div key={index} className="mb-6">
              <p className="text-white mb-2">
                {bar.label}: {bar.value}
              </p>
              <div className="relative w-full h-4 bg-gray-800 rounded">
                <div
                  className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
                  style={{ width: `${(bar.value / stats.totalPosts) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Level Section */}
        <h2 className="text-lg font-semibold pb-1 text-white mb-4 border-b-white border-b w-fit">
          User Level
        </h2>
        <div className="bg-gray-950 p-10 rounded text-white">
          <p>
            Based on your activity, your current level is: <span className="font-bold">{level}</span>
          </p>
          <p>
            Points calculation: Likes (<span className="font-bold">{stats.likesCount}</span>) + 
            Unliked Posts (<span className="font-bold">{unlikedPosts}</span>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
