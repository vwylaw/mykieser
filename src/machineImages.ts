// Mapping of machine display names to their codes
const MACHINE_NAME_TO_CODE: Record<string, string> = {
    'lumbar extension': 'F3.1',
    'seated row': 'C7',
    'leg press': 'B6',
    'hip abduction': 'A3',
    'chest press': 'D6',
    'shoulder shrugs': 'G1',
    'abdominal flexion': 'F2.1',
    'shoulder external rotation': 'E5',
    'cervical extension': 'G5',
    'leg curl': 'B7',
    'leg extension': 'B1',
    'side bend': 'J9',
    'hip extension': 'A1',
    'pelvic floor': 'A5',
    'shoulder press': 'E3',
};

const MACHINE_CODE_TO_MUSCLE: Record<string, string> = {
    'F3.1': 'Back',
    'C7': 'Back',
    'B6': 'Legs',
    'A3': 'Hips & Glutes',
    'D6': 'Chest & Shoulders',
    'G1': 'Chest & Shoulders',
    'F2.1': 'Core',
    'E5': 'Chest & Shoulders',
    'G5': 'Neck',
    'B7': 'Legs',
    'B1': 'Legs',
    'J9': 'Core',
    'A1': 'Hips & Glutes',
    'A5': 'Core',
    'E3': 'Chest & Shoulders',
};

const MACHINE_CODE_TO_DESC: Record<string, string> = {
    'F3.1': 'Lower back strength & spinal stability',
    'C7': 'Middle back strength & posture',
    'B6': 'Overall leg power (quads, glutes, hamstrings)',
    'A3': 'Pelvic stability & outer hip toning',
    'D6': 'Chest & pushing power',
    'G1': 'Upper trap strength & neck relief',
    'F2.1': 'Core & abdominal isolation',
    'E5': 'Shoulder stability & rotator cuff health',
    'G5': 'Neck strength & postural support',
    'B7': 'Hamstring isolation & knee protection',
    'B1': 'Quad isolation & knee health',
    'J9': 'Obliques & lateral core stability',
    'A1': 'Glute & hip extension power',
    'A5': 'Pelvic floor & deep core support',
    'E3': 'Shoulder power & overhead strength',
};

export function getMachineCode(machineName: string): string | null {
    if (!machineName) return null;
    return MACHINE_NAME_TO_CODE[machineName.toLowerCase()] || null;
}

export function getMuscleGroup(machineCode: string): string | null {
    return MACHINE_CODE_TO_MUSCLE[machineCode] || null;
}

export function getMachineDescription(machineCode: string): string | null {
    return MACHINE_CODE_TO_DESC[machineCode] || null;
}

export function getMachineImage(machineName: string): string | null {
    if (!machineName) return null;

    const lowerName = machineName.toLowerCase();

    // First, try to find by exact code mapping
    const code = MACHINE_NAME_TO_CODE[lowerName];
    if (code) {
        // Convert code to filename (replace . with _)
        const filename = code.replace('.', '_');
        const baseUrl = import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL
            : `${import.meta.env.BASE_URL}/`;
        return `${baseUrl}machines/${filename}.jpg`;
    }

    return null;
}
