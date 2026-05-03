import React from "react";

export interface NavItem {
    title: string;
    url: string;
    icon?: React.ReactNode;
}

export interface Routes {
    title: string;
    items?: NavItem[];
}
