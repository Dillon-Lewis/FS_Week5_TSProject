import { Component } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Product {
  product_name: string;
  price: number;
  product_description: string;
  isLoading: boolean;
  error: string | null;
  showSuccessModal: boolean;
}

class AddProduct extends Component<{}, Product> {
  constructor(props: {}) {
    super(props);
    this.state = {
      product_name: "",
      price: 0,
      product_description: "",
      errors: {},
      isLoading: false,
      error: null,
      showSuccessModal: false,
    };
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length === 0) {
      this.setState({ isLoading: true, error: null });

      const productData = {
        product_name: this.state.product_name.trim(),
        price: this.state.price,
        product_description: this.state.product_description.trim(),
      };

      axios
        .post("http://127.0.0.1:5000/products", productData)
        .then(() => {
          this.setState({ showSuccessModal: true, isLoading: false });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          this.setState({ error: error.toString(), isLoading: false });
        });
    } else {
      this.setState({ errors });
    }
  };

  validateForm = () => {
    const { product_name, price, product_description } = this.state;
    const errors: Record<string, string> = {};
    if (!product_name) errors.product_name = "Name is required";
    if (price <= 0) errors.price = "Price must be a positive number";
    if (!product_description)
      errors.product_description = "Short description required";
    return errors;
  };

  handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    this.setState((oldState) => ({
      ...oldState,
      [name]: value,
    }));
  };

  closeModal = () => {
    this.setState({
      showSuccessModal: false,
      product_name: "",
      price: 0,
      product_description: "",
      errors: {},
    });
  };

  render() {
    const {
      product_name,
      price,
      product_description,
      showSuccessModal,
      error,
      errors,
    } = this.state;

    return (
      <Container>
        {error && (
          <Alert variant="danger">Error submitting product: {error}</Alert>
        )}
        <h2 className="text-center my-4">
          Super Saver Product Registration Form
        </h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="product_name"
              value={product_name}
              onChange={this.handleChange}
            />
            {errors.product_name && (
              <div style={{ color: "red" }}>{errors.product_name}</div>
            )}
          </Form.Group>

          <Form.Group controlId="formGroupPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={price}
              onChange={this.handleChange}
            />
            {errors.price && <div style={{ color: "red" }}>{errors.price}</div>}
          </Form.Group>

          <Form.Group controlId="formGroupDescription">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="product_description"
              value={product_description}
              onChange={this.handleChange}
            />
            {errors.product_description && (
              <div style={{ color: "red" }}>{errors.product_description}</div>
            )}
          </Form.Group>

          <Button
            variant="outline-danger"
            type="submit"
            className="mt-3 mb-3"
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? "Submitting..." : "Submit Product"}
          </Button>
        </Form>

        <Modal show={showSuccessModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Congratulations!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your product has been successfully added!</Modal.Body>
          <Modal.Footer>
            <Link to="/products">
              <Button variant="danger" onClick={this.closeModal}>
                Go Save!
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default AddProduct;
