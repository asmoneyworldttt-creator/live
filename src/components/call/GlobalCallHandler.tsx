import React, { useEffect } from 'react';
import { useCall } from '../../hooks';
import * as RootNavigation from '../../navigation/RootNavigation';

/**
 * Global component to handle incoming calls and navigate to the call screen
 * Should be rendered at the root of the app
 */
export const GlobalCallHandler: React.FC = () => {
    const { isIncoming, activeCall } = useCall();

    useEffect(() => {
        if (isIncoming && activeCall) {
            RootNavigation.navigate('VideoCall', {});
        }
    }, [isIncoming, activeCall]);

    return null;
};
