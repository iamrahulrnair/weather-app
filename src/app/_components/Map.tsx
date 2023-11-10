'use client'
import { Circle, LayerGroup, LayersControl, MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import React, { useContext, useEffect } from 'react'
import { GeneralContext } from '~/context/generalContext'
import { api } from '~/trpc/react';
import { Header } from 'semantic-ui-react';


function ControlledComponent() {
    const { currentLocation } = useContext(GeneralContext)
    const map = useMap()

    useEffect(() => {
        if (currentLocation?.latitude && currentLocation?.longitude) {
            map.flyTo([parseFloat(currentLocation?.latitude!), parseFloat(currentLocation?.longitude!)])
        }
    }, [currentLocation?.latitude, currentLocation?.longitude])
    return null
}

export function Map() {
    const { currentLocation } = useContext(GeneralContext)
    const appConfig = api.getAppConfig.useQuery()
    const circleRef = React.useRef(null)
    const [temperature, setTemparature] = React.useState<{
        temperature_min: number | undefined,
        temperature_max: number | undefined,
        weather_code: number | undefined,
        date: string | undefined
    } | undefined>(undefined)
    if (!currentLocation) return "Try adding, or selecting a location from the table."
    const center = [parseFloat(currentLocation?.latitude!), parseFloat(currentLocation?.longitude!)] as [number, number]

    return (
        <div className='min-h-[500px] flex flex-col space-y-5'>
            <MapContainer className='h-[500px] w-full' center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    temperature && <Circle
                        ref={circleRef}
                        center={center}
                        pathOptions={{
                            fillColor:
                                temperature.temperature_max! > appConfig.data?.maximum_threshold! ?
                                    'red' : temperature.temperature_max! < appConfig.data?.minimum_threshold! ? "blue" : 'green'
                        }}
                        radius={2000}
                    >
                        <Popup>
                            {
                                <div>
                                    <Header>{currentLocation.location}</Header>
                                    <p>Temperature: {temperature.temperature_max}</p>

                                </div>
                            }
                        </Popup>
                    </Circle>
                }
                <ControlledComponent />
            </MapContainer>
            <div className='flex space-x-5'>
                <div className='w-[50%]'>

                    {currentLocation.forcast?.daily?.time.map((_: any, index: number) => {
                        const temperature_min = currentLocation.forcast?.daily?.temperature_2m_min[index] as number
                        const temperature_max = currentLocation.forcast?.daily?.temperature_2m_max[index] as number
                        const weather_code = currentLocation.forcast?.daily?.weather_code[index]
                        const date = currentLocation.forcast?.daily?.time[index]

                        return (
                            <>
                                <button onClick={() => {
                                    setTemparature({
                                        temperature_min,
                                        temperature_max,
                                        weather_code,
                                        date
                                    })
                                    if (circleRef.current) {
                                        // @ts-ignore
                                        circleRef.current.setStyle({
                                            fillColor:
                                                temperature_max > appConfig.data?.maximum_threshold! ?
                                                    'red' : temperature_max < appConfig.data?.minimum_threshold! ? "blue" : 'green'
                                        })
                                        console.log({ circleRef });
                                    }

                                }}>{date}</button>
                            </>
                        )
                    })}
                </div>
                <div className='flex justify-center self-start items-center'>
                    <div>
                        temperature threshold:
                    </div>
                    <div>
                        <div>
                            <span className='h-[15px] w-[15px] mx-2 bg-red-300 inline-block'></span>&gt;{appConfig.data?.maximum_threshold}
                        </div>
                        <div>
                            <span className='mx-2 h-[15px] w-[15px] bg-blue-300 inline-block'></span>&lt;{appConfig.data?.minimum_threshold}
                        </div>
                        <div>
                            <span className='mx-2 h-[15px] w-[15px] bg-green-300 inline-block'></span><span>Normal</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

