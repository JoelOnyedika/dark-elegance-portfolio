import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="nf">
    <p className="nf__code">404</p>
    <p>That page dissolved into particles.</p>
    <Link className="btn btn--lime" to="/">Back to the portfolio</Link>
  </main>
);

export default NotFound;
