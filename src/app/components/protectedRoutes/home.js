/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import home from "../home/home";

const ProtectedHome = withAuth(home);

export default function AuthenticatedHome() {
  return (
    <>
      <ProtectedHome />
    </>
  );
}
