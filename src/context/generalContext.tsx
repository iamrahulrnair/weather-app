'use client';

import { Location } from '@prisma/client';
import React, { useState, createContext } from 'react';
import { LocationWithForcast } from '..';
export const GeneralContext = createContext<{
    locations: LocationWithForcast[] | [],
    setLocations: React.Dispatch<React.SetStateAction<LocationWithForcast[] | []>>,
    currentLocation: LocationWithForcast | undefined,
    setCurrentLocation: React.Dispatch<React.SetStateAction<LocationWithForcast | undefined>>
}>({
    locations: [],
    setLocations: () => { },
    currentLocation: undefined,
    setCurrentLocation: () => { }
})

export const GeneralContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [locations, setLocations] = useState<LocationWithForcast[] | []>([]);
    const [currentLocation, setCurrentLocation] = useState<LocationWithForcast | undefined>(undefined);
    const state = {
        locations, setLocations,currentLocation,setCurrentLocation
    };

    return (
        <GeneralContext.Provider value={{ ...state }}>
            {children}
        </GeneralContext.Provider>
    );
};