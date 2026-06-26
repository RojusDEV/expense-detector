import { createBrowserRouter } from "react-router";
import Layout from "../shared/components/Layout";
import { OverviewPage } from "../features/overview/views/OverviewPage";
import { TransactionsPage } from "../features/transactions/views/TransactionsPage";
import ImportPage from "../features/import/views/ImportPage";
import AuthLayout from "../shared/components/AuthLayout";
import LoginPage from "../features/auth/views/LoginPage";
import RegisterPage from "../features/auth/views/RegisterPage";
import { HeroPage } from "../features/hero/views/HeroPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import SubscriptonsPage from "../features/subscriptions/views/SubscriptonsPage";
import AnomaliesPage from "../features/anomalies/views/AnomaliesPage";
import SavingsPage from "../features/savings/views/SavingsPage";
import InsightsPage from "../features/insights/views/InsightsPage";
import MerchantsPage from "../features/merchants/views/MerchantsPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HeroPage,
  },
  {
    path: "/dashboard",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: OverviewPage },
          { path: "transactions", Component: TransactionsPage },
          { path: "merchants", Component: MerchantsPage },
          { path: "subscriptions", Component: SubscriptonsPage },
          { path: "anomalies", Component: AnomaliesPage },
          { path: "savings", Component: SavingsPage },
          { path: "insights", Component: InsightsPage },
          { path: "import", Component: ImportPage },
          {},
        ],
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
]);

export default router;
