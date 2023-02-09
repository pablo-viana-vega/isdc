import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map({ mapsKey, latitude, longitude, controls = true }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: mapsKey,
  });

  const [map, setMap] = React.useState(null);

  const center = {
    lat: typeof latitude === "string" ? parseFloat(latitude) : latitude,
    lng: typeof longitude === "string" ? parseFloat(longitude) : longitude,
  };

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    [center]
  );

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={{
        disableDefaultUI: !controls,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <></>
  );
}
