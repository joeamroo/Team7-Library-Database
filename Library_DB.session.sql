SELECT CV.book_movie_title_model, CV.year_released, CV.director_brand, CV.genres,
       CV.rating, H.STATUS
FROM member AS M, hold_request AS H, catalog_view AS CV
WHERE M.member_id = H.member_id AND H.movie_id = CV.asset_id AND member_id = ?;