'use client'
import { createPortal } from 'react-dom';

import { useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import { GeneralContext } from "~/context/generalContext";
import { api } from "~/trpc/react";

export default function Input({ serverData }: any) {
    const [locationData, setLocationData] = useState({
        lat: '',
        lng: '',
        location: ''
    })
    const [showError, setShowError] = useState(false)
    const { setLocations, locations } = useContext(GeneralContext)
    const locationMutation = api.addUserGeoLocation.useMutation({
        onSuccess: (data) => {
            console.log({ data });
            
            setLocations([data, ...locations.filter((location) => location._id !== data._id)])
        },
        onSettled: (data, error, variables, context) => {
            setLocationData({
                lat: '',
                lng: '',
                location: ''
            })
        },
    })

    return (
        <div className="flex space-x-5 border-solid border-2 items-center justify-center border-green-300 p-4">
            <div className="flex flex-col justify-center items-center space-y-5 w-[500px]">
                <div className="flex space-x-10 items-center  w-[500px] justify-between">
                    <label htmlFor="lat">Latitude</label>
                    <input value={locationData.lat} onChange={(e) => {
                        setLocationData({
                            ...locationData,
                            lat: e.target.value
                        })
                    }} className="" type="text" name="lat" id="lat" />
                </div>
                <div className="flex space-x-10 items-center  w-[500px] justify-between">
                    <label htmlFor="lng">Longitude</label>
                    <input value={locationData.lng} onChange={(e) => {
                        setLocationData({
                            ...locationData,
                            lng: e.target.value
                        })
                    }} type="text" name="lng" id="lon" />
                </div>
                <div className="flex space-x-10 items-center w-[500px] justify-between">
                    <label htmlFor="lat">Location</label>
                    <input value={locationData.location} onChange={(e) => {
                        setLocationData({
                            ...locationData,
                            location: e.target.value
                        })
                    }} className="" type="text" name="lat" id="lat" />
                </div>
                <div>
                    <Button loading={locationMutation.isLoading} primary onClick={async () => {
                        if (!locationData.lat || !locationData.lng || !locationData.location) {
                            setShowError(true)
                            return 
                        }
                        locationMutation.mutate(locationData)
                    }} className="">Submit</Button>
                </div>
            </div>
            <div>
                OR
            </div>
            <div>
                <Button onClick={(e: any) => {
                    function handlePermissionSuccess(pos: GeolocationPosition) {
                        setLocationData({
                            ...locationData,
                            lat: pos.coords.latitude.toString(),
                            lng: pos.coords.longitude.toString()

                        })
                    }
                    function handlePermissionError() {
                        e.target.innerText = 'Location permission denied'
                        e.target.disabled = true
                    }
                    if (navigator.geolocation) {
                        navigator.permissions
                            .query({ name: "geolocation" })
                            .then((result) => {
                                if (result.state === "granted" || result.state === "prompt") {
                                    navigator.geolocation.getCurrentPosition(
                                        handlePermissionSuccess,
                                        handlePermissionError,
                                        {
                                            enableHighAccuracy: true,
                                            timeout: 5000,
                                            maximumAge: 0,
                                        },
                                    );
                                } else if (result.state === "denied") {
                                    handlePermissionError();
                                }
                            });
                    } else {
                    }
                }} primary>Use current location</Button>
            </div>
            {showError && createPortal(
                <div className="ui negative message">
                <i onClick={()=>setShowError(false)} className="close icon"></i>
                <div className="header">
                  Error!
                </div>
                <p>Please fill all the input fields.</p>
              </div>,
                document.querySelector('#global-alert')!)
            }
        </div>
    );
}
