/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import view_orders from "../product/orders/viewOrders";

const ProtectedViewOrders = withAuth(view_orders);

export default function OrderView() {
  return (
    <>
      <ProtectedViewOrders />
    </>
  );
}
