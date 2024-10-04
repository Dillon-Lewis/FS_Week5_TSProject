import { Component } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Customer {
    name: string;
    email: string;
    phone: string;
    user_password: string;
    confirm_password: string
    isLoading: boolean;
    error: string | null;
    showSuccessModal: boolean;
}

class AddCustomer extends Component<{}, Customer> {
    constructor(props: {}) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            user_password: '',
            confirm_password: '',
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

            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim(),
                user_password: this.state.user_password.trim(),
            };

            axios.post('http://127.0.0.1:5000/customers', customerData)
                .then(() => {
                    this.setState({
                        showSuccessModal: true,
                        isLoading: false,
                    });
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    this.setState({ error: error.toString(), isLoading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    validateForm = () => {
        const { name, email, phone, user_password, confirm_password } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!phone) errors.phone = 'Phone is required';
        if (!user_password) errors.user_password = 'Password is required';
        if (user_password !== confirm_password) errors.confirm_password = 'Passwords do not match';
        
        return errors;
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState((oldState) => ({
            ...oldState,
            [name]: value,
          }));
        };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: '',
            email: '',
            phone: '',
            user_password: '',
            confirm_password: '',
            errors: {},
        });
    };

    render() {
        const { name, email, phone, user_password, confirm_password, isLoading, showSuccessModal, error, errors } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting Customer Data....</Alert>}
                {error && <Alert variant="danger">Error Submitting Customer: {error}</Alert>}
                <h2 className='text-center my-4'>Super Saver Loyalty Application</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name" 
                            value={name} 
                            onChange={this.handleChange} 
                            autoComplete="off" 
                        />
                        {errors.name && <div style={{ color: 'red'}}>{errors.name}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={email} 
                            onChange={this.handleChange} 
                            autoComplete="off" 
                        />
                        {errors.email && <div style={{ color: 'red'}}>{errors.email}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control 
                            type="tel" 
                            name="phone" 
                            value={phone} 
                            onChange={this.handleChange} 
                            autoComplete="off" 
                        />
                        {errors.phone && <div style={{ color: 'red'}}>{errors.phone}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="user_password" 
                            value={user_password} 
                            onChange={this.handleChange} 
                            autoComplete="off" 
                        />
                        {errors.user_password && <div style={{ color: 'red'}}>{errors.user_password}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="confirm_password" 
                            value={confirm_password} 
                            onChange={this.handleChange} 
                            autoComplete="off" 
                        />
                        {errors.confirm_password && <div style={{ color: 'red'}}>{errors.confirm_password}</div>}
                    </Form.Group>

                    <Button variant="outline-danger" type="submit" className="mt-3 mb-3">Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Congratulations!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Welcome to the Super Savers Club!</Modal.Body>
                    <Modal.Footer>
                        <Link to='/products'>
                            <Button variant="danger" onClick={this.closeModal}>Go Save!</Button>
                        </Link>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default AddCustomer;
