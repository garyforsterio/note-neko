import { Skeleton } from '#components/ui/skeleton';
import PageHeader from './components/PageHeader';

export default function PeopleLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-4 w-56 mb-2" />

            <div className="mb-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex flex-wrap gap-2 mt-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded" />
                ))}
              </div>
            </div>

            <Skeleton className="h-4 w-64 mb-2" />
            <Skeleton className="h-4 w-40 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
