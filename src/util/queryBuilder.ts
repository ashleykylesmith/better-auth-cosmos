import { CleanedWhere } from "better-auth/adapters";

interface QueryBuilderOptions {
    select?: string[];
    where?: CleanedWhere[];
    sortBy?: { field: string; direction: "asc" | "desc" };
    offset?: number;
    limit?: number;
}
export const queryBuilder = ({ select=['*'], where, sortBy, offset, limit }: QueryBuilderOptions) => {

    const conditions: string[] = [];
    for (const w of where ?? []) {
        conditions.push(`${conditions.length ? w.connector : ''} ${mapCondition(w)}`);
    }

    const columns = select.length === 1 && select.at(0) === '*'
        ? '*'
        : select.map(column => `c.${column}`).join(", ");

    const query = `
        SELECT ${columns} FROM c 
        ${conditions.length ? `WHERE ${conditions.join(" ")}` : ''} 
        ${sortBy ? `ORDER BY c.${sortBy.field} ${sortBy.direction}` : ''} 
        ${(offset && limit) || limit ? `OFFSET ${offset ? offset : '0'} LIMIT ${limit || 0}` : ''} 
    `;
    return query.trim();

};

const mapCondition = (where: CleanedWhere) => {

    if (where.operator === 'contains') {
        return `CONTAINS(c.${where.field}, '${where.value}', true)`;
    }
    if (where.operator === 'starts_with') {
        return `STARTSWITH(c.${where.field}, '${where.value}', true)`;
    }
    if (where.operator === 'ends_with') {
        return `ENDSWITH(c.${where.field}, '${where.value}', true)`;
    }
    if (where.operator === 'in' && Array.isArray(where.value)) {
        return `c.${where.field} IN (${where.value.map(v => `'${v}'`).join(", ")})`;
    }

    let mappedOperator: string;
    switch (where.operator) {
        case "eq":
            mappedOperator = "=";
        case "ne":
            mappedOperator = "!=";
        case "lt":
            mappedOperator = "<";
        case "lte":
            mappedOperator = "<=";
        case "gt":
            mappedOperator = ">";
        case "gte":
            mappedOperator = ">=";
        default:
            mappedOperator = "=";
    }

    return `c.${where.field} ${mappedOperator} '${where.value}'`;

};