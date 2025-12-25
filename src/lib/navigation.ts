import {
    Activity,
    Home,
    Clock,
    MessageSquare,
    BarChart2,
    FileText,
    User,
    Users,
    FileSpreadsheet,
    Scale,
} from 'lucide-react';

export const menuItems = [
    { name: 'Activities', icon: Activity, href: '/activities' },
    { name: 'Devoir', icon: Home, href: '/devoir' },
    { name: 'Annual Program', icon: Activity, href: '/annual-program' },
    { name: 'Time Slots', icon: Clock, href: '/time-slots' },
    { name: 'Student Absence', icon: MessageSquare, href: '/absences' },
    { name: 'Student Points', icon: BarChart2, href: '/points' },
    { name: 'Student Report', icon: FileText, href: '/report' },
    { name: 'Messages', icon: MessageSquare, href: '/messages' },
    { name: 'My Account', icon: User, href: '/profile' },
    { name: 'Student List', icon: Users, href: '/students' },
    { name: 'Factours', icon: FileSpreadsheet, href: '/invoices' },
    { name: 'Loi', icon: Scale, href: '/policy' },
];
