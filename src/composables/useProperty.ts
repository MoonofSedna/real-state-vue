import { ref, computed } from "vue";
import { useFirestore, type _RefFirestore, useFirebaseStorage } from "vuefire";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  limit,
  orderBy,
  startAfter,
  QuerySnapshot,
  type DocumentData,
  getDoc,
  getCountFromServer,
  deleteDoc,
} from "@firebase/firestore";
import { ref as storageRef, deleteObject } from "@firebase/storage";
// interfaces
import type { PropertyInterface } from "@/interfaces/property.interface";

export default function useProperty() {
  const db = useFirestore();

  const limitNum = 3;
  const properties = ref<PropertyInterface[]>([]);
  const userProperties = ref<PropertyInterface[]>([]);
  const count = ref(0);
  const loading = ref(false);

  const spreadProperties = (data: QuerySnapshot<DocumentData>) => {
    const propertiesData = data.docs.map((doc: any) => {
      return { id: doc.id, ...doc.data() };
    });
    return propertiesData;
  };

  const searchCollection = async ({
    lastDoc,
    id,
    isFor,
  }: {
    lastDoc?: number;
    id?: string;
    isFor?: string;
  }) => {
    const order = "createdAt";
    const doc = lastDoc ? lastDoc : Date.now().toString();
    const initQuery = query(
      collection(db, "properties"),
      orderBy(order, "desc")
    );

    let querySnapshot = query(initQuery);

    if (id) {
      querySnapshot = query(initQuery, where("user", "==", id));
    } else if (isFor) {
      querySnapshot = query(initQuery, where("isFor", "==", isFor));
    }
    count.value = (await getCountFromServer(querySnapshot)).data().count;

    return await getDocs(
      query(querySnapshot, startAfter(doc), limit(limitNum))
    );
  };

  const getProperties = async ({
    lastDoc,
    isFor,
  }: {
    lastDoc?: number;
    isFor?: string;
  }) => {
    loading.value = true;
    const data = await searchCollection({
      lastDoc,
      isFor,
    });

    const propertiesData = spreadProperties(data);

    properties.value = propertiesData as PropertyInterface[];

    loading.value = false;
  };

  const getUserProperties = async (id: string, lastDoc?: number) => {
    const data = await searchCollection({
      id,
      lastDoc,
    });
    const propertiesData = spreadProperties(data);

    if (lastDoc) {
      userProperties.value = [
        ...userProperties.value,
        ...propertiesData,
      ] as PropertyInterface[];
    } else {
      userProperties.value = propertiesData as PropertyInterface[];
    }
  };

  const onPaginateProperties = async (lastDoc?: number, isFor?: string) => {
    const data = await searchCollection({
      lastDoc,
      isFor,
    });

    const propertiesData = spreadProperties(data);

    properties.value = [
      ...properties.value,
      ...propertiesData,
    ] as PropertyInterface[];
  };

  const getRef = (id: string) => doc(db, "properties", id);

  const getProperty = async (id: string) =>
    await getDoc(doc(collection(db, "properties"), id));

  const deleteProperty = async (id: string, imageUrl: string) => {
    const storage = useFirebaseStorage();
    const imageRef = storageRef(storage, imageUrl);
    const propertyRef = getRef(id);

    await Promise.all([deleteObject(imageRef), deleteDoc(propertyRef)]);
  };

  const showLoadMore = computed(() => {
    return (properties: number, loading: boolean) =>
      properties > 0 && properties < count.value && !loading;
  });

  return {
    userProperties,
    getProperty,
    getProperties,
    getUserProperties,
    deleteProperty,
    getRef,
    properties,
    limit: limitNum,
    showLoadMore,
    onPaginateProperties,
    loading,
  };
}
