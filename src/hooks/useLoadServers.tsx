import useServerStore from "../store/server-store";
import { db } from "../core/config";
import { Channel, Member, Server } from "../types/type";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import useProfileStore from "../store/profileStore";
import { FirebaseError } from "firebase/app";
import useListServersStore from "../store/create-list-server-store";

export const useServers = () => {
  const {
    servers: listServers,
    setServers: setListServers,
    setSelectedServer,
  } = useListServersStore();
  const { selectServer, selectedServer } = useServerStore();
  const [loading, setLoading] = useState(true);
  const { profile } = useProfileStore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "servers")),
      async (querySnapshot) => {
        setLoading(true);
        const updatedServers: any[] | ((prevState: never[]) => never[]) = [];
        // querySnapshot.forEach((serverDoc: DocumentSnapshot) => {
        //   const memberCollectionRef = collection(serverDoc.ref, "members");
        //   const memberQuery = query(
        //     memberCollectionRef,
        //     where("profileId", "==", profile?.userId)
        //   );
        //   getDocs(memberQuery)
        //     .then((memberQuerySnapshot) => {
        //       if (!memberQuerySnapshot.empty) {
        //         updatedServers.push(serverDoc.data());
        //       }
        //     })
        //     .catch((error: FirebaseError) => {
        //       console.error("Error querying member collection:", error);
        //     });
        // });
        // if (updatedServers.length > 0 && !selectedServer) {
        //   selectServer(updatedServers[0].id);
        //   setSelectedServer(updatedServers[0]);
        // }
        // setServers(updatedServers);
        for (const serverDoc of querySnapshot.docs) {
          const memberCollectionRef = collection(serverDoc.ref, "members");
          const memberQuery = query(
            memberCollectionRef,
            where("profileId", "==", profile?.userId)
          );
          try {
            const memberQuerySnapshot = await getDocs(memberQuery);
            if (!memberQuerySnapshot.empty) {
              updatedServers.push(serverDoc.data());
            }
          } catch (error) {
            console.error("Error querying member collection:", error);
          }
        }
        if (updatedServers.length > 0 && !selectedServer) {
          selectServer(updatedServers[0].id);
          setSelectedServer(updatedServers[0]);
        }
        setListServers(updatedServers);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { servers: listServers, loading, setLoading };
};

export const useLoadServerById = () => {
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedServer } = useServerStore();

  useEffect(() => {
    const serverId: string = selectedServer || "";
    if (!serverId) {
      setServer(null);
      return;
    }
    const serverRef = doc(db, "servers", serverId);
    const unsubscribe = onSnapshot(serverRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const serverData = docSnapshot.data() as Server;

        // Lấy dữ liệu từ collection nhỏ 1
        const channelRef = collection(serverRef, "channels");
        const channelSnapshot = await getDocs(channelRef);
        const channelData = channelSnapshot.docs.map((doc) =>
          doc.data()
        ) as Channel[];

        // Lấy dữ liệu từ collection nhỏ 2
        const memberRef = collection(serverRef, "members");
        const memberSnapshot = await getDocs(memberRef);
        const memberData = memberSnapshot.docs.map((doc) =>
          doc.data()
        ) as Member[];

        const updatedServer = {
          ...serverData,
          members: memberData,
          channels: channelData,
        };
        setServer(updatedServer);
      } else {
        setServer(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedServer]);

  return { server, loading, setLoading };
};

export const useDeleteServerById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteServerById = async (serverId: string) => {
    if (!serverId) return;
    setLoading(true);
    setError(null);
    try {
      const serverRef = doc(db, "servers", serverId);
      await deleteDoc(serverRef);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { loading, error, deleteServerById };
};
