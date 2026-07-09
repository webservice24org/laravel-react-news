export interface Menu {
    id: number;
    title: string;
    url: string;
    parent_id: number | null;
    children_recursive?: Menu[];
}

export interface HeaderPageProps {
    menus: Menu[];
}