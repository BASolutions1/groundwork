export default function AppLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-48 animate-pulse rounded bg-[#F4F4F2]" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#F4F4F2]" />
      <div className="mt-4 h-40 animate-pulse rounded-card bg-[#F4F4F2]" />
    </div>
  );
}
