import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Address, getAddress } from "../../../api/address";
import { CartItem, getCartItems } from "../../../api/cart";
import { processPayment } from "../../../api/order";
import { useFacets } from "../../../context";
import { useCancelToken, calculateOrderSummary } from "../../../helpers";
import { CustomButton, OrderSummary } from "../../common";
import { Alert } from "@material-ui/lab";
import usePaymentStyles from "./payment-styles";

interface State {
  items: CartItem[];
  address: Address | null;
  orderSummary: {
    subtotal: number;
    loading: boolean;
  };
  loaded: boolean;
  error?: string;
  isSubmitting: boolean;
  isProcessingPayment: boolean;
  isOrderPlaced: boolean;
  orderId?: string;
}

const Payment: React.FC = () => {
  const classes = usePaymentStyles();
  const history = useHistory();
  const cancelSource = useCancelToken();
  const { showSnackbar, updateBadget } = useFacets();
  const [state, setState] = useState<State>({
    items: [],
    address: null,
    orderSummary: {
      subtotal: 0,
      loading: true,
    },
    loaded: false,
    isSubmitting: false,
    isProcessingPayment: false,
    isOrderPlaced: false,
  });
  const [productQuantityHigh, setProductQuantityHigh] = useState<
    CartItem | undefined
  >(undefined);

  const validateConditions = (
    items: CartItem[] | null,
    address: Address | null | boolean
  ) => {
    if (items && items.length === 0) {
      history.replace("/cart");
      return;
    }

    if (!address) {
      showSnackbar("Обновите свой адрес, прежде чем продолжить", "info");
      history.push("/address");
      return;
    }
    //check if one of the products quantity is too high
    const product = items
      ? items.find((item) => {
          if (item.product.quantity < item.quantity) {
            return true;
          }
          return false;
        })
      : undefined;
    setProductQuantityHigh(product);
  };

  useEffect(
    () => {
      Promise.all([
        getCartItems(cancelSource.current?.token)
          .then((response) => {
            const items = response.data;
            const orderSummary = calculateOrderSummary(items);
            setState((s) => ({ ...s, items, orderSummary }));
            return items;
          })
          .catch((err) => {
            if (!axios.isCancel(err)) {
              showSnackbar(
                "Failed to load items, please try again later",
                "error"
              );
            }
            return null;
          }),
        getAddress(cancelSource.current?.token)
          .then((response) => {
            setState((s) => ({ ...s, address: response.data }));
            return response.data;
          })
          .catch((err) => {
            if (!axios.get(err)) {
              showSnackbar(
                "Failed to load your address, please try again later",
                "error"
              );
            }
            return true;
          }),
      ]).then(([items, address]) => {
        setState((s) => ({ ...s, loaded: true }));
        validateConditions(items, address);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const placeOrder = () => {
    setState({ ...state, isSubmitting: true });

    setState((s) => ({
      ...s,
      isProcessingPayment: true,
      error: undefined,
    }));
    processPayment(cancelSource.current?.token)
      .then((response) => {
        setState((s) => ({
          ...s,
          isSubmitting: false,
          isProcessingPayment: false,
          isOrderPlaced: true,
          orderId: response.data.orderId,
        }));
        updateBadget(0);
      })
      .catch((err) => {
        console.log(err);
        setState((s) => ({
          ...s,
          isSubmitting: false,
          isProcessingPayment: false,
          error: err.response.data.error,
        }));
      });
  };

  return (
    <Box m="60px auto" p="0 3vw" maxWidth="1500px">
      {!state.isOrderPlaced ? (
        <>
          <Box m="0 0 30px 16px" fontWeight={700} fontSize="h4.fontSize">
            Оплата
          </Box>
          {state.address &&
          state.items.length > 0 &&
          state.loaded &&
          !productQuantityHigh ? (
            <>
              {state.error && (
                <Alert className={classes.alert} severity="error">
                  {state.error}
                </Alert>
              )}
              <div className={classes.root}>
                <div className={classes.mainContainer}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        label="Номер карточки"
                        name="ccnumber"
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        label="Срок действия"
                        name="ccexp"
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                        label="CVC"
                        name="cvc"
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </div>
                <OrderSummary
                  subtotal={state.orderSummary.subtotal}
                  loading={state.orderSummary.loading}
                  onClick={placeOrder}
                  isSubmitting={state.isSubmitting}
                />
              </div>
            </>
          ) : (
            <div className={classes.loading}>
              <CircularProgress disableShrink size={50} />
            </div>
          )}
        </>
      ) : (
        <>
          <Typography
            className={classes.successText}
            variant="h3"
            color="primary"
          >
            Спасибо за заказ!
          </Typography>
          <Typography className={classes.orderID} variant="h5">
            Идентификатор заказа: <b>{state.orderId}</b>
          </Typography>
        </>
      )}
      <Dialog open={Boolean(productQuantityHigh)}>
        <DialogTitle>Not Enough Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`The quantity requested for the product "${productQuantityHigh?.product.name}" exceeds the online inventory (${productQuantityHigh?.product.quantity}).`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton component={Link} to="/cart" color="primary">
            return to cart
          </CustomButton>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={state.isProcessingPayment}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </Box>
  );
};

export default Payment;
