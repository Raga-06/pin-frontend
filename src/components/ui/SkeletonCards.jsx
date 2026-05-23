export default function SkeletonCards({ count = 8 }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="masonry-item mb-4 break-inside-avoid">
          <div
            className="skeleton w-full rounded-2xl"
            style={{ height: `${200 + (i % 4) * 60}px` }}
          />
        </div>
      ))}
    </div>
  );
}
