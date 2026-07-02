export default function Loader({ fullPage = true }) {
  const spinner = (
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent" />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
