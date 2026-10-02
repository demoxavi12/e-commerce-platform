import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/shop-context";
import SplitText from "../components/motion/SplitText";
import Reveal from "../components/motion/Reveal";
import AnimatedNumber from "../components/motion/AnimatedNumber";
import Button from "../components/ui/Button";
import { formatPrice } from "../lib/motion";

// There is no profile endpoint (the JWT only carries the user id), so instead
// of the old hard-coded "John Doe" data, everything here is derived from the
// user's real orders via the existing /api/order/userorders route.
const Info = ({ label, value }) => (
  <div className="border-t border-ink/10 pt-3">
    <p className="eyebrow text-mute">{label}</p>
    <p className="mt-1 text-[15px]">{value || <span className="text-mute">—</span>}</p>
  </div>
);

const Profile = () => {
  const { logout, token, backendUrl, currecy } = useContext(ShopContext);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios
      .post(backendUrl + "/api/order/userorders", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data.success ? res.data.orders : []))
      .catch(() => setOrders([]));
  }, [backendUrl, token]);

  const list = orders || [];
  const latest = [...list].sort((a, b) => (b.date || 0) - (a.date || 0))[0];
  const addr = latest?.address || {};
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  const delivered = list.filter((o) => (o.status || "").toLowerCase() === "delivered").length;
  const spent = list.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const initials = (name || "Member").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  if (!token) {
    return (
      <div className="page-top gutter pb-10">
        <div className="border-y border-ink/10 py-24 text-center">
          <p className="display text-5xl">Sign in to see your profile</p>
          <div className="mt-6"><Button to="/login">Sign in</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-top gutter pb-10">
      <header className="pb-12 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">( Account ) — Personal information & orders</p>
        <h1 className="display mt-5 text-[clamp(56px,10vw,160px)]">
          <SplitText text="My *profile*" trigger="mount" accentClassName="italic text-ember" />
        </h1>
      </header>

      <div className="grid gap-10 pb-16 md:grid-cols-[320px_1fr] md:gap-16">
        <Reveal className="h-fit bg-ink p-6 text-bone">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ember display text-4xl text-ink" aria-hidden="true">
            {initials}
          </div>
          <p className="display mt-6 text-4xl">{name || "ELEVÉ member"}</p>
          <p className="text-sm text-bone/60">{addr.email || "Details appear after your first order"}</p>
          <div className="mt-8 grid gap-2">
            <Button variant="light" full size="sm" to="/orders">View orders</Button>
            <Button variant="outline" full size="sm" onClick={logout} icon={false}>Log out</Button>
          </div>
        </Reveal>

        <div className="space-y-12">
          <Reveal className="grid gap-px bg-ink/10 sm:grid-cols-3" aria-busy={orders === null}>
            {[
              ["Total orders", list.length, (n) => String(Math.round(n))],
              ["Delivered", delivered, (n) => String(Math.round(n))],
              ["Total spent", spent, (n) => formatPrice(currecy, n)],
            ].map(([t, v, fmt]) => (
              <div key={t} className="bg-bone p-6">
                <p className="eyebrow text-mute">{t}</p>
                <p className="display mt-4 text-5xl sm:text-6xl">
                  {orders === null ? <span className="skeleton inline-block h-12 w-16 align-middle" /> : <AnimatedNumber value={v} format={fmt} />}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <h2 className="label-ui mb-6">Latest delivery details</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Info label="Name" value={name} />
              <Info label="Email" value={addr.email} />
              <Info label="Phone" value={addr.phone} />
              <Info label="Address" value={[addr.Street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(", ")} />
            </div>
            {orders !== null && !latest && (
              <p className="mt-6 text-sm text-mute">
                No orders yet — your delivery details will show here after checkout.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Profile;
