import { Suspense } from 'react';
import { generateInitialDataset } from '@/lib/dataGenerator';
import { DataProvider } from '@/components/providers/DataProvider';
import DashboardClient from './DashboardClient';

// Server Component - fetches initial data
export default async function DashboardPage() {
  // Generate initial dataset on the server
  const initialData = generateInitialDataset(1000);

  return (
    <DataProvider initialData={initialData}>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardClient />
      </Suspense>
    </DataProvider>
  );
}

function DashboardLoading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
      }}
    >
      Loading dashboard...
    </div>
  );
}

