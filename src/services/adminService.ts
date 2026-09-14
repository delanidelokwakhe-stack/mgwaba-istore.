import { supabase } from "@/lib/supabase";

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  storage: string;
  colour: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_line1: string;
  delivery_suburb: string | null;
  delivery_city: string;
  delivery_postal: string;
  shipping_method: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "card" | "eft" | "instalment";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status: "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_reference: string | null;
  proof_of_payment_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderItem[];
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    console.error("Admin check failed:", error);
    return false;
  }

  return data === true;
}

export async function getCurrentAdminUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const admin = await checkIsAdmin();

  if (!admin) {
    await supabase.auth.signOut();

    throw new Error("This account does not have administrator access.");
  }

  return data.user;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        order_items (*)
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminOrder[];
}

export async function getAdminOrder(orderId: string): Promise<AdminOrder | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        order_items (*)
      `,
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as AdminOrder | null;
}

export async function updateOrderStatus(orderId: string, orderStatus: AdminOrder["order_status"]) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      order_status: orderStatus,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: AdminOrder["payment_status"],
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderProofUrl(proofPath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("order-proofs")
    .createSignedUrl(proofPath, 60 * 10);

  if (error) {
    throw error;
  }

  if (!data?.signedUrl) {
    throw new Error("Unable to create receipt URL.");
  }

  return data.signedUrl;
}
