import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, Medal, Crown, Star, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    try {
      const response = await quizService.getLeaderboard();
      setLeaderboard(response.content || []);
      
      if (isRefresh) {
        toast.success('Leaderboard updated!');
      }
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    fetchLeaderboard(true);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };

  const getCardStyle = (rank, isCurrentUser) => {
    let baseStyle = 'card transition-all duration-300 hover:shadow-xl ';
    
    if (isCurrentUser) {
      baseStyle += 'ring-2 ring-primary-500 bg-primary-50 ';
    }
    
    switch (rank) {
      case 1:
        return baseStyle + 'border-yellow-200 shadow-yellow-100';
      case 2:
        return baseStyle + 'border-gray-200 shadow-gray-100';
      case 3:
        return baseStyle + 'border-orange-200 shadow-orange-100';
      default:
        return baseStyle;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center items-center mb-4 space-x-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-2">See how you rank among your peers!</p>
        <p className="text-sm text-gray-500 mt-1">Updates automatically every 30 seconds</p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex justify-center items-end space-x-4 mb-8">
          {/* Second Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg p-4 mb-2 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Medal className="h-8 w-8 text-gray-500" />
              </div>
              <div className="text-white">
                <p className="font-bold text-lg">{leaderboard[1]?.username}</p>
                <p className="text-sm opacity-90">{leaderboard[1]?.xp} XP</p>
              </div>
            </div>
            <div className="bg-gray-300 h-20 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">2</span>
            </div>
          </div>

          {/* First Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-2 transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-10 w-10 text-yellow-500" />
              </div>
              <div className="text-white">
                <p className="font-bold text-xl">{leaderboard[0]?.username}</p>
                <p className="text-sm opacity-90">{leaderboard[0]?.xp} XP</p>
              </div>
            </div>
            <div className="bg-yellow-400 h-24 rounded-t-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-yellow-800">1</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 mb-2 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-white">
                <p className="font-bold text-lg">{leaderboard[2]?.username}</p>
                <p className="text-sm opacity-90">{leaderboard[2]?.xp} XP</p>
              </div>
            </div>
            <div className="bg-orange-400 h-16 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-800">3</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Rankings</h2>
        
        {leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((student, index) => {
              const rank = index + 1;
              const isCurrentUser = student.id === user?.id;
              
              return (
                <div
                  key={student.id}
                  className={getCardStyle(rank, isCurrentUser)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(rank)}`}>
                        <span className="text-lg font-bold">#{rank}</span>
                      </div>

                      {/* Rank Icon */}
                      <div className="hidden sm:block">
                        {getRankIcon(rank)}
                      </div>

                      {/* Student Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {student.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </div>

                    {/* XP Display */}
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-primary-600" />
                        <span className="text-xl font-bold text-primary-600">
                          {student.xp}
                        </span>
                        <span className="text-sm text-gray-500">XP</span>
                      </div>
                      
                      {/* Progress to next rank */}
                      {rank > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {leaderboard[rank - 2]?.xp - student.xp} XP behind #{rank - 1}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Achievement Badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rank === 1 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        🏆 Top Performer
                      </span>
                    )}
                    {student.xp >= 1000 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        ⭐ XP Master
                      </span>
                    )}
                    {student.xp >= 500 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🚀 Rising Star
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-600">Complete some quizzes to see the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;