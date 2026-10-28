import { useEffect, useState } from "react";
import { Check, ChevronRight, Clock3, PackageCheck, Truck } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/client";
import { formatDate, formatPrice } from "../utils/format";
import { ErrorState, LoadingState } from "../components/Feedback";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => onSnapshot(doc(db, "orderRequests", orderId), (snapshot) => {
    if (!snapshot.exists() || snapshot.data().uid !== user.uid) {
      setError("We couldn't find this order request in your account.");
    } else {
      setOrder({ id: snapshot.id, ...snapshot.data() });
      setError("");
    }
    setLoading(false);
  }, (issue) => {
    setError(issue.message || "Could not load order details.");
    setLoading(false);
  }), [orderId, user]);

  if (loading) return <div className="container page-wrap"><LoadingState label="Confirming your order..." /></div>;
  if (error) return <div className="container page-wrap"><ErrorState message={error} /></div>;
  if (!order) return null;

  return (
    <div className="container page-wrap order-success-page">
      <div className="success-emblem"><PackageCheck size={30} /></div>
      <span className="eyebrow">ORDER REQUEST RECEIVED</span>
      <h1>{order.status === "Approved"
        ? <>Your order<br /><span>is approved.</span></>
        : order.status === "Rejected"
          ? <>Request not<br /><span>approved.</span></>
          : <>Request sent.<br /><span>Awaiting approval.</span></>}</h1>
      <p className="success-copy">{order.status === "Rejected"
        ? `Thanks, ${order.customer?.name}. Please contact the store if you need more information.`
        : `Thanks, ${order.customer?.name}. The store admin will review current stock and pricing before confirming your order.`}</p>
      <div className="order-number-card"><span>{order.orderNumber ? "ORDER NUMBER" : "REQUEST NUMBER"}</span><b>{order.orderNumber || `REQ-${order.id.slice(0, 8).toUpperCase()}`}</b><small>Submitted {formatDate(order.createdAt)}</small></div>
      <div className="success-details">
        <div><h3>Delivery to</h3><p>{order.customer?.name}<br />{order.shippingAddress?.address}<br />{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p></div>
        <div><h3>Payment</h3><p>{order.paymentMethod}<br />{order.total != null ? <b>{formatPrice(order.total)}</b> : <b>Price confirmed after review</b>}</p>{order.paymentNotice && <small className="payment-warning">{order.paymentNotice}</small>}</div>
      </div>
      <div className="success-status"><div className="success-status-icon">{order.status === "Approved" ? <Truck size={18} /> : <Clock3 size={18} />}</div><span><b>Status: {order.status}</b><small>{order.status === "Rejected" ? "Contact the store if you need more information." : order.status === "Approved" ? "Your approved order is ready to track." : "Prices and stock will be checked before approval."}</small></span><ChevronRight size={17} /></div>
      <div className="success-actions">{order.orderId && <Link to={`/account/orders/${order.orderId}`} className="button button-primary">Track your order <ChevronRight size={16} /></Link>}<Link to="/account/orders" className="button button-outline">View order requests</Link><Link to="/shop" className="button button-outline">Continue shopping</Link></div>
      <div className="success-footnote"><Check size={15} /> No inventory is reserved until the admin approves your request.</div>
    </div>
  );
}
