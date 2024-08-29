export type headCellsType = {
    id: number;
    alignment: align;
    label: string;
    disablePadding?: boolean;
};


type align = "center" | "left" | "right" | "inherit" | "justify" | undefined;

export type selected = {
    [x: string]: any;
    id: number
}

export type SelectedItem = {
    [x: string]: any;
    id: number;
    cnpj: string;
}

export type tableProps = {
    tableName: string; 
    modelBase: string;
    rows: Array<string>;
    filtros: Array<string>;
    filtrosCampanha?: any;
    setFiltrosCampanha?: any,
    text: string;
    userId: any;
    cnpjParam?: string;
    dataTable?: any;
    refetch?: any;
}