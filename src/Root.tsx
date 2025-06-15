import { NavLink } from "react-router";

export function Root() {
  return (
    <>
      <title>Client Tools</title>
      <h1>Client Tools</h1>
      <nav>
        <NavLink to="/resize">Resize</NavLink>
      </nav>
    </>
  )
}