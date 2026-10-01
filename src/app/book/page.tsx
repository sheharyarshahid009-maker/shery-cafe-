import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        Reservations
      </p>
      <h1 className="section-title mt-1 text-center">Reserve Your Spot</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Dining tables, PS5 lounge, VR zone, snooker and arcade — pick a slot and
        get instant confirmation.
      </p>
      <div className="mt-8">
        <BookingForm />
      </div>
    </div>
  );
}
