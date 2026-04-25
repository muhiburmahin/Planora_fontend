import { reviewService } from "@/services/reviewService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UserReviewsModule() {
    const response = await reviewService.server.getMyReviews({ limit: 25, page: 1 });
    const reviews = response.data?.data ?? response.data ?? [];

    return (
        <Card className="border-primary-100/80">
            <CardHeader>
                <CardTitle>My Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {reviews.map((review: any) => (
                    <div key={review.id} className="rounded-lg border border-slate-100 p-3">
                        <p className="text-sm font-semibold">{review.event?.title ?? "Event"}</p>
                        <p className="text-xs text-slate-500">Rating: {review.rating}/5</p>
                        <p className="mt-1 text-sm text-slate-700">{review.comment}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
