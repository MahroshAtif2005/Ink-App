import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Repeat, BarChart3, Hash, Calendar as CalendarIcon } from 'lucide-react';
import type { JournalEntry } from '../App';

interface InsightsProps {
  entries: JournalEntry[];
}

export function Insights({ entries }: InsightsProps) {
  // Get mood counts and percentages
  const getMoodCounts = () => {
    const counts: Record<string, number> = {};
    entries.forEach((entry) => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      }
    });
    return counts;
  };

  const moodCounts = getMoodCounts();
  const totalWithMood = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      joy: '😊',
      calm: '😌',
      sad: '😔',
      anxious: '😰',
      stressed: '🫠',
      motivated: '💪',
      grateful: '🙏',
    };
    return emojis[mood] || '😐';
  };

  const getMoodLabel = (mood: string) => {
    const labels: Record<string, string> = {
      joy: 'Content',
      calm: 'Calm',
      sad: 'Sad',
      anxious: 'Anxious',
      stressed: 'Stressed',
      motivated: 'Motivated',
      grateful: 'Grateful',
    };
    return labels[mood] || mood;
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      joy: '#FCD34D',
      calm: '#93C5FD',
      sad: '#A5B4FC',
      anxious: '#FDA4AF',
      stressed: '#FB923C',
      motivated: '#86EFAC',
      grateful: '#DDD6FE',
    };
    return colors[mood] || '#D4D4D4';
  };

  // Weekly stats
  const weekEntries = entries.filter((e) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return e.date >= weekAgo;
  });

  const prevWeekEntries = entries.filter((e) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return e.date >= twoWeeksAgo && e.date < weekAgo;
  });

  // Calculate mood trend changes
  const getMoodTrend = (mood: string) => {
    const thisWeekCount = weekEntries.filter(e => e.mood === mood).length;
    const lastWeekCount = prevWeekEntries.filter(e => e.mood === mood).length;
    
    if (lastWeekCount === 0) return { change: 0, direction: 'neutral' as const };
    
    const percentChange = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
    return {
      change: Math.abs(percentChange),
      direction: percentChange > 0 ? 'up' as const : percentChange < 0 ? 'down' as const : 'neutral' as const,
    };
  };

  // Most common writing day/time
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const dayFrequency: Record<string, number> = {};
  entries.forEach(entry => {
    const day = getDayName(entry.date);
    dayFrequency[day] = (dayFrequency[day] || 0) + 1;
  });

  const mostCommonDay = Object.entries(dayFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Tuesday';
  const avgHour = entries.length > 0 
    ? Math.round(entries.reduce((sum, e) => sum + e.date.getHours(), 0) / entries.length)
    : 20;

  // Extract themes from actual entry content
  const extractThemes = () => {
    const themeCounts: Record<string, number> = {};
    
    // Keywords to track (expandable)
    const themeKeywords: Record<string, string[]> = {
      'Work': ['work', 'project', 'meeting', 'deadline', 'presentation', 'team', 'office', 'job'],
      'Family': ['family', 'mom', 'dad', 'parent', 'child', 'kid', 'sibling', 'brother', 'sister'],
      'Friends': ['friend', 'conversation', 'hang', 'catch up', 'connected'],
      'Health': ['health', 'exercise', 'workout', 'run', 'walk', 'meditation', 'yoga'],
      'Mindfulness': ['mindful', 'meditation', 'grateful', 'reflect', 'peace', 'calm', 'present'],
      'Nature': ['park', 'sunset', 'outdoor', 'walk', 'nature', 'weather', 'sky'],
      'Productivity': ['focus', 'productive', 'prioritize', 'organize', 'accomplish', 'goals'],
      'Growth': ['learn', 'growth', 'improve', 'better', 'progress', 'develop', 'patient'],
      'Stress': ['stress', 'overwhelm', 'anxious', 'worried', 'pressure'],
      'Books': ['book', 'read', 'reading'],
    };

    entries.forEach(entry => {
      const contentLower = entry.content.toLowerCase();
      
      Object.entries(themeKeywords).forEach(([theme, keywords]) => {
        keywords.forEach(keyword => {
          if (contentLower.includes(keyword)) {
            themeCounts[theme] = (themeCounts[theme] || 0) + 1;
          }
        });
      });
    });

    // Sort themes by count and return top 5
    return Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const themes = extractThemes();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="px-4 pt-8 pb-6"
    >
      <h1 className="font-display text-[34px] font-semibold mb-6 text-[#171717] tracking-tight" style={{ letterSpacing: '-0.5px' }}>
        Insights
      </h1>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <p className="text-[17px] text-[#525252] mb-4">No data yet</p>
          <p className="text-[15px] text-[#A3A3A3]">Create some entries to see insights about your moods and themes.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
        {/* Weekly Digest Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4 min-h-[180px] flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[20px] font-semibold text-[#171717] mb-1">This Week</h3>
              <p className="text-[13px] text-[#525252]">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#171717]">{weekEntries.length} entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-[#525252]">Avg mood:</span>
              <span className="text-xl">{dominantMood ? getMoodEmoji(dominantMood) : '😐'}</span>
            </div>
            <div className="text-[15px] text-[#525252]">
              Most written: <span className="font-semibold text-[#171717]">{mostCommonDay} evenings</span>
            </div>
          </div>

          <button className="mt-4 text-[15px] text-[#007AFF] font-semibold self-start active:opacity-60 transition-opacity">
            View Details
          </button>
        </motion.div>

        {/* How You Felt - Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4"
        >
          <h3 className="text-[17px] font-semibold mb-3 text-[#171717]">How You Felt</h3>
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-lg p-4">
            <p className="text-[15px] text-[#A3A3A3] italic leading-relaxed">
              AI-generated weekly summary coming soon. We'll analyze your entries to give you insights into your emotional journey this week.
            </p>
          </div>
        </motion.div>

        {/* Mood Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4"
        >
          <h3 className="text-[17px] font-semibold mb-4 text-[#171717]">Mood Trends</h3>
          
          <div className="space-y-4">
            {Object.entries(moodCounts).map(([mood, count]) => {
              const percentage = totalWithMood > 0 ? Math.round((count / totalWithMood) * 100) : 0;
              const trend = getMoodTrend(mood);
              
              return (
                <div key={mood} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMoodEmoji(mood)}</span>
                      <span className="text-[15px] font-medium text-[#171717]">{getMoodLabel(mood)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] text-[#525252]">{percentage}%</span>
                      {trend.direction !== 'neutral' && (
                        <div className="flex items-center gap-1">
                          {trend.direction === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-[#F5F5F4] rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getMoodColor(mood) + '99' }} // 60% opacity
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recurring Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4"
        >
          <h3 className="text-[17px] font-semibold mb-4 text-[#171717]">Recurring Patterns</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FDA4AF]/10 flex items-center justify-center flex-shrink-0">
                <Repeat className="w-5 h-5 text-[#FDA4AF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-[#171717] mb-1">Work Stress</h4>
                <p className="text-[13px] text-[#525252] mb-2">
                  Appears on Sunday nights<br />
                  4 times this month
                </p>
                <button className="text-[15px] text-[#007AFF] font-semibold active:opacity-60 transition-opacity">
                  See entries
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Writing Habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#171717]" />
            <h3 className="text-[17px] font-semibold text-[#171717]">Writing Habits</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-[15px] text-[#525252]">
              You write most on <span className="font-semibold text-[#171717]">{mostCommonDay}s</span>
              <br />
              <span className="text-[13px]">({avgHour > 12 ? `${avgHour - 12}` : avgHour} {avgHour >= 12 ? 'PM' : 'AM'} average)</span>
            </div>
            <div className="text-[15px] text-[#525252]">
              Longest entries when <span className="font-semibold text-[#171717]">anxious</span>
              <br />
              <span className="text-[13px]">(450 avg words)</span>
            </div>
          </div>
        </motion.div>

        {/* Top Themes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-[10px] p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-[#171717]" />
            <h3 className="text-[17px] font-semibold text-[#171717]">Top Themes</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-[13px] text-[#525252] mb-3">Most mentioned:</p>
            {themes.map((theme) => (
              <div key={theme.name} className="flex items-center justify-between py-2 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[15px] text-[#171717]">• {theme.name}</span>
                <span className="text-[13px] text-[#525252]">({theme.count}x)</span>
              </div>
            ))}
          </div>

          <button className="text-[15px] text-[#007AFF] font-semibold active:opacity-60 transition-opacity">
            Explore
          </button>
        </motion.div>
      </div>
      )}
    </motion.div>
  );
}