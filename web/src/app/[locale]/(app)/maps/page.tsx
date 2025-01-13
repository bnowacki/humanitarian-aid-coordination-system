'use client'

import React, { useEffect, useRef } from 'react'

import { Button, Container, Heading, Stack } from '@chakra-ui/react'
import { Loader } from '@googlemaps/js-api-loader'

interface Location {
  center: google.maps.LatLngLiteral
  radius?: number
  organization?: string
  type: 'Volunteer' | 'Warehouse' | 'Event'
}

interface User {
  id: string
  role: UserRole
}

type UserRole = 'Volunteer' | 'AffectedIndividual' | 'Warehouse' | 'Government' | 'Donor'

const locations: Record<string, Location> = {
  event1: {
    center: { lat: 51.76638971003764, lng: 19.478829167271776 },
    radius: 1500,
    type: 'Event',
  },
  event2: {
    center: { lat: 51.753382329788614, lng: 19.54461812766617 },
    radius: 2000,
    type: 'Event',
  },
  event3: {
    center: { lat: 51.7552480159928, lng: 19.397408676381016 },
    radius: 3000,
    type: 'Event',
  },
  event4: {
    center: { lat: 51.81658971236922, lng: 19.445706961638024 },
    radius: 4500,
    type: 'Event',
  },

  wh1: {
    center: { lat: 51.79028325100043, lng: 19.32001446580938 },
    type: 'Warehouse',
  },
  wh2: {
    center: { lat: 51.72287675900376, lng: 19.650210217709425 },
    type: 'Warehouse',
  },

  vol1: {
    organization: 'Szlachetna Paczka',
    center: { lat: 51.752577, lng: 19.4529575 },
    type: 'Volunteer',
  },
  vol2: {
    organization: 'WOŚP',
    center: { lat: 51.66817491322284, lng: 19.493038451806317 },
    type: 'Volunteer',
  },
}

export default async function Index() {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const circleRef = useRef<google.maps.Circle[]>([])

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement, PinElement } = (await loader.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 51.752577, lng: 19.4529575 },
        zoom: 10,
        mapId: 'mapIdForNow',
      }

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

      // Helper function to clear the map
      function clearMap() {
        markersRef.current.forEach(marker => {
          marker.map = null // Remove marker from the map
        })
        markersRef.current = [] // Clear the array of markers
        circleRef.current.forEach(circle => {
          circle.setMap(null)
        })
      }

      function addEventForIndividual(map: google.maps.Map, userRole: UserRole) {
        // Check if the user is a Individual, only then enable the functionality
        if (userRole !== 'AffectedIndividual') return

        // Listener for clicks on the map
        google.maps.event.addListener(map, 'click', (event: google.maps.MapMouseEvent) => {
          const clickedLatLng = event.latLng

          const pinBackground = new PinElement({
            glyphColor: 'white',
            background: "#c92d18",
          })

          // Create a new marker for the event
          const newmarker = new AdvancedMarkerElement({
            position: clickedLatLng,
            map: map,
            content: pinBackground.element,
            title: 'New Event', // You can customize this title
          })

          markersRef.current.push(newmarker)

          // Create a new circle around the event
          const circle = new google.maps.Circle({
            strokeColor: '#c92d18',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#c92d18',
            fillOpacity: 0.05,
            map,
            center: clickedLatLng,
            radius: 2000, // You can adjust the radius value
          })

          circleRef.current.push(circle)

          // New event id
          const newEventId = `event${Object.keys(locations).length + 1}`;

          // Added to record of locations, so that it displays on other views
          locations[newEventId] = {
            center: { lat: clickedLatLng!.lat(), lng: clickedLatLng!.lng() },
            radius: circle.getRadius(),  // radius is taken from it
            type: 'Event',  // type is event
          };

          //info window added for the event -
          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>Event ${newEventId}</strong></div><div>Radius: ${circle.getRadius()}</div>`,
          })

          // when clicked, the infowindow should appear
          newmarker.addListener('click', () => {
            infoWindow.open(map, newmarker);
          });
        })
      }

      // Function to display map based on user role
      function displayMapForRole(userRole: UserRole, map: google.maps.Map) {
        clearMap()

        Object.entries(locations)
          .filter(([_, location]) => {
            if (userRole === 'Volunteer')
              return location.type === 'Volunteer' || location.type === 'Event'
            if (userRole === 'Warehouse') return location.type === 'Warehouse'
            if (userRole === 'AffectedIndividual') {
              addEventForIndividual(map, userRole)
              return location.type === 'Event'
            }
            if (userRole === 'Government') return true // Show all locations
            return false
          })
          .forEach(([key, location]) => {
            // Add markers for all filtered locations
            const pinBackground = new PinElement({
              background:
                location.type === 'Volunteer'
                  ? '#00e00f'
                  : location.type === 'Warehouse'
                    ? '#e0b000'
                    : '#c92d18',
              borderColor: location.type === 'Volunteer' ? '#008a09' : undefined,
              glyphColor: 'white',
            })

            const marker = new AdvancedMarkerElement({
              position: location.center,
              map,
              title: location.organization || key,
              gmpClickable: true,
              content: pinBackground.element,
            })

            markersRef.current.push(marker)

            const infoWindow = new google.maps.InfoWindow({
              content: `<div><strong>${location.organization || location.type + ' ' + key}</strong></div>${
                location.radius ? `<div>Radius: ${location.radius}m</div>` : ''
              }`,
            })

            marker.addListener('click', () => {
              infoWindow.open(map, marker)
            })

            // Add a circle for Event locations
            if (location.type === 'Event' && location.radius) {
              const circle = new google.maps.Circle({
                strokeColor: '#c92d18',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#c92d18',
                fillOpacity: 0.35,
                map,
                center: location.center,
                radius: location.radius,
              })
              circleRef.current.push(circle)
            }
          })
      }

      // Set up button event listeners
      document
        .getElementById('volunteerButton')
        ?.addEventListener('click', () => displayMapForRole('Volunteer', map))
      document
        .getElementById('warehouseButton')
        ?.addEventListener('click', () => displayMapForRole('Warehouse', map))
      document
        .getElementById('governmentButton')
        ?.addEventListener('click', () => displayMapForRole('Government', map))
      document
        .getElementById('affectedIndividual')
        ?.addEventListener('click', () => displayMapForRole('AffectedIndividual', map))
    }

    initMap()
  }, [])

  return (
    <Stack id="2" flex="grow" w="full" gap={10} textAlign="center">
      <Heading>MAPS</Heading>
      <Stack direction="row" marginLeft={6}>
        <Button id="governmentButton">Government View</Button>
        <Button id="volunteerButton">Volunteer View</Button>
        <Button id="warehouseButton">Warehouse View</Button>
        <Button id="affectedIndividual">Affected Individual View</Button>
      </Stack>
      <Container maxW={600}>
        <div style={{ height: '600px', width: '600px' }} ref={mapRef} />
      </Container>
    </Stack>
  )
}

function addEventForVolunteer(userRole: string) {
  throw new Error('Function not implemented.')
}
