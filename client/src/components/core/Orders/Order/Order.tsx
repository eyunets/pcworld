import React, { useState } from "react";
import { Collapse, Link, Typography } from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Order as IOrder } from "../../../../api/order";
import { getProductImage } from "../../../../api/product";
import { displayCost, displayDate } from "../../../../helpers";
import useOrderStyles from "./order-styles";
import { CustomButton } from "../../../common";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";

type LoadingOrderProps = {
  loading: true;
  order?: never;
};

type LoadedOrderProps = {
  loading?: false;
  order: IOrder;
};

type OrderProps = LoadedOrderProps | LoadingOrderProps;

const Order: React.FC<OrderProps> = ({ order, loading }: OrderProps) => {
  const classes = useOrderStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={classes.order}>
      <div className={classes.cornerInfo}>
        <Typography>
          {order ? (
            displayDate(order.createdAt)
          ) : (
            <Skeleton animation="wave" width={95} />
          )}
        </Typography>
        <Typography>
          {order ? (
            <b>{displayCost(order.orderSummary.productTotal, 2)}</b>
          ) : (
            <Skeleton animation="wave" width={75} />
          )}
        </Typography>
      </div>
      <div className={classes.productContent}>
        {order &&
          order.items.map((item, i) => (
            <div key={i}>
              {(!imageLoaded || loading) && (
                <Skeleton
                  className={classes.skeletonImg}
                  animation="wave"
                  variant="rect"
                />
              )}
              {item && (
                <img
                  className={clsx(classes.img, {
                    [classes.imgLoaded]: imageLoaded,
                  })}
                  src={getProductImage(item.product.slug)}
                  onClick={() => history.push(`/product/${item.product.slug}`)}
                  onLoad={() => setImageLoaded(true)}
                  alt="product-image"
                />
              )}
              <div className={classes.productDetails}>
                <div className={classes.productTitleContainer}>
                  {item ? (
                    <Link
                      component={RouterLink}
                      to={`/product/${item.product.slug}`}
                      variant="body1"
                      className={classes.productTitle}
                    >
                      {item.product.name}
                    </Link>
                  ) : (
                    <Typography variant="body1">
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" width={100} />
                    </Typography>
                  )}
                </div>
                <Typography>
                  {item ? (
                    `Количество: ${item.quantity}`
                  ) : (
                    <Skeleton animation="wave" width={80} />
                  )}
                </Typography>
              </div>
            </div>
          ))}
      </div>
      {order && (
        <Collapse in={open}>
          <div className={classes.details}>
            <div className={classes.detail}>
              <Typography>
                <b>Способ оплаты:</b>
              </Typography>
            </div>
            <div className={classes.detail}>
              <Typography>
                <b>Адрес:</b>
              </Typography>
              <Typography>
                {order.address.firstName + " " + order.address.lastName}
              </Typography>
              <Typography>{order.address.addressLine}</Typography>
              <Typography>{`${order.address.city}, ${order.address.province}, ${order.address.postalCode}`}</Typography>
              <Typography>{order.address.phone}</Typography>
            </div>
            <div className={classes.detail}>
              <Typography>
                <b>Стоимость заказа:</b>
              </Typography>
              <div className={classes.orderSummaryDetail}>
                <Typography>Стоимость всех продуктов</Typography>
                <Typography>
                  {displayCost(order.orderSummary.productTotal, 2)}
                </Typography>
              </div>
              <div className={classes.orderSummaryDetail}>
                <Typography>Доставка</Typography>
                <Typography>Бесплатно</Typography>
              </div>
              <div className={classes.orderSummaryDetail}>
                <Typography className={classes.orderTotal}>
                  Итого
                </Typography>
                <Typography className={classes.orderTotal}>
                  {displayCost(order.orderSummary.productTotal, 2)}
                </Typography>
              </div>
            </div>
            <div className={classes.detail}>
              <Typography>
                <b>Статус заказа:</b>
              </Typography>
              <Typography>{order.status}</Typography>
            </div>
          </div>
        </Collapse>
      )}
      <div className={classes.cornerInfo}>
        <Typography className={classes.orderId}>
          {order ? (
            <>
              <b>Идентификатор заказа</b> {order.orderId}
            </>
          ) : (
            <Skeleton animation="wave" width={110} />
          )}
        </Typography>
        <CustomButton
          buttonClassName={classes.textButton}
          color="primary"
          disabled={loading}
          onClick={() => setOpen(!open)}
        >
          {open ? "Скрыть детали" : "Показать детали"}
        </CustomButton>
      </div>
    </div>
  );
};

export default Order;
