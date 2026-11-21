import { RatingStars } from "@/components/common";
import type { Review } from "@/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">ยังไม่มีรีวิว</p>;
  }
  return (
    <ul className="divide-y">
      {reviews.map((review, index) => (
        <li
          key={`${review.reviewerName}-${index}`}
          className="flex gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
            {review.reviewerName.slice(0, 1)}
          </span>
          <div>
            <p className="text-sm">{review.reviewerName}</p>
            <RatingStars rating={review.rating} />
            <p className="mt-1 text-sm">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
