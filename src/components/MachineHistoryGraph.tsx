import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Brush
} from 'recharts';
import { useSettings } from '../SettingsContext';
import type { TrainingCardSessionResult } from '../types';
import { TrendingUp, AlertCircle, Clock, Calendar, Zap } from 'lucide-react';

interface MachineHistoryGraphProps {
    results: TrainingCardSessionResult[];
    color?: string;
}

interface WeightStats {
    overall: { actual: number; percent: number };
    perWeek: { actual: number; percent: number };
}

interface Insight {
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    icon: React.ReactNode;
}

// Calculate moving average for smoothing
function calculateMovingAverage(data: (number | undefined)[], windowSize: number = 5): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
        const window = data.slice(start, end).filter((v): v is number => v !== undefined && !isNaN(v));

        if (window.length === 0) {
            result.push(data[i] || 0);
            continue;
        }
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
    }
    return result;
}

export const MachineHistoryGraph = ({ results, color = "#fbbf24" }: MachineHistoryGraphProps) => {
    const { unit, convertWeight } = useSettings();
    // Detect if we have multiple unique side IDs in this dataset.
    // If the parent has pre-filtered (like for separate E5 cards), this will be 1 or 0.
    const uniqueSideIds = useMemo(() => {
        const sides = results.map(r => r.side).filter(Boolean);
        return Array.from(new Set(sides)).sort(); // Sort to keep order consistent
    }, [results]);

    const hasDualSides = uniqueSideIds.length > 1;

    const chartData = useMemo(() => {
        // Sort results by timestamp first
        const sortedResults = [...results].sort((a, b) => (a.utcstart || 0) - (b.utcstart || 0));

        if (!hasDualSides) {
            const data = sortedResults.map(r => ({
                date: new Date((r.utcstart || 0) * 1000).toLocaleDateString(),
                weight: convertWeight(parseFloat(r.weight || "0")),
                time: r.timeinterval || 0,
                fullDate: new Date((r.utcstart || 0) * 1000).toLocaleString(),
                timestamp: r.utcstart || 0
            }));

            const weights = data.map(d => d.weight);
            const times = data.map(d => d.time);
            const smoothedWeights = calculateMovingAverage(weights, 5);
            const smoothedTimes = calculateMovingAverage(times, 5);

            return data.map((d, i) => ({
                ...d,
                weightTrend: smoothedWeights[i],
                timeTrend: smoothedTimes[i]
            }));
        } else {
            // Multi-side logic: Group by date
            const sessionsByDate: Record<string, any> = {};
            const sideA = uniqueSideIds[0];
            const sideB = uniqueSideIds[1];

            sortedResults.forEach(r => {
                const dateKey = new Date((r.utcstart || 0) * 1000).toLocaleDateString();
                if (!sessionsByDate[dateKey]) {
                    sessionsByDate[dateKey] = {
                        date: dateKey,
                        fullDate: new Date((r.utcstart || 0) * 1000).toLocaleString(),
                        timestamp: r.utcstart || 0,
                    };
                }

                const weight = convertWeight(parseFloat(r.weight || "0"));
                const time = r.timeinterval || 0;

                if (r.side === sideA) {
                    sessionsByDate[dateKey].weightLeft = weight;
                    sessionsByDate[dateKey].timeLeft = time;
                } else if (r.side === sideB) {
                    sessionsByDate[dateKey].weightRight = weight;
                    sessionsByDate[dateKey].timeRight = time;
                }
            });

            const groupedData = Object.values(sessionsByDate).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

            // Calculate trends for Side A / Side B independently
            const trendWL = calculateMovingAverage(groupedData.map(d => d.weightLeft), 5);
            const trendWR = calculateMovingAverage(groupedData.map(d => d.weightRight), 5);
            const trendTL = calculateMovingAverage(groupedData.map(d => d.timeLeft), 5);
            const trendTR = calculateMovingAverage(groupedData.map(d => d.timeRight), 5);

            return groupedData.map((d, i) => ({
                ...d,
                weightLeftTrend: trendWL[i],
                weightRightTrend: trendWR[i],
                timeLeftTrend: trendTL[i],
                timeRightTrend: trendTR[i]
            }));
        }
    }, [results, hasDualSides, uniqueSideIds, convertWeight]);

    const weightStats = useMemo((): WeightStats | null => {
        if (chartData.length < 2) return null;

        const getRepresentativeWeight = (d: any) => {
            if (d.weight !== undefined) return d.weight;
            const l = d.weightLeft || 0;
            const r = d.weightRight || 0;
            if (l > 0 && r > 0) return (l + r) / 2;
            return l || r || 0;
        };

        const firstWeight = getRepresentativeWeight(chartData[0]);
        const lastWeight = getRepresentativeWeight(chartData[chartData.length - 1]);
        const actualIncrease = lastWeight - firstWeight;
        const percentIncrease = firstWeight > 0 ? (actualIncrease / firstWeight) * 100 : 0;

        const firstTimestamp = chartData[0].timestamp;
        const lastTimestamp = chartData[chartData.length - 1].timestamp;
        const weeks = (lastTimestamp - firstTimestamp) / (7 * 24 * 60 * 60);

        return {
            overall: { actual: actualIncrease, percent: percentIncrease },
            perWeek: { actual: weeks > 0 ? actualIncrease / weeks : 0, percent: weeks > 0 ? percentIncrease / weeks : 0 }
        };
    }, [chartData, unit]);

    const insights = useMemo((): Insight[] => {
        if (chartData.length < 3) return [];
        const items: Insight[] = [];

        // 1. Progress Streak (Weight or Time)
        let streak = 0;
        for (let i = chartData.length - 1; i > 0; i--) {
            const current = chartData[i];
            const prev = chartData[i - 1];
            if (current.weight > prev.weight || (current.weight === prev.weight && current.time > prev.time)) {
                streak++;
            } else break;
        }
        if (streak >= 2) {
            items.push({
                type: 'success',
                title: 'Progress Streak',
                description: `You've increased weight or time in ${streak} consecutive sessions!`,
                icon: <Zap className="w-5 h-5" />
            });
        }

        // 2. Plateau Detection
        const lastXResults = chartData.slice(-5);
        if (lastXResults.length >= 5) {
            const allSameWeight = lastXResults.every(r => r.weight === lastXResults[0].weight);
            if (allSameWeight) {
                items.push({
                    type: 'warning',
                    title: 'Plateau Detected',
                    description: `Weight has been static for ${lastXResults.length} sessions. Consider a small increment or focus on tempo.`,
                    icon: <AlertCircle className="w-5 h-5" />
                });
            }
        }

        // 3. Time Under Tension Optimization (Kieser Target 60-90s)
        const lastResult = chartData[chartData.length - 1];
        if (lastResult.time >= 60 && lastResult.time <= 90) {
            items.push({
                type: 'success',
                title: 'Optimal Tempo',
                description: `Your last session hit the target duration (${lastResult.time}s), maximizing muscle fiber recruitment.`,
                icon: <Clock className="w-5 h-5" />
            });
        } else if (lastResult.time > 100) {
            items.push({
                type: 'info',
                title: 'Strength Ready',
                description: `Time Under Tension is high (${lastResult.time}s). You're likely ready to increase the resistance in your next session.`,
                icon: <TrendingUp className="w-5 h-5" />
            });
        }

        // 4. Training Frequency
        const firstDate = chartData[0].timestamp;
        const lastDate = chartData[chartData.length - 1].timestamp;
        const totalMonths = Math.max(1, (lastDate - firstDate) / (30 * 24 * 60 * 60));
        const sessionsPerMonth = chartData.length / totalMonths;
        if (sessionsPerMonth >= 4) {
            items.push({
                type: 'success',
                title: 'High Consistency',
                description: `Averaging ${sessionsPerMonth.toFixed(1)} sessions per month on this machine.`,
                icon: <Calendar className="w-5 h-5" />
            });
        }

        return items;
    }, [chartData]);

    if (results.length === 0) {
        return <div className="text-center text-muted p-4 italic">No specific history available.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {weightStats && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-bg-tertiary rounded-lg">
                    <div>
                        <div className="text-xs text-muted mb-1">Overall Increase</div>
                        <div className="text-lg font-bold">
                            {weightStats.overall.actual > 0 ? '+' : ''}{weightStats.overall.actual.toFixed(1)} {unit}
                            <span className="text-sm text-muted ml-2">
                                ({weightStats.overall.percent > 0 ? '+' : ''}{weightStats.overall.percent.toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-muted mb-1">Per Week</div>
                        <div className="text-lg font-bold">
                            {weightStats.perWeek.actual > 0 ? '+' : ''}{weightStats.perWeek.actual.toFixed(2)} {unit}
                            <span className="text-sm text-muted ml-2">
                                ({weightStats.perWeek.percent > 0 ? '+' : ''}{weightStats.perWeek.percent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, idx) => (
                        <div key={idx} className={`p-4 rounded-lg flex gap-3 border ${insight.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-100' :
                            insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' :
                                'bg-blue-500/10 border-blue-500/20 text-blue-100'
                            }`}>
                            <div className={`mt-0.5 ${insight.type === 'success' ? 'text-green-400' :
                                insight.type === 'warning' ? 'text-amber-400' :
                                    'text-blue-400'
                                }`}>
                                {insight.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                                <p className="text-xs opacity-80 leading-relaxed">{insight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="text-sm font-medium mb-4 text-muted">Weight History</h3>
                <div style={{ width: '100%', height: 320, minWidth: 0, overflow: 'hidden' }}>
                    <ResponsiveContainer width="99%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickMargin={10} />
                            <YAxis stroke="#9ca3af" domain={['auto', 'auto']} fontSize={11} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                            />
                            {hasDualSides ? (
                                <>
                                    <Legend verticalAlign="top" height={36} />
                                    <Line type="monotone" dataKey="weightLeft" stroke="#f87171" name="Side 1" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                                    <Line type="monotone" dataKey="weightRight" stroke="#60a5fa" name="Side 2" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                                    <Line type="monotone" dataKey="weightLeftTrend" stroke="#f87171" name="S1 Trend" strokeWidth={1} dot={false} strokeDasharray="5 5" connectNulls />
                                    <Line type="monotone" dataKey="weightRightTrend" stroke="#60a5fa" name="S2 Trend" strokeWidth={1} dot={false} strokeDasharray="5 5" connectNulls />
                                </>
                            ) : (
                                <>
                                    <Line type="monotone" dataKey="weight" stroke={color} strokeWidth={2} name="Weight" dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="weightTrend" stroke="#ef4444" strokeWidth={2} dot={false} name="Trend" strokeDasharray="5 5" />
                                </>
                            )}
                            <Brush
                                dataKey="date"
                                height={30}
                                stroke="#fbbf24"
                                fill="#1a1d23"
                                travellerWidth={10}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="text-sm font-medium mb-4 text-muted">Time History</h3>
                <div style={{ width: '100%', height: 320, minWidth: 0, overflow: 'hidden' }}>
                    <ResponsiveContainer width="99%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickMargin={10} />
                            <YAxis stroke="#9ca3af" domain={['auto', 'auto']} fontSize={11} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                            />
                            {hasDualSides ? (
                                <>
                                    <Legend verticalAlign="top" height={36} />
                                    <Line type="monotone" dataKey="timeLeft" stroke="#f87171" name="S1 Time" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                                    <Line type="monotone" dataKey="timeRight" stroke="#60a5fa" name="S2 Time" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                                    <Line type="monotone" dataKey="timeLeftTrend" stroke="#f87171" name="S1 Trend" strokeWidth={1} dot={false} strokeDasharray="5 5" connectNulls />
                                    <Line type="monotone" dataKey="timeRightTrend" stroke="#60a5fa" name="S2 Trend" strokeWidth={1} dot={false} strokeDasharray="5 5" connectNulls />
                                </>
                            ) : (
                                <>
                                    <Line type="monotone" dataKey="time" stroke="#60a5fa" strokeWidth={2} name="Time (s)" dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="timeTrend" stroke="#ef4444" strokeWidth={2} dot={false} name="Trend" strokeDasharray="5 5" />
                                </>
                            )}
                            <Brush
                                dataKey="date"
                                height={30}
                                stroke="#60a5fa"
                                fill="#1a1d23"
                                travellerWidth={10}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
