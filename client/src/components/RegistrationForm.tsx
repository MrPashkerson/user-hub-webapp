import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";

interface RegisterFormProps {
    switchToLogin: () => void;
}

const RegistrationForm: FC<RegisterFormProps> = ({ switchToLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);


    const [error, setError] = useState<string | null>(null);
    async function handleRegistration() {
        try {
            await store.registration(username, email, password);
        } catch (e) {
            // @ts-ignore
            setError(e);
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Row>
                    <Col>
                        <h2 className="text-center mb-4">Sign up</h2>
                        <Form  className="mb-2">
                            <Form.Group controlId="formBasicText" className="mb-3">
                                <Form.Control
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    type="text"
                                    placeholder='Username'
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Control
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    type="text"
                                    placeholder='Email'
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mb-4">
                                <Form.Control
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    type="password"
                                    placeholder='Password'
                                />
                            </Form.Group>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Button variant="primary" onClick={handleRegistration} className="w-100">Sign up</Button>
                        </Form>
                        <p>Already have an account? <span
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={switchToLogin}>Log in
                        </span>
                        </p>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default observer(RegistrationForm);