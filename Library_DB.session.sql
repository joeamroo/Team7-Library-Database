SELECT T.transaction_id AS 'Transaction', T.date_created AS 'Date_Created', T.due_date AS 'Due_Date',
       T.return_date AS 'Return_By', TV.returned AS 'Returned_Status', CV.asset_type AS 'Asset',
       TV.itemId AS 'ISBN_SERIAL', CV.book_movie_title_model AS 'Product', CV.asset_condition AS 'Condition',
       CV.image_address AS 'Image', CV.year_released AS 'Released', CV.authors AS 'Authors',  
       CV.genres AS 'Genres', CV.director_brand AS 'Director_Brand'
FROM member AS M, catalog_view AS CV, transaction AS T, transaction_view AS TV  
WHERE M.member_id = T.member_id AND T.transaction_id = TV.transaction_id AND (TV.itemId = CV.isbn OR 
      TV.itemId = CV.asset_id);