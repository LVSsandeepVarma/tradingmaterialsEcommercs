/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import logs from "../logs/Logs";

const ProtectedDashboard = withAuth(logs);

export default function ProtectedLogs() {
  return (
    <>
      <ProtectedDashboard />
    </>
  );
}
