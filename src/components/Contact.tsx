import { useRef } from "react";
import { EMAIL, GITHUB, LINKEDIN, TWITTER } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="contact" className="sec contact" ref={ref} aria-labelledby="contact-h">
      <div className="wrap">
        <p className="kicker" data-reveal><span>05</span> Contact</p>
        <h2 id="contact-h" className="h2 h2--xl" data-reveal>Let's build <em>something together.</em></h2>
        <a className="cta" href={`mailto:${EMAIL}`} data-reveal><span>{EMAIL}</span><i aria-hidden="true">→</i></a>
        <ul className="socials" data-reveal>
          <li><a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a></li>
          {LINKEDIN
            ? <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
            : <li><span className="is-ph" title="Add your LinkedIn URL in src/lib/data.ts">LinkedIn <small>(link to add)</small></span></li>}
          <li><a href={TWITTER} target="_blank" rel="noopener noreferrer">X / Twitter<span className="sr-only"> (opens in a new tab)</span></a></li>
        </ul>
      </div>
      <footer className="footer"><p>© {new Date().getFullYear()} Joel Onyedika</p><p>Full-stack software developer</p></footer>
    </section>
  );
}
