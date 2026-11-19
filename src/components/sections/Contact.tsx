import { useState } from "react";
import { Github, Twitter, Check } from "lucide-react";
import { EMAIL, GITHUB, TWITTER } from "@/lib/data";

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
        body: JSON.stringify({ access_key: import.meta.env.VITE_WEB3FORMS_API_KEY, ...f, subject: `New message from ${f.name}` }),
      });
      if (!(await res.json()).success) throw new Error("failed");
      setStatus("sent"); setF({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="sec sec--contact">
      <div className="block" data-pane>
        <h2 className="display contact__title">Say hello</h2>
        <form onSubmit={submit} className="form">
          <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label><span className="mono">Name</span><input name="name" value={f.name} onChange={on} required autoComplete="name" /></label>
          <label><span className="mono">Email</span><input name="email" type="email" value={f.email} onChange={on} required autoComplete="email" /></label>
          <label><span className="mono">Message</span><textarea name="message" value={f.message} onChange={on} rows={3} required /></label>
          <div className="form__row">
            <button className="btn" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send"}</button>
            <p className="form__status" role="status" aria-live="polite">
              {status === "sent" && <><Check size={15} /> Sent.</>}
              {status === "error" && <>Couldn't send. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}
            </p>
          </div>
        </form>
        <p className="contact__meta mono"><a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /></a>
          <a href={TWITTER} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={16} /></a></p>
      </div>
      <footer className="footer mono">© {new Date().getFullYear()} Joel Onyedika</footer>
    </section>
  );
}
