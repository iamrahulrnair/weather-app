'use client'

import React, { useContext, useEffect } from 'react'
import { Button, Icon, Table } from 'semantic-ui-react'
import { GeneralContext } from '~/context/generalContext'
import { LocationWithForcast } from '~/index'
import { api } from '~/trpc/react'


export function TableComponent({ locationsData }: {
    locationsData: LocationWithForcast[]
}) {
    const { setCurrentLocation, setLocations, locations } = useContext(GeneralContext)
    const locationMutation = api.removeUserGeoEntry.useMutation({
        onSuccess: (data) => {
            setLocations([...locations.filter((location) => location._id !== data._id)])
        }
    })

    useEffect(() => {
        setLocations(locationsData)
    }, [])

    return (
        <div >
            <Table celled className='min-h-[500px]'>
                {locations.length > 0 ? <>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Latitude</Table.HeaderCell>
                            <Table.HeaderCell>Longitude</Table.HeaderCell>
                            <Table.HeaderCell>Location</Table.HeaderCell>
                            <Table.HeaderCell>Created At</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            locations.map((location) => {
                                return <Table.Row key={location._id}>
                                    <Table.Cell>{location.latitude}</Table.Cell>
                                    <Table.Cell>{location.longitude}</Table.Cell>
                                    <Table.Cell>{location.location}</Table.Cell>
                                    <Table.Cell>{new Date(location.createdAt).toDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Button onClick={() => {
                                            setCurrentLocation(location)
                                        }}>
                                            Click to view
                                        </Button>
                                        <i onClick={() => {
                                            locationMutation.mutate({ id: location._id })
                                        }} className="trash alternate icon hover:text-red-500 large"></i>
                                    </Table.Cell>


                                </Table.Row>
                            })
                        }
                    </Table.Body>
                </> : (


                    <div className="ui placeholder segment h-[500px]">
                        <div className="ui icon header">
                            <i className="terminal  icon"></i>
                            No entries found
                        </div>
                    </div>
                )}
            </Table>
        </div>
    )
}
