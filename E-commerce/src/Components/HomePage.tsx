import { Container, Col, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {

    const {user, isAuthenticated} = useAuth0()
    
    return (
        <Container>
            <Col>
            {isAuthenticated && user ? (
                    <>
                        <Row className="Welcome m-4 text-center display-3">
                            <b>Welcome Back {user.name}!</b>
                        </Row>
                        <Row className="m-4 text-center">
                            <h4>We appreciate your continued support!</h4>
                        </Row>
                    </>
                ) : (
                    <Row className="m-4 text-center">
                        <h4>Please log in to access your account.</h4>
                    </Row>
                )}
            </Col>
        </Container>
    );
};

export default HomePage;