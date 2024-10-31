import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Store {
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  open: string;
}

const customIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const StoreMarkers: React.FC<{
  stores: Store[];
  highlightedStore: Store | null;
  setHighlightedStore: (store: Store) => void;
}> = ({ stores, highlightedStore, setHighlightedStore }) => {
  return (
    <>
      {stores.map((store, index) => (
        <Marker
          key={index}
          position={[store.lat, store.lng]}
          icon={customIcon}
          eventHandlers={{ click: () => setHighlightedStore(store) }}
        >
          <Popup>
            <strong>{store.name}</strong><br />
            {store.address}<br />
            {store.phone}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default StoreMarkers;