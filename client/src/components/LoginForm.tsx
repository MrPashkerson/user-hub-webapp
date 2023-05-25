import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {Form, Button, Container, Row, Col, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {observer} from "mobx-react-lite";

interface LoginFormProps {
    switchToRegister: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ switchToRegister }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);

    const [error, setError] = useState<string | null>(null);

    async function handleLogin() {
        try {
            await store.login(email, password);
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
                        <h2 className="text-center mb-4">Login</h2>
                        <Form  className="mb-2">
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
                                {/*{error && <Alert variant='danger'>{error}</Alert>}*/}
                            </Form.Group>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Button variant="primary" onClick={handleLogin} className="w-100">Log in</Button>
                        </Form>
                        <p>Don't have an account? <span
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={switchToRegister}>Sign up
                        </span>
                        </p>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default observer(LoginForm);