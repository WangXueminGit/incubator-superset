-- noinspection SqlDialectInspectionForFile

-- noinspection SqlNoDataSourceInspectionForFile

-- superset_total_order_gmv_discount_sg_view

CREATE OR REPLACE VIEW superset_total_order_gmv_discount_sg_view AS
select *,
       seller_rebate_usd+placeorder.shipping_rebate_usd+voucher_value_usd+placeorder.coin_rebate_usd AS total_discount
from fact_placeorder_sg as placeorder
LEFT JOIN (SELECT orderid AS refundorderid FROM fact_refundorderdetail_sg) as refundorder ON placeorder.orderid=refundorder.refundorderid
LEFT JOIN (SELECT orderid as returnorderid FROM fact_returnorderdetail_sg) as returnorder ON placeorder.orderid=returnorder.returnorderid;

-- superset_order_distribution_by_order_value_sg_view

CREATE OR REPLACE VIEW superset_order_distribution_by_order_value_sg_view AS
  SELECT orderid, date_id,
    CASE WHEN total_price < 100000 THEN 1 ELSE NULL END AS "<S$1 ($0.7)",
    CASE WHEN total_price >= 100000 AND total_price < 200000 THEN 1 ELSE NULL END AS "S$1-2 ($0.7-1.4)",
    CASE WHEN total_price >= 200000 AND total_price < 300000 THEN 1 ELSE NULL END AS "S$2-3 ($1.4-2.1)",
    CASE WHEN total_price >= 300000 AND total_price < 400000 THEN 1 ELSE NULL END AS "S$3-4 ($2.1-2.8)",
    CASE WHEN total_price >= 400000 AND total_price < 700000 THEN 1 ELSE NULL END AS "S$4-7 ($2.8-4.9)",
    CASE WHEN total_price >= 700000 AND total_price < 1400000 THEN 1 ELSE NULL END AS "S$7-14 ($4.9-7)",
    CASE WHEN total_price >= 1400000 AND total_price < 2000000 THEN 1 ELSE NULL END AS "S$14-20 ($7-14)",
    CASE WHEN total_price >= 2000000 THEN 1 ELSE NULL END AS ">=$20 ($14)"
  FROM fact_placeorder_sg;