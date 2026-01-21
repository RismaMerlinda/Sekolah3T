import { DonorHeader, DonorFooter } from '@/components/donor/Header';

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DonorHeader />
      <main className="flex-1">{children}</main>
      <DonorFooter />
    </div>
  );
}
