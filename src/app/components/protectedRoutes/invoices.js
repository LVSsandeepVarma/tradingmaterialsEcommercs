/* eslint-disable react/react-in-jsx-scope */
import withAuth from "../middleware/middleware";
import invoices from "../invoice/InvoiceList";

const ProtectedDashboard = withAuth(invoices);

export default function ProtectedInnvoices() {
  return (
    <>
      <ProtectedDashboard />
    </>
  );
}
