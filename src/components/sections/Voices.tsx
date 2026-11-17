import { TESTIMONIALS } from "@/lib/data";
import Split from "../Split";
import Marquee from "../Marquee";

export default function Voices() {
  return (
    <section id="voices" className="sec sec--voices">
      <div className="wrap wrap--center" data-pane>
        <Split text="What clients say" className="center" />
      </div>
      <div data-pane>
        <Marquee speed={34} pauseOnHover className="marquee--cards">
          {TESTIMONIALS.map((t) => (
            <figure className="quote" key={t.name}>
              <blockquote>{t.content}</blockquote>
              <figcaption><span className="quote__av">{t.avatar}</span><span><b>{t.name}</b><br />{t.role}</span></figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
