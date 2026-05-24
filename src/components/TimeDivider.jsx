export default function TimeDivider({ timestamp }) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  let timeStr;
  if (diff < 60000) {
    timeStr = '刚刚';
  } else if (diff < 3600000) {
    timeStr = `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    timeStr = `${Math.floor(diff / 3600000)}小时前`;
  } else {
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    timeStr = `${date.getMonth() + 1}月${date.getDate()}日 ${h}:${m}`;
  }

  return (
    <div className="flex justify-center my-4">
      <span className="text-[11px] text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded">
        {timeStr}
      </span>
    </div>
  );
}
