import { useContext, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/shop-context";
import ShaderCanvas from "../components/motion/ShaderCanvas";
import SplitText from "../components/motion/SplitText";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { ease } from "../lib/motion";

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (state === "Login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Invalid credentials");
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const signUp = state === "Sign Up";

  return (
    <div className="grid min-h-[100svh] pt-[var(--nav-h)] lg:grid-cols-2">
      {/* Atmosphere panel */}
      <div className="relative hidden overflow-hidden bg-ink text-bone lg:block">
        <ShaderCanvas palette="ember" />
        <div className="relative flex h-full flex-col justify-end p-[var(--gutter)] pb-16">
          <p className="eyebrow text-bone/50">( Members ) — Early access, saved bags, order tracking</p>
          <p className="display mt-6 text-[clamp(56px,6vw,112px)] leading-[0.9]">
            <SplitText text="Above" trigger="mount" className="block" />
            <SplitText text="*ordinary.*" trigger="mount" delay={0.15} className="block pl-[1em]" accentClassName="italic text-ember" />
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-[var(--gutter)] py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out }} className="w-full max-w-md">
          <LayoutGroup id="auth">
            <div className="flex gap-6 border-b border-ink/10" role="tablist" aria-label="Account">
              {["Login", "Sign Up"].map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={state === s}
                  onClick={() => setState(s)}
                  className={`relative pb-3 label-ui transition-colors ${state === s ? "text-ink" : "text-mute hover:text-ink"}`}
                >
                  {s === "Login" ? "Sign in" : "Create account"}
                  {state === s && <motion.span layoutId="auth-line" className="absolute inset-x-0 -bottom-px h-px bg-ember" />}
                </button>
              ))}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait">
            <motion.h1
              key={state}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ease.out }}
              className="display mt-10 text-6xl"
            >
              {signUp ? <>Join the <span className="italic text-ember">circle</span></> : <>Welcome <span className="italic text-ember">back</span></>}
            </motion.h1>
          </AnimatePresence>
          <p className="mt-3 text-sm text-mute">{signUp ? "Create an account to start shopping." : "Sign in to your account."}</p>

          <form onSubmit={onSubmitHandler} className="mt-8 space-y-5">
            <AnimatePresence initial={false}>
              {signUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                </motion.div>
              )}
            </AnimatePresence>
            <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={signUp ? "new-password" : "current-password"}
            />

            {!signUp && (
              // No password-reset API exists yet; the old link pointed at a missing route.
              <p className="text-right text-xs text-mute">
                Forgot password?{" "}
                <Link to="/contact" className="text-ink link-line">Contact support</Link>
              </p>
            )}

            <div className="pt-4">
              <Button type="submit" full size="lg" loading={submitting} disabled={submitting}>
                {signUp ? "Create account" : "Sign in"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-mute">
            {signUp ? "Already have an account? " : "Don’t have an account? "}
            <button type="button" onClick={() => setState(signUp ? "Login" : "Sign Up")} className="font-medium text-ink link-line">
              {signUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
