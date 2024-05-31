export interface SubscriptionDetailsResponseOnApprove {
  ack: string;
  data: ResponseOnApproveData;
  meta: Meta;
  server: string;
}

export interface ResponseOnApproveData {
  status: string;
  status_update_time: string;
  status_changed_by: string;
  id: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount: ShippingAmount;
  subscriber: Subscriber;
  billing_info: BillingInfo;
  create_time: string;
  update_time: string;
  plan_overridden: boolean;
  links: Link[];
}

export interface ShippingAmount {
  currency_code: string;
  value: string;
}

export interface Subscriber {
  email_address: string;
  payer_id: string;
  name: Name;
  shipping_address: ShippingAddress;
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface ShippingAddress {
  address: Address;
}

export interface Address {
  address_line_1: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

export interface BillingInfo {
  outstanding_balance: OutstandingBalance;
  cycle_executions: CycleExecution[];
  next_billing_time: string;
  failed_payments_count: number;
}

export interface OutstandingBalance {
  currency_code: string;
  value: string;
}

export interface CycleExecution {
  tenure_type: string;
  sequence: number;
  cycles_completed: number;
  cycles_remaining: number;
  current_pricing_scheme_version: number;
  total_price_per_cycle: TotalPricePerCycle;
  total_cycles: number;
}

export interface TotalPricePerCycle {
  gross_amount: GrossAmount;
  total_item_amount: TotalItemAmount;
  shipping_amount: ShippingAmount2;
  tax_amount: TaxAmount;
}

export interface GrossAmount {
  currency_code: string;
  value: string;
}

export interface TotalItemAmount {
  currency_code: string;
  value: string;
}

export interface ShippingAmount2 {
  currency_code: string;
  value: string;
}

export interface TaxAmount {
  currency_code: string;
  value: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface Meta {
  calc: string;
  rlog: string;
}
