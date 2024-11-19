export interface Restaurant {
    id: string;
    name: string;
    genre: {
        name: string;
    };
    address: string;
    image_url: string;
    lat: number;
    lng: number;
    photo?: {
        mobile?: {
          l: string;
          s: string;
        };
    };
    open: string;
}