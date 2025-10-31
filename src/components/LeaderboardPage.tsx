import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../contexts/ThemeContext";
import { Award, Star, Crown } from "lucide-react";
import LiquidGlassNav from "../components/LiquidGlassNav";
import Footer from "../components/Footer";

export default function LeaderboardPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const totalPoints = (data.ownerPoints || 0) + (data.renterPoints || 0);
          return {
            id: doc.id,
            displayName: data.displayName || doc.id.split("@")[0],
            email: data.email || doc.id,
            totalPoints,
            ownerPoints: data.ownerPoints || 0,
            renterPoints: data.renterPoints || 0,
            badges: data.badges || [],
          };
        });

        // sort by combined total descending
        usersData.sort((a, b) => b.totalPoints - a.totalPoints);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <LiquidGlassNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-purple-400">
          <Crown className="w-8 h-8 text-yellow-400" />
          Leaderboard
        </h1>

        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark" ? "bg-gray-800/60" : "bg-white/80 backdrop-blur-sm"
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <th className="py-3 px-2">Rank</th>
                <th className="py-3 px-2">User</th>
                <th className="py-3 px-2 text-center">Owner Points</th>
                <th className="py-3 px-2 text-center">Renter Points</th>
                <th className="py-3 px-2 text-center">Total Points</th>
                <th className="py-3 px-2">Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b hover:bg-purple-500/10 transition-all ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <td className="py-3 px-2 font-semibold">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>
                  <td className="py-3 px-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    {user.displayName}
                  </td>
                  <td className="py-3 px-2 text-center text-green-400">
                    {user.ownerPoints}
                  </td>
                  <td className="py-3 px-2 text-center text-blue-400">
                    {user.renterPoints}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-yellow-400">
                    {user.totalPoints}
                  </td>
                  <td className="py-3 px-2 flex flex-wrap gap-1">
                    {user.badges.length > 0 ? (
                      user.badges.map((badge: string, i: number) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            badge.includes("Reliable")
                              ? "bg-yellow-500/20 text-yellow-300"
                              : badge.includes("Engaged")
                              ? "bg-blue-500/20 text-blue-300"
                              : badge.includes("Perfect")
                              ? "bg-green-500/20 text-green-300"
                              : "bg-purple-700/30 text-purple-300"
                          }`}
                        >
                          {badge}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
