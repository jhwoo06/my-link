import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
}

export function useProfile(uid: string | undefined, email: string | null | undefined, initialDisplayName: string | null | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile', uid],
    queryFn: async (): Promise<UserProfile> => {
      if (!uid) throw new Error("No UID");
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const fallbackName = email ? email.split('@')[0] : (initialDisplayName || "이름 없음");
        return {
          displayName: data.displayName || data.username || fallbackName,
          username: data.username || fallbackName,
          bio: data.bio || "한 줄 소개를 입력해주세요.",
        };
      } else {
        const fallbackName = email ? email.split('@')[0] : (initialDisplayName || "이름 없음");
        const defaultProfile = {
          displayName: fallbackName,
          username: fallbackName,
          bio: "한 줄 소개를 입력해주세요.",
        };
        await setDoc(docRef, defaultProfile);
        return defaultProfile;
      }
    },
    enabled: !!uid,
  });

  const mutation = useMutation({
    mutationFn: async (newProfile: UserProfile) => {
      if (!uid) throw new Error("No UID");
      await updateDoc(doc(db, "users", uid), {
        displayName: newProfile.displayName,
        username: newProfile.username,
        bio: newProfile.bio
      });
      return newProfile;
    },
    onMutate: async (newProfile) => {
      // 진행 중인 refetches 취소하여 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey: ['profile', uid] });

      // 이전 값의 스냅샷 저장
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile', uid]);

      // 새로운 값으로 즉시 UI 업데이트 (낙관적 업데이트)
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['profile', uid], {
          ...previousProfile,
          ...newProfile,
        });
      } else {
        queryClient.setQueryData<UserProfile>(['profile', uid], newProfile);
      }

      // 에러 발생 시 롤백에 사용할 컨텍스트 반환
      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      // 에러 시 스냅샷으로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', uid], context.previousProfile);
      }
    },
    onSettled: () => {
      // 성공이든 에러든 쿼리 무효화하여 최신 상태 동기화
      queryClient.invalidateQueries({ queryKey: ['profile', uid] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending
  };
}
