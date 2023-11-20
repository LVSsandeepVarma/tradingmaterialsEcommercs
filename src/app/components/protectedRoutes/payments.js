/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import payments from "../payments/Payments";

const ProtectedPayments = withAuth(payments);

export default function PaymentsHistory() {
  return (
    <>
      <ProtectedPayments />
    </>
  );
}
