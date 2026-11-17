import { useState } from "react";
import { Send, Github, Linkedin, Twitter, Check } from "lucide-react";
import { EMAIL } from "@/lib/data";
import Split from "../Split";
import Magnetic from "../Magnetic";

const SOCIALS = [
  { icon: Github, href: "https://github.com/joelonyedika", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/highoctane0000", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
].filter((s) => s.href !== "#");

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const on = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement)?.checked) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: import.meta.env.VITE_WEB3FORMS_API_KEY, ...f, subject: `New project inquiry from ${f.name}` }),
      });
      const json = await res.json();
      if (!json.success) throw new Error("failed");
      setStatus("sent"); setF({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="sec sec--contact">
      <div className="wrap wrap--right">
        <div className="panel panel--contact" data-pane>
          <Split text="Let's work together" />
          <p className="lead">Got a project that needs shipping? A codebase that needs saving? Send a message and I'll get back to you within 24 hours.</p>
          <form onSubmit={submit} className="form">
            <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label>Your name<input name="name" value={f.name} onChange={on} placeholder="Ada Lovelace" required autoComplete="name" /></label>
            <label>Email address<input name="email" type="email" value={f.email} onChange={on} placeholder="ada@company.com" required autoComplete="email" /></label>
            <label>Project details<textarea name="message" value={f.message} onChange={on} rows={5} placeholder="What needs building, fixing or cleaning up? Add your timeline if you have one." required /></label>
            <div className="form__row">
              <Magnetic>
                <button className="btn btn--lime" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : <>Send message <Send size={16} /></>}
                </button>
              </Magnetic>
              <p className="form__status" role="status" aria-live="polite">
                {status === "sent" && <><Check size={16} /> Message sent. I'll reply within 24 hours.</>}
                {status === "error" && <>Couldn't send that. Email me directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}
              </p>
            </div>
          </form>
          <p className="contact__direct">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <ul className="socials">
            {SOCIALS.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><s.icon size={18} /></a></li>)}
          </ul>
        </div>
      </div>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Joel Onyedika</p>
        <p>Built with React, Three.js, GSAP and Lenis.</p>
      </footer>
    </section>
  );
}
