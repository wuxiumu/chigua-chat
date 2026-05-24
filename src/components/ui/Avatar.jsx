export default function Avatar({ src, alt, size = 'md', badge }) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className="relative shrink-0">
      <img
        src={src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
        alt={alt || ''}
        className={`${sizeClasses[size]} rounded-lg bg-[#e5e5e5] object-cover`}
      />
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#f44] text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );
}
