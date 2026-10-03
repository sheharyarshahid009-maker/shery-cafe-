// Birthday Club ko homepage pe add karo
const fs = require("fs");
const path = "src\\app\\page.tsx";
let code = fs.readFileSync(path, "utf8");

const changes = [
  // 1. Cake icon import
  [`  Wallet, Users,\n} from "lucide-react";`, `  Wallet, Users, Cake,\n} from "lucide-react";`],
  // 2. Teaser add
  [`  { icon: "Star", kicker: "We Value You", title: "Share Your Experience ⭐", desc: "Apka experience kaisa raha? Rate karein — apki raaye hamare liye qeemti hai!", href: "/feedback", btn: "Give Feedback", gold: false },\n];`,
   `  { icon: "Star", kicker: "We Value You", title: "Share Your Experience ⭐", desc: "Apka experience kaisa raha? Rate karein — apki raaye hamare liye qeemti hai!", href: "/feedback", btn: "Give Feedback", gold: false },\n  { icon: "Cake", kicker: "Celebrate With Us", title: "Birthday Club 🎂", desc: "Apni birthday register karein — us din complimentary dessert & VIP treatment!", href: "/birthday-club", btn: "Join Free", gold: true },\n];`],
  // 3. ICONS me Cake
  [`Users, Wallet, ShoppingBag };`, `Users, Wallet, ShoppingBag, Cake };`],
  // 4. Footer link
  [`  { href: "/feedback", label: "Give feedback", icon: Star },`, `  { href: "/feedback", label: "Give feedback", icon: Star },\n  { href: "/birthday-club", label: "Birthday Club", icon: Cake },`],
];

let count = 0;
for (const [old, fresh] of changes) {
  if (code.includes(old)) {
    code = code.replace(old, fresh);
    count++;
    console.log(`✅ Change ${count} applied`);
  } else {
    console.log(`⚠️ Change ${count + 1} skipped (not found)`);
  }
}

fs.writeFileSync(path, code);
console.log(`\nDone! ${count}/4 changes applied.`);
