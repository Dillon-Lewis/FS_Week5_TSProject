import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../Redux/cartSlice";
import { Button, ListGroup, Container, Form, Alert } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState("");

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0.0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address || !zip || !state) {
      setError("Please Fill out the rest of your address for proper shipping");
      return;
    }

    alert("Your order will arrive in 7-10 business days!");
    dispatch(clearCart());
    setAddress("");
    setState("");
    setZip("");
    setError("");
  };

  return (
    <Container>
      <h2>Your Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {items.map((item) => (
              <ListGroup.Item
                key={item.product_id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5>{item.product_name}</h5>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div>
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch(decreaseQuantity(item.product_id))}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch(increaseQuantity(item.product_id))}
                  >
                    +
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h4>Total Price of your cart: ${total}</h4>
        </>
      )}
      <Form onSubmit={handleSubmit} className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <InputGroup controlId="formAddress">
          <InputGroup.Text>Shipping Address</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Zip Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" type="submit" className="mt-2">
          Confirm Order
        </Button>
      </Form>
    </Container>
  );
};

export default ShoppingCart;
