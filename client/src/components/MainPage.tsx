import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Button, Container, Row, Col, Table, Toast} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {observer} from "mobx-react-lite";
import {IUser} from "../models/IUser";
import UserService from "../services/UserService";

interface ToastMessage {
    id: number;
    message: string;
}

const MainPage: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
            setSelectedIds([]);
        } catch (e) {
            console.log(e);
        }
    }

    async function handleBlockUnblockDelete(action: string) {
        let result;
        switch (action) {
            case "block":
                result = await UserService.blockUsers(selectedIds);
                break;
            case "unblock":
                result = await UserService.unblockUsers(selectedIds);
                break;
            case "delete":
                result = await UserService.deleteUsers(selectedIds);
                break;
            default:
                return;
        }

        if (result.status === 200) {
            setToastMessages(prev => [...prev, {id: Date.now(), message: "Operation completed successfully"}]);
        } else {
            result.forEach((err: any) => {
                setToastMessages(prev => [...prev, {id: Date.now(), message: `${err.message}`}]);
            });
        }

        if (result.data.logoutRequired === true) {
            return await store.logout();
        }

        await getUsers();
    }

    function closeToast(id: number) {
        setToastMessages(prev => prev.filter(msg => msg.id !== id));
    }

    return (
        <Container>
            <div className="w-100" style={{ minWidth: "445px" }}>
                <hr />
                <Row className="mb-3">
                    <Col>
                        <h2>User panel</h2>
                    </Col>
                    <Col className="text-end">
                        <Button variant="outline-primary" onClick={() => store.logout()}>Log out</Button>
                    </Col>
                </Row>
                <hr />
                <Row bg="light" variant="light" className="mb-3">
                    <Col className="d-flex justify-content-between">
                        <Button variant="outline-primary" onClick={getUsers}>Refresh</Button>
                        <div className="d-flex gap-3">
                            <Button variant="outline-primary" className="mr-4" onClick={() => handleBlockUnblockDelete("block")}>Block</Button>
                            <Button variant="outline-primary" className="mr-2" onClick={() => handleBlockUnblockDelete("unblock")}>Unblock</Button>
                            <Button variant="outline-danger" onClick={() => handleBlockUnblockDelete("delete")}>Delete</Button>
                        </div>
                    </Col>
                </Row>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>
                            <input type="checkbox" onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(users.map(user => user._id));
                                } else {
                                    setSelectedIds([]);
                                }
                            }}/>
                        </th>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                        <th>Last Login</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => {
                        return (
                            <tr key={user._id}>
                                <td>
                                    <input type="checkbox" checked={selectedIds.includes(user._id)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(prev => [...prev, user._id]);
                                        } else {
                                            setSelectedIds(prev => prev.filter(id => id !== user._id));
                                        }
                                    }}/>
                                </td>
                                <td style={{ wordWrap: 'break-word', maxWidth: "75px" }}>{user._id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.registrationDate).toDateString()}</td>
                                <td>{new Date(user.lastLogin).toDateString()}</td>
                                <td>{user.status}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                {toastMessages.map(toast => (
                    <div key={toast.id} style={{position: 'fixed', bottom: 20, right: 20}}>
                        <Toast onClose={() => closeToast(toast.id)} delay={3000} autohide>
                            <Toast.Header>
                                <strong className="mr-auto">Notification</strong>
                            </Toast.Header>
                            <Toast.Body>{toast.message}</Toast.Body>
                        </Toast>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default observer(MainPage);