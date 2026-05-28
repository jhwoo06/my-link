import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { LinkItem } from '@/data/links';

export function useLinks(uid: string | undefined) {
  const queryClient = useQueryClient();

  const linksQuery = useQuery({
    queryKey: ['links', uid],
    queryFn: async (): Promise<LinkItem[]> => {
      if (!uid) throw new Error("No UID");
      const q = query(
        collection(db, "users", uid, "links"), 
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const linksData: LinkItem[] = [];
      querySnapshot.forEach((docSnap) => {
        linksData.push({ id: docSnap.id, ...docSnap.data() } as LinkItem);
      });
      return linksData;
    },
    enabled: !!uid,
  });

  const addLinkMutation = useMutation({
    mutationFn: async (data: { title: string, url: string }) => {
      if (!uid) throw new Error("No UID");
      const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
      const domain = urlObj.hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      const docRef = await addDoc(collection(db, "users", uid, "links"), {
        title: data.title,
        url: urlObj.toString(),
        icon: faviconUrl,
        createdAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        title: data.title,
        url: urlObj.toString(),
        icon: faviconUrl,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] });
    }
  });

  const updateLinkMutation = useMutation({
    mutationFn: async (data: { linkId: string, title: string, url: string }) => {
      if (!uid) throw new Error("No UID");
      const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
      const domain = urlObj.hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      await updateDoc(doc(db, "users", uid, "links", data.linkId), {
        title: data.title,
        url: urlObj.toString(),
        icon: faviconUrl,
        updatedAt: serverTimestamp(),
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] });
    }
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      if (!uid) throw new Error("No UID");
      await deleteDoc(doc(db, "users", uid, "links", linkId));
      return linkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] });
    }
  });

  return {
    links: linksQuery.data || [],
    isLoading: linksQuery.isLoading,
    isError: linksQuery.isError,
    addLink: addLinkMutation.mutateAsync,
    isAdding: addLinkMutation.isPending,
    updateLink: updateLinkMutation.mutateAsync,
    isUpdating: updateLinkMutation.isPending,
    deleteLink: deleteLinkMutation.mutateAsync,
    isDeleting: deleteLinkMutation.isPending,
  };
}
