import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { PageHeader, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zar } from "@/lib/format";
import {
  checkIsAdmin,
  getAdminOrders,
  getOrderProofUrl,
  signInAdmin,
  signOutAdmin,
  updateOrderStatus,
  updatePaymentStatus,
  type AdminOrder,
} from "@/services/adminService";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "Admin Orders — Mgwaba iStore",
      },
      {
        name: "description",
        content: "Mgwaba iStore administration and order management.",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),
  component: Admin,
});

const orderStatuses: AdminOrder["order_status"][] = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses: AdminOrder["payment_status"][] = ["pending", "paid", "failed", "refunded"];

function Admin() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const [search, setSearch] = useState("");

  const [updatingOrder, setUpdatingOrder] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        const admin = await checkIsAdmin();

        if (mounted) {
          setIsAdmin(admin);
        }
      } catch (error) {
        console.error("Admin access check failed:", error);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    void checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  const loadOrders = async () => {
    setLoadingOrders(true);

    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);

      const message = error instanceof Error ? error.message : "Failed to load orders.";

      toast.error(message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    void loadOrders();
  }, [isAdmin]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      return (
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query) ||
        order.customer_phone.toLowerCase().includes(query) ||
        order.order_status.toLowerCase().includes(query) ||
        order.payment_status.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + Number(order.total), 0);
  }, [orders]);

  const pendingOrders = orders.filter((order) => order.order_status === "pending").length;

  const paidOrders = orders.filter((order) => order.payment_status === "paid").length;

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Enter your admin email and password.");
      return;
    }

    setLoggingIn(true);

    try {
      await signInAdmin(email.trim(), password);

      setIsAdmin(true);
      setPassword("");

      toast.success("Admin login successful.");
    } catch (error) {
      console.error("Admin login failed:", error);

      const message = error instanceof Error ? error.message : "Unable to sign in.";

      toast.error(message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();

      setIsAdmin(false);
      setOrders([]);
      setSelectedOrder(null);

      toast.success("You have been signed out.");
    } catch (error) {
      console.error("Admin logout failed:", error);
      toast.error("Unable to sign out.");
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: AdminOrder["order_status"]) => {
    setUpdatingOrder(true);

    try {
      await updateOrderStatus(orderId, status);

      toast.success("Order status updated.");

      await loadOrders();

      if (selectedOrder?.id === orderId) {
        const refreshed = await getAdminOrders();
        const updated = refreshed.find((order) => order.id === orderId);

        if (updated) {
          setSelectedOrder(updated);
        }
      }
    } catch (error) {
      console.error("Order status update failed:", error);

      const message = error instanceof Error ? error.message : "Unable to update order status.";

      toast.error(message);
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    status: AdminOrder["payment_status"],
  ) => {
    setUpdatingOrder(true);

    try {
      await updatePaymentStatus(orderId, status);

      toast.success("Payment status updated.");

      await loadOrders();

      if (selectedOrder?.id === orderId) {
        const refreshed = await getAdminOrders();
        const updated = refreshed.find((order) => order.id === orderId);

        if (updated) {
          setSelectedOrder(updated);
        }
      }
    } catch (error) {
      console.error("Payment status update failed:", error);

      const message = error instanceof Error ? error.message : "Unable to update payment status.";

      toast.error(message);
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handleViewProof = async (proofPath: string | null) => {
    if (!proofPath) {
      toast.error("No proof of payment was uploaded.");
      return;
    }

    try {
      const url = await getOrderProofUrl(proofPath);

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Unable to open proof:", error);

      const message = error instanceof Error ? error.message : "Unable to open proof of payment.";

      toast.error(message);
    }
  };

  if (checkingAuth) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-muted-foreground">Checking administrator access...</p>
        </section>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Admin"
          title="Mgwaba iStore Admin"
          subtitle="Sign in to manage orders and payments."
        />

        <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
          <div className="surface p-8">
            <div className="space-y-5">
              <div>
                <Label htmlFor="admin-email">Admin email</Label>

                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  className="mt-2"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <Label htmlFor="admin-password">Password</Label>

                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  className="mt-2"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <Button
                className="w-full rounded-full"
                disabled={loggingIn}
                onClick={() => void handleLogin()}
              >
                {loggingIn ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin"
        title="Order management"
        subtitle="Manage Mgwaba iStore orders, payments and EFT proof."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Administrator access</p>

            <p className="font-medium">Orders database</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={loadingOrders}
              onClick={() => void loadOrders()}
            >
              {loadingOrders ? "Refreshing..." : "Refresh"}
            </Button>

            <Button variant="outline" className="rounded-full" onClick={() => void handleLogout()}>
              Sign out
            </Button>
          </div>
        </div>

        {/* Dashboard statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total orders" value={orders.length.toString()} />

          <StatCard title="Pending orders" value={pendingOrders.toString()} />

          <StatCard title="Paid orders" value={paidOrders.toString()} />

          <StatCard title="Paid revenue" value={zar(totalRevenue)} />
        </div>

        {/* Search */}
        <div className="mt-8">
          <Label htmlFor="order-search">Search orders</Label>

          <Input
            id="order-search"
            className="mt-2 max-w-xl"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Order number, customer, email, phone..."
          />
        </div>

        {/* Orders */}
        <div className="mt-8 space-y-4">
          {loadingOrders && orders.length === 0 ? (
            <div className="surface p-8 text-center">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="surface p-8 text-center">
              <h2 className="font-semibold">No orders found</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Orders created through checkout will appear here.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="surface w-full p-5 text-left transition hover:-translate-y-0.5"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_auto_auto] lg:items-center">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>

                    <p className="mt-1 text-sm">{order.customer_name}</p>

                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>

                    <p className="font-medium">{order.payment_method.toUpperCase()}</p>

                    <StatusBadge value={order.payment_status} />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Order status</p>

                    <StatusBadge value={order.order_status} />
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="font-semibold">{zar(Number(order.total))}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Order detail */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          updating={updatingOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderStatusChange={handleOrderStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onViewProof={handleViewProof}
        />
      )}
    </PageShell>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="surface p-6">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize">
      {value}
    </span>
  );
}

function OrderDetails({
  order,
  updating,
  onClose,
  onOrderStatusChange,
  onPaymentStatusChange,
  onViewProof,
}: {
  order: AdminOrder;
  updating: boolean;
  onClose: () => void;
  onOrderStatusChange: (orderId: string, status: AdminOrder["order_status"]) => Promise<void>;
  onPaymentStatusChange: (orderId: string, status: AdminOrder["payment_status"]) => Promise<void>;
  onViewProof: (proofPath: string | null) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 max-w-4xl">
        <div className="surface p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order</p>

              <h2 className="text-2xl font-semibold">{order.order_number}</h2>
            </div>

            <Button variant="outline" className="rounded-full" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Customer */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <InfoBlock title="Customer">
              <p>{order.customer_name}</p>
              <p>{order.customer_email}</p>
              <p>{order.customer_phone}</p>
            </InfoBlock>

            <InfoBlock title="Delivery address">
              <p>{order.delivery_line1}</p>

              {order.delivery_suburb && <p>{order.delivery_suburb}</p>}

              <p>
                {order.delivery_city}, {order.delivery_postal}
              </p>

              <p>Shipping: {order.shipping_method}</p>
            </InfoBlock>
          </div>

          {/* Payment */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <InfoBlock title="Payment">
              <p>Method: {order.payment_method.toUpperCase()}</p>

              <p>Reference: {order.payment_reference ?? "—"}</p>

              <p>Amount: {zar(Number(order.total))}</p>

              <p>
                Payment status: <strong>{order.payment_status}</strong>
              </p>
            </InfoBlock>

            <InfoBlock title="Order status">
              <select
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2"
                value={order.order_status}
                disabled={updating}
                onChange={(event) =>
                  void onOrderStatusChange(
                    order.id,
                    event.target.value as AdminOrder["order_status"],
                  )
                }
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2"
                value={order.payment_status}
                disabled={updating}
                onChange={(event) =>
                  void onPaymentStatusChange(
                    order.id,
                    event.target.value as AdminOrder["payment_status"],
                  )
                }
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    Payment: {status}
                  </option>
                ))}
              </select>
            </InfoBlock>
          </div>

          {/* Products */}
          <div className="mt-8">
            <h3 className="font-semibold">Products</h3>

            <div className="mt-4 space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.product_name}</p>

                      <p className="text-sm text-muted-foreground">
                        {item.storage} · {item.colour}
                      </p>

                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>

                    <p className="font-semibold">{zar(Number(item.line_total))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="ml-auto max-w-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>

                <span>{zar(Number(order.subtotal))}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>

                <span>{zar(Number(order.delivery_fee))}</span>
              </div>

              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>

                <span>{zar(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* EFT proof */}
          <div className="mt-8 rounded-2xl border border-border p-5">
            <h3 className="font-semibold">EFT proof of payment</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {order.proof_of_payment_path
                ? "A proof-of-payment file is attached to this order."
                : "No proof-of-payment file is attached."}
            </p>

            {order.proof_of_payment_path && (
              <Button
                className="mt-4 rounded-full"
                onClick={() => void onViewProof(order.proof_of_payment_path)}
              >
                View proof of payment
              </Button>
            )}
          </div>

          {order.notes && (
            <div className="mt-8 rounded-2xl border border-border p-5">
              <h3 className="font-semibold">Notes</h3>

              <p className="mt-2 text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <h3 className="font-semibold">{title}</h3>

      <div className="mt-3 space-y-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
