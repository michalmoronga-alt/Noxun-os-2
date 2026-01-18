import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    CheckSquare,
    CalendarDays,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dnes", path: "/dnes", icon: LayoutDashboard },
    { label: "Zákazky", path: "/zakazky", icon: Package },
    { label: "Úlohy", path: "/ulohy", icon: CheckSquare },
    { label: "Kalendár", path: "/kalendar", icon: CalendarDays },
];

export function AppShell() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            {/* Top Bar (Mobile + Desktop) */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
                <div className="flex h-14 items-center px-4 justify-between">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <span>NOXUN OS</span>
                    </div>
                    <Link to="/nastavenia" className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="sr-only">Nastavenia</span>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pb-16 lg:pb-0 lg:mr-64">
                <Outlet />
            </main>

            {/* Bottom Nav (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden h-16 px-4 pb-safe-area-inset-bottom">
                <div className="flex h-full items-center justify-around">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-colors p-2 rounded-md w-full",
                                    isActive
                                        ? "text-primary bg-accent/50"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Right Sidebar (Desktop) */}
            <aside className="hidden lg:flex fixed right-0 top-0 bottom-0 w-64 border-l bg-muted/10 flex-col">
                {/* Desktop Header */}
                <div className="flex h-14 items-center px-6 border-b">
                    <span className="font-bold text-xl tracking-tight">NOXUN OS</span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t">
                    <Link
                        to="/nastavenia"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                            location.pathname === "/nastavenia" && "bg-accent text-accent-foreground"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Nastavenia
                    </Link>
                </div>
            </aside>
        </div>
    );
}
