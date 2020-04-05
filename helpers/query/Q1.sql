SELECT 
    products.name,
    products.sku,
    products.price,
    companies.uuid,
    catalogs.catalogName,
    catalogs.createdDate,
    products.uuid,
    products.custom,
    products.allergies
FROM
    db_blinqed_dev.companies
        INNER JOIN
    db_blinqed_dev.catalogs ON companies.uuid = catalogs.companyUuid
        INNER JOIN
    db_blinqed_dev.products ON catalogs.uuid = products.catalogUuid
WHERE
    companies.uuid = '844b5a17-35f5-46ea-a6c6-939b5179e4e7'
        AND catalogs.catalogName like '%sligro%'
