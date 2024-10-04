import React, { Component } from 'react';
import { ListGroup, Button, Container, Alert, Accordion } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addItem } from '../Redux/cartSlice'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface Product {
    id: number;
    product_name: string;
    price: number;
    product_description: string;
}

interface State {
    product: Product[];
    error: string | null;
}

interface Props {
    addItem: (item: { userId: string; product_id: number; product_name: string; price: number; quantity: number }) => void;
}

const ProductsList: React.FC<Props> = ({ addItem }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://127.0.0.1:5000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching products. Please try again later.');
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        if (!isAuthenticated) {
            alert('Please log in to add items to your cart.');
            return;
        }

        const item = {
            userId: user?.sub || '', // Using the Auth0 user ID
            product_id: product.id,
            product_name: product.product_name,
            price: product.price,
            quantity: 1,
        };
        addItem(item);
        alert('Product added to your cart!');
    };

    const deleteProduct = (productId: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`http://127.0.0.1:5000/products/${productId}`)
                .then(() => {
                    setProducts(products.filter(product => product.id !== productId));
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    setError('Error deleting product. Please try again later.');
                });
        } 
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <h2 className='text-center my-4'>Most Popular Products</h2>
            <ListGroup>
                {products.map(product => (
                    <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                        <Accordion flush>
                            <Accordion.Item eventKey={product.id.toString()}>
                                <Accordion.Header>{product.product_name}</Accordion.Header>
                                <Accordion.Body>
                                    <h5>Price</h5>
                                    <p>{product.price}</p>
                                    <h5>Short Description</h5>
                                    <p>{product.product_description}</p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Button variant="outline-danger" onClick={() => deleteProduct(product.id)}>
                            Delete
                        </Button>
                        <Button variant="success"  onClick={() => addToCart(product)}>
                            Add to Cart
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <br />
            <h6>Feel like we are missing out on a top seller?</h6>
            <br />
            <Link to={'/addproduct'}>
                <Button variant='danger'>Add a product</Button>
            </Link>
        </Container>
    );
};

const mapDispatchToProps = {
    addItem,
};

export default connect(null, mapDispatchToProps)(ProductsList);
