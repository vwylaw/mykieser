export interface TrainingCardItem {
    id: string;
    kiesermachine: string;
    kiesermachine_display: string;
    weight: number | null;
    seat: number | null;
    pad: number | null;
    rom: string | null;
    trainingmode_display: string | null;
    kiesermachinenotes: string | null;
    // Add other fields as needed
}

export interface TrainingCardSession {
    id: string;
    sessiondate: string;
    sessiontimestart: string;
    sessiontimeend: string;
    rpe: number | null;
    iskieserled: boolean;
    recordstate_name: string;
    timestamp_updated?: string;
    trainingcard?: string;
}

export interface TrainingCardSessionResult {
    id: string;
    kiesermachine: string;
    weight: string | null;
    timeinterval: number | null;
    trainingcardsession: string; // ID of the session
    trainingcardsession_sessiondate: string;
    side?: string;
    utcstart?: number;
}

export interface AuthResponse {
    status: string;
    code: number;
    data: {
        token: string;
        refreshtoken: string;
        identity: {
            key: string;
            user: {
                id: string;
                username: string;
            };
            record: {
                id: string;
                firstname: string;
                lastname: string;
                name: string;
            };
        };
    };
}

export interface User {
    id: string;
    username: string;
    name: string;
}
