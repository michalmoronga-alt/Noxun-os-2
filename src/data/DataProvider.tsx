
import { createContext, useContext, type ReactNode } from 'react';
import type { Repository } from './repo';
import { MemoryRepository } from './memoryRepo';

const RepositoryContext = createContext<Repository | null>(null);

const repo = new MemoryRepository();

export function DataProvider({ children }: { children: ReactNode }) {
    return (
        <RepositoryContext.Provider value={repo}>
            {children}
        </RepositoryContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRepository() {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error('useRepository must be used within a DataProvider');
    }
    return context;
}
