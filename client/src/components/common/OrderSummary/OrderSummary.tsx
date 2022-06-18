import React from "react";
import { Box, Card, useMediaQuery, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { displayCost } from "../../../helpers";
import { CustomButton } from "..";
import useOrderSummaryStyles from "./order-summary-styles";
import { Link } from "react-router-dom";

interface OrderSummaryProps {
  loading?: boolean;
  subtotal: number;
  cart?: boolean;
  onClick?: () => void;
  isSubmitting?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  loading,
  subtotal,
  cart,
  onClick,
  isSubmitting,
}: OrderSummaryProps) => {
  const classes = useOrderSummaryStyles();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div className={classes.container}>
      <Box mt={!cart && isLaptop ? "32px" : 0}>
        <Card className={classes.card} elevation={3}>
          <Box mb="32px" fontWeight={700} fontSize="h4.fontSize">
            Итого
          </Box>
          <table className={classes.table}>
            <tbody>
              <tr>
                <th>Сумма товаров</th>
                <td>
                  {loading ? (
                    <Skeleton
                      className={classes.costSkeleton}
                      animation="wave"
                      width={70}
                    />
                  ) : (
                    displayCost(subtotal, 2)
                  )}
                </td>
              </tr>
              <tr>
                <th>Стоимость доставки</th>
                <td>
                  {loading ? (
                    <Skeleton
                      className={classes.costSkeleton}
                      animation="wave"
                      width={70}
                    />
                  ) : (
                    "Бесплатно"
                  )}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Итоговая стоимость</th>
                <td>
                  {loading ? (
                    <Skeleton
                      className={classes.costSkeleton}
                      animation="wave"
                      width={70}
                    />
                  ) : (
                    displayCost(subtotal, 2)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
          <CustomButton
            component={cart ? Link : undefined}
            to={cart ? "/checkout/payment" : undefined}
            variant="contained"
            buttonClassName={classes.checkoutButton}
            color="secondary"
            size="large"
            fullWidth
            onClick={onClick}
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
          >
            {cart ? "Перейти к оплате" : "Разместить заказ"}
          </CustomButton>
        </Card>
      </Box>
    </div>
  );
};

export default OrderSummary;
