

SELECT CV.image_address, H.item_name, CV.director_brand, CV.serial_number, 
       CV.asset_condition
FROM   member as M, hold_request AS H, catalog_view AS CV
WHERE  M.member_id = H.member_id AND H.device_id = CV.asset_id;