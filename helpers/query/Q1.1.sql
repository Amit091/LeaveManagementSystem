SELECT 
    #COUNT(*) AS total,
    #COUNT(DISTINCT products.cat) AS product,
    #COUNT(DISTINCT catalogs.catalogName) AS catalog
    catalogs.catalogName, COUNT(*)
FROM
    db_blinqed_dev.companies
        INNER JOIN
    db_blinqed_dev.catalogs on 
        INNER JOIN
    db_blinqed_dev.products
WHERE
    companies.uuid = '844b5a17-35f5-46ea-a6c6-939b5179e4e7'
        AND companies.uuid = catalogs.companyUuid
        AND catalogs.uuid = products.catalogUuid
        AND catalogs.createdDate BETWEEN '2019-09-01' AND '2019-12-31'
        AND products.allergies IS NOT NULL
        AND catalogs.forSeller = 4
        group by catalogs.catalogName
