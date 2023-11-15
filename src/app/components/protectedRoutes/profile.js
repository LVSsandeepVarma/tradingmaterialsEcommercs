/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import profile from "../user/sidebar";

const ProtectedProfile = withAuth(profile);

export default function UserProfile() {
  return (
    <>
      <ProtectedProfile />
    </>
  );
}