
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';
import { MachineHistoryGraph } from '../components/MachineHistoryGraph';
import { ChevronLeft, Grid } from 'lucide-react';
import type { TrainingCardItem, TrainingCardSessionResult } from '../types';
import { getMachineImage, getMachineCode } from '../machineImages';

// Machine code mapping removed - using shared utility from machineImages.ts

export const MachineDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [machine, setMachine] = useState<TrainingCardItem | null>(null);
    const [allMachines, setAllMachines] = useState<TrainingCardItem[]>([]);
    const [allMachinesHistory, setAllMachinesHistory] = useState<Record<string, TrainingCardSessionResult[]>>({});
    const [history, setHistory] = useState<TrainingCardSessionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAllMachines, setShowAllMachines] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionsData = await apiClient.getSessions();
                const sessionRows = sessionsData.data.query.rows || [];
                const trainingCardId = sessionRows.find(s => s.trainingcard)?.trainingcard;

                let machines: TrainingCardItem[] = [];

                if (trainingCardId) {
                    const cardData = await apiClient.getTrainingCard(trainingCardId);
                    machines = cardData.data.extra.trainingcarditem || [];
                } else {
                    const cardData = await apiClient.getTrainingCard();
                    machines = cardData.data.extra.trainingcarditem || [];
                }

                setAllMachines(machines);

                const foundMachine = machines.find((m: TrainingCardItem) => m.kiesermachine === id);
                if (foundMachine) {
                    setMachine(foundMachine);
                } else {
                    setError('Machine not found');
                }

                const resultsResponse = await apiClient.getSessionResults(id);
                const results = resultsResponse.data.query.rows || [];

                const machineHistory = results
                    .sort((a: TrainingCardSessionResult, b: TrainingCardSessionResult) => (b.utcstart || 0) - (a.utcstart || 0));

                setHistory(machineHistory);
            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch machine details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Fetch all machines history when "show all" is enabled
    useEffect(() => {
        if (showAllMachines && allMachines.length > 0) {
            const fetchAllHistory = async () => {
                setHistoryLoading(true);
                const historyMap: Record<string, TrainingCardSessionResult[]> = {};

                try {
                    const results = await Promise.all(
                        allMachines.map(async m => {
                            try {
                                const response = await apiClient.getSessionResults(m.kiesermachine);
                                return { id: m.kiesermachine, data: response.data.query.rows || [] };
                            } catch (err) {
                                console.error(`Failed to fetch history for ${m.kiesermachine}`, err);
                                return { id: m.kiesermachine, data: [] };
                            }
                        })
                    );

                    results.forEach(res => {
                        historyMap[res.id] = res.data.sort((a, b) => (b.utcstart || 0) - (a.utcstart || 0));
                    });

                    setAllMachinesHistory(historyMap);
                } catch (err) {
                    console.error("Failed to fetch all history", err);
                } finally {
                    setHistoryLoading(false);
                }
            };

            fetchAllHistory();
        }
    }, [showAllMachines, allMachines]);

    if (loading) return <div className="container py-8 text-center text-muted">Loading details...</div>;
    if (error || !machine) {
        return (
            <div className="container py-8 text-center">
                <div className="text-red-500 mb-4">{error || 'Machine not found'}</div>
                <Link to="/" className="text-accent hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const machineImage = getMachineImage(machine.kiesermachine_display);
    const machineCode = getMachineCode(machine.kiesermachine_display);

    const renderMachineCard = (m: TrainingCardItem, hist: TrainingCardSessionResult[]) => {
        const mImage = getMachineImage(m.kiesermachine_display);
        const mCode = getMachineCode(m.kiesermachine_display);

        // Special handling for E5 - separate cards for each side ID found
        if (mCode === 'E5' || mCode === 'J9') {
            const uniqueSides = Array.from(new Set(hist.map(r => r.side).filter(Boolean))).sort();

            if (uniqueSides.length > 0) {
                return (
                    <div key={m.kiesermachine} className="flex flex-col gap-8 mb-8">
                        {uniqueSides.map((sideId, idx) => {
                            const sideHist = hist.filter(r => r.side === sideId);
                            const label = idx === 0 ? "Left" : "Right"; // Fallback labels

                            return (
                                <div key={`${m.kiesermachine}-${sideId}`} className="card">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-2">
                                                <span className="text-accent">{mCode} {label}</span>
                                                {' - '}
                                                {m.kiesermachine_display}
                                            </h2>
                                        </div>
                                        {mImage && (
                                            <div className="w-full md:w-1/4 max-w-150 bg-white rounded-lg p-1">
                                                <img
                                                    src={mImage}
                                                    alt={`${m.kiesermachine_display} ${label}`}
                                                    className="w-full h-auto object-contain rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <MachineHistoryGraph results={sideHist} />
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }

        return (
            <div key={m.kiesermachine} className="card mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">
                            {mCode && <span className="text-accent">{mCode}</span>}
                            {mCode && ' - '}
                            {m.kiesermachine_display}
                        </h2>
                    </div>
                    {mImage && (
                        <div className="w-full md:w-1/4 max-w-150 bg-white rounded-lg p-1">
                            <img
                                src={mImage}
                                alt={m.kiesermachine_display}
                                className="w-full h-auto object-contain rounded"
                            />
                        </div>
                    )}
                </div>
                <MachineHistoryGraph results={hist} />
            </div>
        );
    };

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-white">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                <button
                    onClick={() => setShowAllMachines(!showAllMachines)}
                    className={`button ${showAllMachines ? 'button-primary' : 'button-outline'} flex items-center gap-2`}
                >
                    <Grid className="w-4 h-4" />
                    {showAllMachines ? 'Show Single' : 'Show All Machines'}
                </button>
            </div>

            {/* Machine Navigation Icons */}
            {!showAllMachines && (
                <div className="mb-6 flex gap-2 flex-wrap">
                    {allMachines.map((m) => {
                        const mCode = getMachineCode(m.kiesermachine_display);
                        const isActive = m.kiesermachine === id;

                        return (
                            <button
                                key={m.kiesermachine}
                                onClick={() => navigate(`/machine/${m.kiesermachine}`)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-accent text-bg-primary'
                                    : 'bg-bg-tertiary text-muted hover:bg-bg-secondary hover:text-white'
                                    }`}
                                title={m.kiesermachine_display}
                            >
                                {mCode || m.kiesermachine_display}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Single Machine View */}
            {!showAllMachines && (
                <div className="flex flex-col gap-8">
                    {machineCode === 'E5' || machineCode === 'J9' ? (
                        (() => {
                            const uniqueSides = Array.from(new Set(history.map(r => r.side).filter(Boolean))).sort();
                            if (uniqueSides.length === 0) {
                                return (
                                    <div className="card">
                                        <div className="text-muted italic p-12 text-center">No side data found for this machine.</div>
                                    </div>
                                );
                            }
                            return uniqueSides.map((sideId, idx) => {
                                const sideHist = history.filter(r => r.side === sideId);
                                const label = idx === 0 ? "Left" : "Right";
                                return (
                                    <div key={sideId} className="card">
                                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                            <div className="flex-1">
                                                <h1 className="text-3xl font-bold mb-2">
                                                    <span className="text-accent">{machineCode} {label}</span>
                                                    {' - '}
                                                    {machine.kiesermachine_display}
                                                </h1>
                                            </div>
                                            {machineImage && (
                                                <div className="w-full md:w-1/4 max-w-150 bg-white rounded-lg p-1">
                                                    <img
                                                        src={machineImage}
                                                        alt={`${machine.kiesermachine_display} ${label}`}
                                                        className="w-full h-auto object-contain rounded"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <MachineHistoryGraph results={sideHist} />
                                    </div>
                                );
                            });
                        })()
                    ) : (
                        <div className="card">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">
                                        {machineCode && <span className="text-accent">{machineCode}</span>}
                                        {machineCode && ' - '}
                                        {machine.kiesermachine_display}
                                    </h1>
                                </div>
                                {machineImage && (
                                    <div className="w-full md:w-1/4 max-w-150 bg-white rounded-lg p-1">
                                        <img
                                            src={machineImage}
                                            alt={machine.kiesermachine_display}
                                            className="w-full h-auto object-contain rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            <MachineHistoryGraph results={history} />
                        </div>
                    )}
                </div>
            )}

            {/* All Machines View */}
            {showAllMachines && (
                <div>
                    {historyLoading ? (
                        <div className="text-center py-12 text-muted italic">Loading all machine history...</div>
                    ) : (
                        allMachines.map((m) => renderMachineCard(m, allMachinesHistory[m.kiesermachine] || []))
                    )}
                </div>
            )}
        </div>
    );
};
