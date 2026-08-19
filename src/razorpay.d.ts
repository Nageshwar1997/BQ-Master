declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler?: (response: Record<string, string>) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: { color?: string };
  }

  interface RazorpayInstance {
    open: () => void;
    close: () => void;
    on(
      event: string,
      callback: (response: Record<string, string>) => void
    ): void;
    off(
      event: string,
      callback: (response: Record<string, string>) => void
    ): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance; // ✅ constructor
  }
}
export {};
