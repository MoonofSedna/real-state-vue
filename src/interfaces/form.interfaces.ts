interface LatLng {
  target: {
    getLatLng: () => {
      lat: number;
      lng: number;
    };
  };
}

interface FormInterface {
  title?: string;
  description?: string;
  price?: string;
  image?: File[];
  bathroom?: string;
  bedroom?: string;
  parking?: string;
  pool?: boolean;
  isFor: string;
  loading?: boolean;
  center?: number[];
  imageUrl?: string | null;
  zoom?: number;
  rooms?: number[];
  titleError?: string;
  descriptionError?: string;
  priceError?: string;
  imageError?: string;
  bathroomError?: string;
  bedroomError?: string;
  parkingError?: string;
  poolError?: string;
  isForError?: string;
}

export type { LatLng, FormInterface };
