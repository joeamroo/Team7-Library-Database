SELECT TV.transaction_Id AS 'Order ID',  T.date_created AS 'Date', CV.image_address AS '', 
       TV.asset_type AS 'Item', CV.year_released AS 'Year Released', CV.book_movie_title_model AS 'Product', 
       CV.isbn AS 'ISBN', CV.asset_id AS 'Serial Number', CV.genres AS 'Genre', CV.languages AS 'Language', 
       TV.returned AS 'Status'
FROM   TRANSACTION AS T, TRANSACTION_VIEW AS TV, CATALOG_VIEW AS CV, MEMBER AS M
WHERE  M.member_id = T.member_id AND T.transaction_id = TV.transaction_Id AND TV.itemId = CV.asset_id;