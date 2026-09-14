import { products } from "@/lib/products";
import type { CartItem } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export interface CreateOrderInput {
  orderNumber: string;

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  address: {
    line1: string;
    suburb: string;
    city: string;
    postal: string;
  };

  shippingMethod: string;
  deliveryFee: number;

  paymentMethod: "card" | "eft" | "instalment";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";

  paymentReference: string;
  proofOfPaymentPath?: string | null;

  items: CartItem[];
}

export interface CreateOrderResult {
  id: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Upload EFT proof of payment to Supabase Storage.
 */
export async function uploadOrderProof(file: File, orderNumber: string): Promise<string> {
  const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

  const maxSize = 10 * 1024 * 1024; // 10 MB

  if (!allowedTypes.has(file.type)) {
    throw new Error("Proof of payment must be a PDF, JPG or PNG file.");
  }

  if (file.size > maxSize) {
    throw new Error("Proof of payment must be smaller than 10 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";

  const safeOrderNumber = orderNumber.replace(/[^a-zA-Z0-9_-]/g, "_");

  const filePath = `${safeOrderNumber}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("order-proofs").upload(filePath, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(`Proof upload failed: ${error.message}`);
  }

  return filePath;
}

/**
 * Create the order and all order items in Supabase.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const activeItems = input.items.filter((item) => !item.savedForLater);

  if (activeItems.length === 0) {
    throw new Error("Cannot create an order with an empty cart.");
  }

  /**
   * Recalculate prices from the product catalogue.
   * We do not trust prices coming from localStorage/cart state.
   */
  const orderItems = activeItems.map((item) => {
    const product = products.find((product) => product.slug === item.slug);

    if (!product) {
      throw new Error(`Product "${item.slug}" could not be found.`);
    }

    const quantity = Math.max(1, item.qty);
    const unitPrice = product.price;
    const lineTotal = unitPrice * quantity;

    return {
      product_slug: product.slug,
      product_name: product.name,
      storage: item.storage,
      colour: item.colour,
      quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);

  const deliveryFee = Math.max(0, input.deliveryFee);
  const total = subtotal + deliveryFee;

  const { data, error } = await supabase.rpc("create_order", {
    p_order: {
      order_number: input.orderNumber,
      customer_name: input.customer.name.trim(),
      customer_email: input.customer.email.trim(),
      customer_phone: input.customer.phone.trim(),

      delivery_line1: input.address.line1.trim(),
      delivery_suburb: input.address.suburb.trim(),
      delivery_city: input.address.city.trim(),
      delivery_postal: input.address.postal.trim(),

      shipping_method: input.shippingMethod,

      subtotal,
      delivery_fee: deliveryFee,
      total,

      payment_method: input.paymentMethod,
      payment_status: input.paymentStatus,
      order_status: input.orderStatus,

      payment_reference: input.paymentReference,
      proof_of_payment_path: input.proofOfPaymentPath ?? null,
    },

    p_items: orderItems,
  });

  if (error) {
    throw new Error(`Order creation failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Supabase did not return an order ID.");
  }

  return {
    id: String(data),
    orderNumber: input.orderNumber,
    subtotal,
    deliveryFee,
    total,
  };
}
