export interface ManagerDashboardStats {
  totalVehicles: number;
  openJobs: number;
  predictiveAlerts: number;
  mechanicsAvailable: number;
  // Additional counters for summary cards
  lowStockParts: number;
  overdueVehicles: number;
  awaitingInspection: number;
}

// 1. Vehicles overdue for service
export interface OverdueVehicle {
  vehicle_id: string;
  register_number: string;
  model: string;
  odometer_km: number;
  status_code: string;
  last_maintenance_date: Date | string;
  days_since_last_maintenance: number;
}

// 2. Vehicles awaiting inspection
export interface AwaitingInspectionVehicle {
  vehicle_id: string;
  register_number: string;
  model: string;
  status_code: string;
}

// 3. Parts below reorder thresholds
export interface LowStockPart {
  part_name: string;
  quantity: number;
  re_order_threshold: number;
}

// 4. Supplier performance comparison
export interface SupplierPerformance {
  part_number_1: string;
  supplier_id_1: string;
  unit_price_1: number;
  supplier_id_2: string;
  unit_price_2: number;
  percentage_diff: number | string; 
}