/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import order_Dashboard from "../dashboard/Dashboard";

const ProtectedDashboard = withAuth(order_Dashboard);

export default function OrderDashboard() {
  return (
    <>
      <ProtectedDashboard />
    </>
  );
}
