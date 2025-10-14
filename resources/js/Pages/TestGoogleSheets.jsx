import { Head } from '@inertiajs/react';
import ExcelDataTest from '../Components/ExcelDataTest';

export default function TestGoogleSheets() {
  return (
    <>
      <Head title="Excel Data Test" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Excel Data Test
          </h1>

          <ExcelDataTest />
        </div>
      </div>
    </>
  );
}