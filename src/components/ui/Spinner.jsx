export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3DB4F2]/20 border-t-[#3DB4F2]" />
    </div>
  );
}
