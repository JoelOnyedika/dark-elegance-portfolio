import { SKILLS_1, SKILLS_2 } from "@/lib/data";
import Split from "../Split";
import Marquee from "../Marquee";

type S = typeof SKILLS_1;
const Row = ({ items }: { items: S }) => (
  <>{items.map((s) => (
    <span className="chip" key={s.name}><s.icon size={22} style={{ color: s.color }} />{s.name}</span>
  ))}</>
);

export default function Skills() {
  return (
    <section id="skills" className="sec sec--skills">
      <div className="wrap wrap--center" data-pane>
        <Split text="The tools I reach for" className="center" />
        <p className="sub center">When the head dissolves, the stack takes over.</p>
      </div>
      <div className="skills__rows" data-pane>
        <Marquee speed={50}><Row items={SKILLS_1} /></Marquee>
        <Marquee speed={42} reverse><Row items={SKILLS_2} /></Marquee>
      </div>
    </section>
  );
}
