import { cookies } from "next/headers";
import { getQueryClient } from "@/providers/get-query-client";
import { playlistOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LibraryView from "@/modules/client/library/ui/views/library-view";
import UnauthenticatedMessage from "@/modules/client/library/ui/components/unauthenticated-message";

const LibraryPage = async () => {
  const queryClient = getQueryClient();

  const cookiess = await cookies();
  const authStorage = cookiess.get("auth-storage")?.value;
  const userId = authStorage ? JSON.parse(decodeURIComponent(authStorage)).state.user?.userId : null;
  const isAuthenticated = authStorage ? JSON.parse(decodeURIComponent(authStorage)).state.isAuthenticated : false;

  if (!isAuthenticated || !userId) {
    return (
      <div className="w-full px-6 pt-6">
        <h1 className="text-5xl font-bold">Library</h1>
        <UnauthenticatedMessage />
      </div>
    );
  }

  if (userId) {
    void queryClient.prefetchInfiniteQuery(playlistOptions(userId, undefined, 11));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
