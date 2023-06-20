interface PropertyInterface {
  id: string;
  title: string;
  price: string;
  bedroom: number;
  bathroom: number;
  parking: number;
  pool: boolean;
  description: string;
  image: FileList;
  imageUrl: string;
  isFor: string;
  city: string;
  createdAt: number;
  location: number[];
}

export type { PropertyInterface };
