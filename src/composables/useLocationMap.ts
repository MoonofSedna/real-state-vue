import { ref } from "vue";
// interfaces
import type { LatLng } from "@/interfaces/form.interfaces";

export default function useLocationMap() {
  const zoom = ref(18);
  const center = ref([47.6062095, -122.3320708]);

  const pin = (e: LatLng) => {
    const marker = e.target.getLatLng();
    center.value = [marker.lat, marker.lng];
  };

  return { zoom, center, pin };
}
