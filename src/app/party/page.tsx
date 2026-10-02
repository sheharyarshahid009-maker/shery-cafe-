import PartyBookingForm from "@/components/PartyBookingForm";

export default function PartyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        Events & Celebrations
      </p>
      <h1 className="section-title mt-1 text-center">Book Your Party</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Birthdays, anniversaries, corporate events — celebrate at Shery Cafe
        with food, sheesha, gaming and unforgettable vibes.
      </p>
      <div className="mt-8">
        <PartyBookingForm />
      </div>
    </div>
  );
}
