
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { apiClient } from '../api';
import type { TrainingCardItem, TrainingCardSession, TrainingCardSessionResult } from '../types';
import { getMachineCode, getMachineImage, getMuscleGroup, getMachineDescription } from '../machineImages';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { useSettings } from '../SettingsContext';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Dashboard = () => {
    const { unit, convertWeight } = useSettings();
    const [machines, setMachines] = useState<TrainingCardItem[]>([]);
    const [sessions, setSessions] = useState<TrainingCardSession[]>([]);
    const [results, setResults] = useState<TrainingCardSessionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState<Value>(new Date());
    const [activityScale, setActivityScale] = useState<'week' | 'month'>('week');
    const [sessionsPage, setSessionsPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sessions first to find the training card ID
                const sessionsData = await apiClient.getSessions();

                const sessionRows = sessionsData.data.query.rows || [];
                // Sort sessions by date descending
                const sortedSessions = sessionRows.sort((a, b) => new Date(b.sessiondate).getTime() - new Date(a.sessiondate).getTime());
                setSessions(sortedSessions);

                // Try to find a training card ID from the first session that has one
                const trainingCardId = sessionRows.find(s => s.trainingcard)?.trainingcard;

                let cardData: any = { data: { extra: { trainingcarditem: [] } } };
                let resultsData: any = { data: { query: { rows: [] } } };

                if (trainingCardId) {
                    [cardData, resultsData] = await Promise.all([
                        apiClient.getTrainingCard(trainingCardId),
                        apiClient.getSessionResults(),
                    ]);
                } else {
                    [cardData, resultsData] = await Promise.all([
                        apiClient.getTrainingCard(),
                        apiClient.getSessionResults(),
                    ]);
                }

                setMachines(cardData.data.extra.trainingcarditem || []);
                setResults(resultsData.data.query.rows || []);

            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Compute last results for each machine
    const machineLastResult = machines.reduce<Record<string, TrainingCardSessionResult | undefined>>((acc, item) => {
        const machineResults = results.filter(r => r.kiesermachine === item.kiesermachine);
        const latest = machineResults.sort((a, b) => (b.utcstart || 0) - (a.utcstart || 0))[0];
        acc[item.kiesermachine] = latest;
        return acc;
    }, {});

    // Calendar tile content to show dots
    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const hasSession = sessions.some(s => s.sessiondate === dateStr);
            if (hasSession) {
                return <div className="session-indicator" aria-label="Session done" />;
            }
        }
        return null;
    };

    // Prepare data for Activity Graph
    const activityStats = useMemo(() => {
        const stats: Record<string, number> = {};

        sessions.forEach(s => {
            const d = new Date(s.sessiondate);
            if (activityScale === 'month') {
                const month = s.sessiondate.substring(0, 7); // YYYY-MM
                stats[month] = (stats[month] || 0) + 1;
            } else {
                // Group by Week (Monday as start)
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(d.setDate(diff));
                const weekKey = monday.toISOString().split('T')[0];
                stats[weekKey] = (stats[weekKey] || 0) + 1;
            }
        });

        return Object.entries(stats)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, count]) => {
                let label = key;
                if (activityScale === 'month') {
                    label = new Date(`${key}-01`).toLocaleString('default', { month: 'short', year: '2-digit' });
                } else {
                    label = new Date(key).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
                }
                return { key, count, label };
            });
    }, [sessions, activityScale]);

    const trainingInsights = useMemo(() => {
        const muscleLastTrained: Record<string, number> = {};

        // Initialize all muscle groups from the machines we have
        machines.forEach(m => {
            const mCode = getMachineCode(m.kiesermachine_display);
            if (!mCode) return;
            const muscle = getMuscleGroup(mCode);
            if (!muscle) return;
            if (!muscleLastTrained[muscle]) muscleLastTrained[muscle] = 0;

            const lastSession = machineLastResult[m.kiesermachine];
            const timestamp = lastSession?.utcstart || 0;
            if (timestamp > muscleLastTrained[muscle]) {
                muscleLastTrained[muscle] = timestamp;
            }
        });

        const now = Date.now() / 1000;
        const threshold = 10 * 24 * 60 * 60; // 10 days

        return Object.entries(muscleLastTrained)
            .filter(([_, last]) => last < now - threshold)
            .map(([muscle, last]) => ({
                muscle,
                daysSince: last === 0 ? null : Math.floor((now - last) / (24 * 60 * 60))
            }))
            .sort((a, b) => (b.daysSince ?? 999) - (a.daysSince ?? 999));
    }, [machines, machineLastResult]);

    // Group sessions by week for pagination
    const sessionsByWeek = useMemo(() => {
        const groups: Record<string, TrainingCardSession[]> = {};

        sessions.forEach(s => {
            const d = new Date(s.sessiondate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
            const monday = new Date(d.setDate(diff));
            const weekKey = monday.toISOString().split('T')[0];

            if (!groups[weekKey]) groups[weekKey] = [];
            groups[weekKey].push(s);
        });

        return Object.entries(groups)
            .sort((a, b) => b[0].localeCompare(a[0])) // Most recent week first
            .map(([monday, items]) => {
                const start = new Date(monday);
                const end = new Date(start);
                end.setDate(end.getDate() + 6);
                return {
                    monday,
                    label: `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
                    sessions: items
                };
            });
    }, [sessions]);

    const currentWeek = sessionsByWeek[sessionsPage - 1];

    if (loading) return <div className="p-8 text-center text-muted">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-lg w-full">
                {/* Left Column: Calendar & Machines */}
                <div className="flex flex-col gap-lg min-w-0">
                    {/* Calendar Section */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Training Calendar</h2>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            tileContent={getTileContent}
                            className="w-full"
                        />
                    </div>

                    {/* Muscle Training Insights */}
                    {trainingInsights.length > 0 && (
                        <div className="card border-amber-500/30 bg-amber-500/5">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                                <AlertCircle className="w-5 h-5" />
                                Attention Needed
                            </h2>
                            <div className="flex flex-col gap-3">
                                {trainingInsights.map(insight => (
                                    <div key={insight.muscle} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                                        <span className="font-medium">{insight.muscle}</span>
                                        <span className="text-xs badge bg-amber-500/20 text-amber-200">
                                            {insight.daysSince === null ? 'Never trained' : `${insight.daysSince} days ago`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted mt-4 italic">
                                Consistency across all muscle groups is key to Kieser training success.
                            </p>
                        </div>
                    )}

                    {/* Activity Graph Section */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Training Activity</h2>
                            <div className="flex bg-bg-tertiary rounded p-0.5 border border-border">
                                <button
                                    onClick={() => setActivityScale('week')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${activityScale === 'week' ? 'bg-accent text-bg-primary shadow-sm' : 'text-muted hover:text-text-primary'}`}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setActivityScale('month')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${activityScale === 'month' ? 'bg-accent text-bg-primary shadow-sm' : 'text-muted hover:text-text-primary'}`}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer width="99%" height="100%">
                                <BarChart data={activityStats} margin={{ bottom: 20 }}>
                                    <XAxis dataKey="label" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} interval={activityScale === 'week' ? 1 : 0} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fbbf24' }}
                                    />
                                    <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Sessions" />
                                    <Brush
                                        dataKey="key"
                                        height={30}
                                        stroke="#fbbf24"
                                        fill="#1a1d23"
                                        travellerWidth={10}
                                        startIndex={Math.max(0, activityStats.length - 12)}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Machines List */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Machines</h2>
                        {machines.length === 0 ? (
                            <p className="text-muted">No machines found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                {machines.map(item => {
                                    const lastResult = machineLastResult[item.kiesermachine];
                                    const mCode = getMachineCode(item.kiesermachine_display);
                                    const mImage = getMachineImage(item.kiesermachine_display);
                                    const mDesc = mCode ? getMachineDescription(mCode) : null;

                                    return (
                                        <Link to={`/machine/${item.kiesermachine}`} key={item.id} className="card block hover:border-accent p-3 transition-all group">
                                            <h3 className="font-bold text-sm mb-1 truncate flex items-center">
                                                {mCode && <span className="text-accent whitespace-nowrap">{mCode}</span>}
                                                {mCode && <span className="mx-2 text-muted">-</span>}
                                                <span className="truncate">{item.kiesermachine_display}</span>
                                            </h3>
                                            {mDesc && <p className="text-[10px] text-muted mb-3 italic opacity-70 leading-tight">{mDesc}</p>}
                                            <div className="flex flex-col gap-3">
                                                <div className="text-[11px] text-muted">
                                                    {lastResult ? (
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="opacity-80 whitespace-nowrap">Last: {new Date((lastResult.utcstart || 0) * 1000).toLocaleDateString()}</p>
                                                            <div className="flex gap-1.5 shrink-0">
                                                                <span className="badge text-[9px] px-1.5 py-0 bg-bg-tertiary border border-border/50">{convertWeight(parseFloat(lastResult.weight || "0")).toFixed(1)} {unit}</span>
                                                                <span className="badge text-[9px] px-1.5 py-0 bg-bg-tertiary border border-border/50">{lastResult.timeinterval} s</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="italic opacity-60">No recent data</p>
                                                    )}
                                                </div>
                                                {mImage && (
                                                    <div className="w-full h-24 rounded bg-bg-tertiary overflow-hidden border border-border group-hover:border-accent transition-colors">
                                                        <img
                                                            src={mImage}
                                                            alt={item.kiesermachine_display}
                                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sessions List */}
                <div className="flex flex-col h-[calc(100vh-100px)] sticky top-4 min-w-0">
                    <h2 className="text-2xl font-bold mb-4">All Sessions ({sessions.length})</h2>
                    {sessions.length === 0 ? (
                        <p className="text-muted">No sessions found.</p>
                    ) : (
                        <>
                            <div className="flex flex-col gap-md overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '100%' }}>
                                <div className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">{currentWeek?.label}</div>
                                {currentWeek?.sessions.map(session => (
                                    <div key={session.id} className="card shrink-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold">{new Date(session.sessiondate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                                            <span className={`badge ${session.recordstate_name === 'Complete' ? 'active' : ''}`}>
                                                {session.recordstate_name}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted grid grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <span className="text-text-secondary opacity-70">Start:</span> {session.sessiontimestart}
                                            </div>
                                            <div>
                                                <span className="text-text-secondary opacity-70">End:</span> {session.sessiontimeend}
                                            </div>
                                            <div>
                                                <span className="text-text-secondary opacity-70">RPE:</span> {session.rpe}
                                            </div>
                                            <div>
                                                <span className="text-text-secondary opacity-70">Duration:</span> {session.sessiontimeend && session.sessiontimestart
                                                    ? Math.round((new Date(`1970-01-01T${session.sessiontimeend}`).getTime() - new Date(`1970-01-01T${session.sessiontimestart}`).getTime()) / 60000) + ' min'
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!currentWeek || currentWeek.sessions.length === 0) && (
                                    <p className="text-muted italic py-8 text-center">No sessions this week.</p>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between p-4 bg-bg-secondary border-t border-border mt-auto rounded-b-lg">
                                <button
                                    onClick={() => setSessionsPage(p => Math.max(1, p - 1))}
                                    disabled={sessionsPage === 1}
                                    className="button-outline text-xs px-3 py-1 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-xs text-muted">Week {sessionsPage} of {sessionsByWeek.length}</span>
                                <button
                                    onClick={() => setSessionsPage(p => Math.min(sessionsByWeek.length, p + 1))}
                                    disabled={sessionsPage >= sessionsByWeek.length}
                                    className="button-outline text-xs px-3 py-1 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
