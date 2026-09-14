import emailjs from "@emailjs/browser";

const serviceId = import.meta.env['VITE_EMAILJS_SERVICE_ID'];
const ownerTemplateId = import.meta.env['VITE_EMAILJS_TEMPLATE_OWNER'];
const customerTemplateId = import.meta.env['VITE_EMAILJS_TEMPLATE_CUSTOMER'];
const publicKey = import.meta.env["VITE_EMAILJS_PUBLIC_KEY"];

if (!serviceId || !ownerTemplateId || !customerTemplateId || !publicKey) {
  console.warn("EmailJS environment variables are missing. Email notifications are disabled.");
}

export interface OrderEmailItem {
  product_name: string;
  storage: string;
  colour: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderEmailData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  delivery_line1: string;
  delivery_suburb: string;
  delivery_city: string;
  delivery_postal: string;

  shipping_method: string;

  subtotal: number;
  delivery_fee: number;
  total: number;

  payment_method: string;
  payment_status: string;

  order_items: OrderEmailItem[];
}

function formatCurrency(value: number): string {
  return `R${Number(value).toFixed(2)}`;
}

function formatPaymentMethod(method: string): string {
  if (method === "eft") {
    return "Bank Transfer (EFT)";
  }

  if (method === "card") {
    return "Visa / Mastercard";
  }

  if (method === "instalment") {
    return "Instalment Plan";
  }

  return method;
}

function formatItems(items: OrderEmailItem[]): string {
  return items
    .map(
      (item) =>
        `${item.product_name} - ${item.storage} - ${item.colour} x${item.quantity} — ${formatCurrency(item.line_total)}`,
    )
    .join("\n");
}

function getCommonTemplateParams(order: OrderEmailData) {
  const deliveryAddress = [
    order.delivery_line1,
    order.delivery_suburb,
    order.delivery_city,
    order.delivery_postal,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    order_number: order.order_number,

    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,

    delivery_address: deliveryAddress,
    delivery_city: order.delivery_city,
    delivery_postal: order.delivery_postal,

    shipping_method: order.shipping_method,

    subtotal: Number(order.subtotal).toFixed(2),
    delivery_fee: Number(order.delivery_fee).toFixed(2),
    total: Number(order.total).toFixed(2),

    payment_method: formatPaymentMethod(order.payment_method),
    payment_status: order.payment_status,

    order_items: formatItems(order.order_items),
  };
}

export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  if (!serviceId || !ownerTemplateId || !customerTemplateId || !publicKey) {
    console.warn("EmailJS is not configured. Skipping order emails.");
    return;
  }

  const templateParams = getCommonTemplateParams(order);

  const ownerParams = {
    ...templateParams,
  };

  const customerParams = {
    ...templateParams,

    to_email: order.customer_email,
    reply_to: order.customer_email,
  };

  const results = await Promise.allSettled([
    emailjs.send(serviceId, ownerTemplateId, ownerParams, {
      publicKey,
    }),

    emailjs.send(serviceId, customerTemplateId, customerParams, {
      publicKey,
    }),
  ]);

  const failed = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failed.length > 0) {
    console.error("One or more order emails failed:", failed);
    throw new Error("One or more order notification emails could not be sent.");
  }
}
