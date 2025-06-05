import { Skeleton } from '#components/ui/skeleton';

export default function DiaryEntryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-64" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="mt-8 pt-6 border-t">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
