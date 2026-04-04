import { useEffect, useState, useCallback } from 'react';

export const useAntiCheat = (onCheatDetected) => {
    const [cheatCounts, setCheatCounts] = useState(0);

    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            setCheatCounts(prev => prev + 1);
            onCheatDetected('Tab Switch/Window Minimized');
        }
    }, [onCheatDetected]);

    const handleBlur = useCallback(() => {
        setCheatCounts(prev => prev + 1);
        onCheatDetected('Focus Lost');
    }, [onCheatDetected]);

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        // Prevent Right Click
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Prevent Copy/Paste
        const handleCopy = (e) => e.preventDefault();
        const handlePaste = (e) => e.preventDefault();
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
        };
    }, [handleVisibilityChange, handleBlur]);

    return { cheatCounts };
};
