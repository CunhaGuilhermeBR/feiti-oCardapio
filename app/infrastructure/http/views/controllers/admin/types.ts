export interface DashboardPageData {
    dashboardCards: Card[];
    logoImageUrl: string
}

interface Card{
    icon: string;
    href: string;
    title: string;
    description: string;
}