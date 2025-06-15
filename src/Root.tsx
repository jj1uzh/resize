import { NavLink } from "react-router";

export function Root() {
  return (
    <>
      <title>Client Tools</title>
      <h1>Client Tools</h1>
      <nav>
        <ul>
          <li><NavLink to="/resize">Resize</NavLink></li>
          <li><NavLink to="/base64">Base64</NavLink></li>
        </ul>
      </nav>
    </>
  )
}