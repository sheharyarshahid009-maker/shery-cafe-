import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "shery_cafe_verify_2026";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN ?? "";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (!message || message.type !== "text") {
      return NextResponse.json({ ok: true });
    }
    const from = message.from;
    const text = message.text.body.toLowerCase();
    const reply = getAutoReply(text);
    if (ACCESS_TOKEN && PHONE_NUMBER_ID) {
      await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: reply },
        }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}

function getAutoReply(text: string): string {
  if (text.includes("order") || text.includes("*new order*")) {
    return `Assalam-o-Alaikum! 🙏\n\nApka order mil gaya hai! ✅\n\n📋 Hamari team abhi apka order prepare kar rahi hai.\n⏰ Takreeban 20-25 minute me ready ho jayega.\n\nKuch aur chahiye ho to yahin message karein!\n\n— Shery Cafe ☕`;
  }
  if (text.includes("party") || text.includes("booking")) {
    return `Assalam-o-Alaikum! 🎉\n\nParty/Event booking ki request mil gayi!\n\n📞 Hamari team 30 minute me apse rabta karegi.\n\nJaldi jawab chahiye? Call: 0339 6030012\n\n— Shery Cafe ☕`;
  }
  if (text.includes("menu")) {
    return `Hamara menu dekhein! 📋\n\n🌐 https://shery-cafe.vercel.app/menu\n\nWahan se direct order bhi kar sakte hain!\n\n— Shery Cafe ☕`;
  }
  if (text.includes("timing") || text.includes("open") || text.includes("close")) {
    return `🕐 Shery Cafe Timings:\n\nRozana: 12 PM – 2 AM\n📍 Defence Phase VI, Karachi\n📞 0339 6030012\n\n— Shery Cafe ☕`;
  }
  if (text.includes("location") || text.includes("address") || text.includes("kahan")) {
    return `📍 Shery Cafe\nDefence Phase VI, Karachi\n\nGoogle Maps pe "Shery Cafe DHA Phase 6" search karein!\n\n— Shery Cafe ☕`;
  }
  if (text.includes("salam") || text.includes("hello") || text.includes("hi") || text.includes("aoa")) {
    return `Walaikum Assalam! 🙏\n\nShery Cafe me khush aamdeed! ☕\n\nKya chahiye?\n📋 Menu ke liye "menu" likhein\n🎉 Party ke liye "party" likhein\n🕐 Timings ke liye "timing" likhein\n\n— Shery Cafe`;
  }
  return `Shukriya message karne ka! 🙏\n\nHamari team jald jawab degi.\n\nForan jawab chahiye?\n📞 Call: 0339 6030012\n📋 Menu: https://shery-cafe.vercel.app/menu\n\n— Shery Cafe ☕`;
}
