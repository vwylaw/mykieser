import React, { createContext, useContext, useState } from 'react';

type Unit = 'lb' | 'kg';

interface SettingsContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    toggleUnit: () => void;
    convertWeight: (weight: number) => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unit, setUnitState] = useState<Unit>(() => {
        const saved = localStorage.getItem('kieser_unit');
        return (saved as Unit) || 'lb';
    });

    const setUnit = (newUnit: Unit) => {
        setUnitState(newUnit);
        localStorage.setItem('kieser_unit', newUnit);
    };

    const toggleUnit = () => {
        const newUnit = unit === 'lb' ? 'kg' : 'lb';
        setUnit(newUnit);
    };

    const convertWeight = (weight: number) => {
        if (unit === 'lb') return weight;
        return weight * 0.453592; // Assuming API data is in lbs
    };

    return (
        <SettingsContext.Provider value={{ unit, setUnit, toggleUnit, convertWeight }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
