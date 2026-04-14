export default function PlanningLayout({ children }: { children: React.ReactNode }) {
 // Pass-through wrapper, removing double sidebar and relying on root LayoutWrapper
 return <>{children}</>;
}
