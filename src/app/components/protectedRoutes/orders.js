/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import orders from "../product/orders/orders";

const ProtectedOrders = withAuth(orders);

export default function Orders() {
  return (
    <>
      <ProtectedOrders />
    </>
  );
}
