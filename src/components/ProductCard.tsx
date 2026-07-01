interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  stock: number;
  sold: number;
  thumbnailUrl: string;
}

export default function ProductCard({ title, price, stock, sold, thumbnailUrl }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-4 flex gap-4 transition-transform active:scale-[0.98]">
      <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={title} className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 leading-tight">
          {title}
        </h3>
        <div className="flex justify-between items-end mt-2">
          <span className="font-bold text-brand-violet text-lg">
            {price.toFixed(2)} zł
          </span>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            <div>Stan: <span className="font-medium text-gray-900 dark:text-gray-200">{stock} szt.</span></div>
            <div>Sprzedano: <span className="font-medium text-brand-blue">{sold} szt.</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
